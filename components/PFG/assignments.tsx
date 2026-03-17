"use client"

import useSWR, { mutate } from "swr"
import { useMemo, useState, ChangeEvent, FormEvent } from "react"
import { getSupabaseClient } from "@/lib/supabase"

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type Assignment = {
  id: string
  name: string
  subject: string
  semester: string
  link: string
  created_at: string
}

/* -------------------------------------------------------------------------- */
/* LOGIC / HELPERS                                                            */
/* -------------------------------------------------------------------------- */

// 1. Download Helper
async function downloadPDF(url: string, filename: string) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error("Download failed")

    const blob = await res.blob()
    const blobUrl = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = blobUrl
    a.download = `${filename}.pdf`
    document.body.appendChild(a)
    a.click()

    document.body.removeChild(a)
    window.URL.revokeObjectURL(blobUrl)
  } catch (err) {
    console.error(err)
    alert("Failed to download PDF")
  }
}

// 2. Data Fetcher (ONLY SHOWS APPROVED)
const fetcher = async (): Promise<Assignment[]> => {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("pdfs")
    .select("*")
    .eq("status", "approved") // <--- STRICT FILTER
    .eq("doc_type", "Assignment")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Supabase error:", error)
    return []
  }

  const baseUrl = process.env.Supabase_URL!

  return (data || []).map((d) => ({
    id: d.id,
    name: d.title,
    subject: d.subject,
    semester: d.semester,
    link: `${baseUrl}/storage/v1/object/public/pdfs/${d.file_path}`,
    created_at: d.created_at
  }))
}

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                                             */
/* -------------------------------------------------------------------------- */

export function AssignmentsPage() {
  const { data, isLoading } = useSWR<Assignment[]>("assignments-supabase", fetcher)

  // -- UI States --
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  // -- Form States --
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formTitle, setFormTitle] = useState("")
  const [formSubject, setFormSubject] = useState("")
  const [formYear, setFormYear] = useState("")
  const [formFile, setFormFile] = useState<File | null>(null)

  // -- Derived Data (Filtering) --
  const subjects = useMemo(() => Array.from(new Set((data ?? []).map((d) => d.subject))).sort(), [data])
  const semesters = useMemo(() => Array.from(new Set((data ?? []).map((d) => d.semester))).sort(), [data])

  const filtered = useMemo(() => {
    if (!data) return []
    let result = data.filter((d) => {
      if (selectedSubject && d.subject !== selectedSubject) return false
      if (selectedSemester && d.semester !== selectedSemester) return false
      if (searchTerm && !d.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })
    
    if (sortBy === "newest") result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    else if (sortBy === "oldest") result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    else if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name))

    return result
  }, [data, selectedSubject, selectedSemester, searchTerm, sortBy])

  // -- Handlers --
  const resetFilters = () => {
    setSelectedSubject("")
    setSelectedSemester("")
    setSearchTerm("")
    setSortBy("newest")
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
        if (selected.type !== "application/pdf") return alert("Only PDF files are allowed.")
        if (selected.size > 10 * 1024 * 1024) return alert("File size must be under 10MB.")
        setFormFile(selected)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!formFile) return alert("Please upload a PDF.")

    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      setIsSubmitting(true)
      
      // 1. Upload File
      const fileName = `${Date.now()}-${formFile.name}`
      const { data: uploadData, error: storageError } = await supabase.storage
        .from("pdfs")
        .upload(fileName, formFile)

      if (storageError) throw storageError

      // 2. Insert Record with STATUS: PENDING
      const { error: dbError } = await supabase.from("pdfs").insert({
        title: formTitle,
        subject: formSubject,
        semester: formYear,
        doc_type: "Assignment",
        file_path: uploadData.path,
        status: "pending", // <--- CRITICAL FIX: Ensures it doesn't show up immediately
      })

      if (dbError) throw dbError

      // 3. Reset & Close
      setIsModalOpen(false)
      setFormTitle("")
      setFormSubject("")
      setFormYear("")
      setFormFile(null)
      
      // 4. Feedback (No mutate needed as it won't show up anyway)
      alert("Submission successful! Your assignment is pending admin approval.")

    } catch (err: any) {
      console.error(err)
      alert(err.message || "Upload failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="min-h-screen space-y-6 relative">
      
      {/* ---------------------------- HEADER ---------------------------- */}
      <header className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          Assignments Hub
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Share, discover, and explore the best programming assignments
        </p>
      </header>

      {/* ----------------------- STICKY FILTER BAR ---------------------- */}
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 sm:p-6 shadow-sm flex flex-col gap-4 sticky top-4 z-10 transition-all">
        
        {/* Search & Action Row */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="relative group w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search assignments..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
             <button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Upload New
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select 
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors"
          >
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select 
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors"
          >
            <option value="">All Semesters</option>
            {semesters.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A-Z)</option>
          </select>

           <button 
            onClick={resetFilters}
            className="px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* -------------------------- CARDS GRID -------------------------- */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
             <div key={i} className="h-40 bg-card/50 rounded-xl animate-pulse border border-border" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground bg-card/30 rounded-xl border border-dashed border-border">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <p>No assignments found matching your criteria.</p>
            <button onClick={resetFilters} className="text-primary hover:underline mt-2 text-sm">Clear filters</button>
          </div>
        ) : (
          filtered.map((item) => (
            <div 
              key={item.id} 
              className="bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 flex flex-col group h-full justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {item.semester}
                  </span>
                  <div className="p-2 bg-muted rounded-full group-hover:bg-primary/10 transition-colors">
                     <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                </div>

                <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 font-medium">
                  {item.subject}
                </p>
              </div>

              <button 
                onClick={() => downloadPDF(item.link, item.name)}
                className="w-full mt-auto py-2.5 bg-muted/50 text-foreground hover:bg-primary hover:text-primary-foreground font-medium rounded-lg transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download PDF
              </button>
            </div>
          ))
        )}
      </div>

      {/* ------------------------ SUBMIT MODAL ------------------------ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h3 className="text-xl font-bold mb-1">Upload Assignment</h3>
            <p className="text-sm text-muted-foreground mb-5">Contribute materials for your batchmates</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  required 
                  type="text" 
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
                  placeholder="e.g. Data Structures Lab Manual"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input 
                    required 
                    type="text" 
                    value={formSubject}
                    onChange={e => setFormSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
                    placeholder="e.g. DBMS"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <select 
                    required
                    value={formYear}
                    onChange={e => setFormYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="" disabled>Select</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium mb-1">PDF File</label>
                <div className="relative border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-muted/30 transition-colors">
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center text-sm">
                    {formFile ? (
                      <span className="text-primary font-semibold flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        {formFile.name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Click to upload PDF (Max 10MB)</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg shadow hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmitting ? "Uploading..." : "Submit for Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  )
}