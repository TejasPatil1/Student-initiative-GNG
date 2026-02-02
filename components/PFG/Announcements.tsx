"use client"

import useSWR, { mutate } from "swr"
import { useMemo, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"

/* -------------------------------------------------------------------------- */
/* TYPES                                   */
/* -------------------------------------------------------------------------- */

type Announcement = {
  id: string
  title: string
  content: string
  category: string
  created_at: string
}

const CATEGORIES = ["General", "Exam", "Event", "Urgent", "Placement"]

/* -------------------------------------------------------------------------- */
/* LOGIC / API                                 */
/* -------------------------------------------------------------------------- */

// 1. Fetcher for reading announcements
const fetcher = async (): Promise<Announcement[]> => {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching announcements:", error)
    return []
  }

  return data || []
}

// 2. Helper to format dates nicely
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                 */
/* -------------------------------------------------------------------------- */

export default function AnnouncementsPage() {
  const { data } = useSWR("supabase-announcements", fetcher)

  // -- UI States --
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // -- Form States --
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ title: "", content: "", category: "General" })

  // -- Derived Data (Filtering) --
  const filtered = useMemo(() => {
    if (!data) return []
    return data.filter((item) => {
      if (selectedCategory && item.category !== selectedCategory) return false
      if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) && !item.content.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })
  }, [data, selectedCategory, searchTerm])

  // -- Handlers --
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const supabase = getSupabaseClient()
    if (supabase) {
      const { error } = await supabase.from("announcements").insert([formData])
      
      if (!error) {
        // Reset and refresh
        setFormData({ title: "", content: "", category: "General" })
        setIsModalOpen(false)
        mutate("supabase-announcements") // Refresh list instantly
      } else {
        alert("Error posting announcement")
        console.error(error)
      }
    }
    setIsSubmitting(false)
  }

  return (
    <section className="min-h-screen space-y-6 relative">
      
      {/* ---------------------------- HEADER ---------------------------- */}
      <header className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          Announcements Board
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Stay updated with the latest news, exams, and events
        </p>
      </header>

      {/* ----------------------- FILTER & ACTION BAR ---------------------- */}
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center sticky top-4 z-10">
        
        {/* Left: Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-grow">
          <div className="relative group w-full sm:w-64">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <input 
               type="text" 
               placeholder="Search updates..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-9 w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 transition-all"
             />
          </div>

          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Right: Add Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 hover:shadow-primary/25 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Post Update
        </button>
      </div>

      {/* -------------------------- CARDS GRID -------------------------- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
           <div className="col-span-full py-12 text-center text-muted-foreground">
             No announcements found.
           </div>
        ) : (
          filtered.map((item) => (
            <div 
              key={item.id} 
              className="bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col group"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                  item.category === 'Urgent' 
                    ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                    : 'bg-primary/10 text-primary border-primary/20'
                }`}>
                  {item.category}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {formatDate(item.created_at)}
                </span>
              </div>

              {/* Card Content */}
              <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {item.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* ------------------------ CREATE MODAL ------------------------ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h3 className="text-xl font-bold mb-4">New Announcement</h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g., Mid-Term Exam Schedule"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Type the details here..."
                />
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
                  {isSubmitting ? "Posting..." : "Post Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  )
}