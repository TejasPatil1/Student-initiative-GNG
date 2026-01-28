"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import Link from "next/link"

type Assignment = {
  name: string
  subject: string
  semester: string
  link: string
}

async function downloadPDF(url: string, filename: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Download failed");

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${filename}.pdf`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error(err);
    alert("Failed to download PDF");
  }
}


const fetcher = async (): Promise<Assignment[]> => {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("pdfs")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  return (data || [])
  .filter(d => d.status === "approved" && d.doc_type === "Assignment")
  .map(d => ({
    name: d.title,
    subject: d.subject,
    semester: d.semester,
    link: `${baseUrl}/storage/v1/object/public/pdfs/${d.file_path}`,
  }));

};


export function AssignmentsPage() {
  const { data } = useSWR<Assignment[]>("assignments-supabase", fetcher)
  const [values, setValues] = useState<Record<string, string>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  const subjects = useMemo(
    () => Array.from(new Set((data ?? []).map((d) => d.subject))).sort(),
    [data]
  )

  const semesters = useMemo(
    () => Array.from(new Set((data ?? []).map((d) => d.semester))).sort(),
    [data]
  )

  const filtered = useMemo(() => {
    if (!data) return []

    const result = data.filter((d) => {
      if (values.subject && d.subject !== values.subject) return false
      if (values.semester && d.semester !== values.semester) return false
      if (searchTerm && !d.name.toLowerCase().includes(searchTerm.toLowerCase()))
        return false
      return true
    })

    if (sortBy === "newest") {
      result.sort((a, b) => b.name.localeCompare(a.name))
    } else if (sortBy === "oldest") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [data, values, searchTerm, sortBy])

  const set = (k: string, v: string) =>
    setValues((s) => ({ ...s, [k]: v }))

  const resetFilters = () => {
    setValues({})
    setSearchTerm("")
    setSortBy("newest")
  }

  return (
    <section className="space-y-6">
      {/* ---------- UI BELOW IS UNCHANGED ---------- */}

      <header className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          Assignments Hub
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Share, discover, and explore the best programming assignments
        </p>
      </header>

      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
            />
          </svg>
          Filter & Search
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Search Assignments
            </label>
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Subject
            </label>
            <select
              value={values.subject || ""}
              onChange={(e) => set("subject", e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background"
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Semester
            </label>
            <select
              value={values.semester || ""}
              onChange={(e) => set("semester", e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background"
            >
              <option value="">All Semesters</option>
              {semesters.map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <button
          onClick={resetFilters}
          className="px-4 py-2 rounded-lg border border-border bg-background"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <p className="text-center col-span-full text-muted-foreground">
            No assignments found
          </p>
        ) : (
          filtered.map((a) => (
            <div
              key={`${a.name}-${a.semester}`}
              className="bg-card border border-border rounded-xl p-4"
            >
              <h3 className="font-semibold">{a.name}</h3>
              <p className="text-sm text-muted-foreground">
                {a.subject} • Semester {a.semester}
              </p>

              <button
                onClick={() => downloadPDF(a.link, a.name)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors mt-3"
              >
                Download PDF
              </button>
            </div>
          ))
        )}
      </div>

      {/* ---------- NEW SUBMIT SECTION ---------- */}
      <div className="flex flex-col items-center justify-center py-8 border-t border-border/50 mt-8">
        <p className="text-muted-foreground text-sm mb-4">
          Have an assignment to share with the community?
        </p>
        <Link
  href="/Submit"
  className="group flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg hover:shadow-primary/25 hover:bg-primary/90 hover:scale-105 transition-all duration-300"
>
  <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
  Submit Assignment
</Link>
      </div>

    </section>
  )
}