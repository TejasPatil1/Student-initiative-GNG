"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import Link from "next/link"

type PYQ = {
  name: string
  subject: string
  year: string
  type: string
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

/* 🔁 Supabase fetcher */
const fetcher = async (): Promise<PYQ[]> => {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("pdfs")
    .select("*")
    .eq("status", "approved")
    .eq("doc_type", "PYQ")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Supabase PYQ fetch error:", error)
    return []
  }

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  return (data || []).map((d) => ({
    name: d.title,
    subject: d.subject,
    year: d.semester, // you are using "year" in UI, DB has "semester"
    type: d.doc_type,
    link: `${baseUrl}/storage/v1/object/public/pdfs/${d.file_path}`,
  }))
}

export function PYQsPage() {
  const { data } = useSWR("supabase-pyqs", fetcher)

  const [values, setValues] = useState<Record<string, string>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  const subjects = useMemo(
    () => Array.from(new Set((data ?? []).map((d) => d.subject))).sort(),
    [data]
  )

  const years = useMemo(
    () =>
      Array.from(new Set((data ?? []).map((d) => d.year)))
        .sort()
        .reverse(),
    [data]
  )

  const types = useMemo(
    () => Array.from(new Set((data ?? []).map((d) => d.type))).sort(),
    [data]
  )

  const filtered = useMemo(() => {
    if (!data) return []

    const result = data.filter((d) => {
      if (values.subject && d.subject !== values.subject) return false
      if (values.year && d.year !== values.year) return false
      if (values.type && d.type !== values.type) return false
      if (searchTerm && !d.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })

    if (sortBy === "newest") {
      result.sort((a, b) => b.year.localeCompare(a.year))
    } else {
      result.sort((a, b) => a.year.localeCompare(b.year))
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
      <header className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          Previous Year Questions
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Access and explore previous year exam questions by subject, year, and type
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="search" className="text-sm font-medium text-muted-foreground">
              Search PYQs
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Subject Filter */}
          <div className="flex flex-col gap-2">
            <label htmlFor="subject" className="text-sm font-medium text-muted-foreground">
              Subject
            </label>
            <select
              id="subject"
              value={values.subject || ""}
              onChange={(e) => set("subject", e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex flex-col gap-2">
            <label htmlFor="year" className="text-sm font-medium text-muted-foreground">
              Year
            </label>
            <select
              id="year"
              value={values.year || ""}
              onChange={(e) => set("year", e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex flex-col gap-2">
            <label htmlFor="type" className="text-sm font-medium text-muted-foreground">
              Type
            </label>
            <select
              id="type"
              value={values.type || ""}
              onChange={(e) => set("type", e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="">All Types</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex flex-col gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-muted-foreground">
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-card text-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset Filters
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <svg
              className="w-12 h-12 text-muted-foreground/50 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-foreground mb-1">No PYQs found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your filters to find what you're looking for</p>
          </div>
        ) : (
          filtered.map((q) => (
            <div
              key={`${q.name}-${q.year}-${q.type}`}
              className="group bg-card border border-border rounded-xl p-4 sm:p-5 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col gap-3"
            >
              <div className="flex flex-col gap-2 flex-grow">
                <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {q.name}
                </h3>
                <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-primary/60"></span>
                    {q.subject}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-primary/60"></span>
                    {q.year}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-primary/60"></span>
                    {q.type}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  PDF
                </div>
                <button
                  onClick={() => downloadPDF(q.link, q.name)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Download PDF
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ---------- NEW SUBMIT SECTION ---------- */}
      <div className="flex flex-col items-center justify-center py-8 border-t border-border/50 mt-8">
        <p className="text-muted-foreground text-sm mb-4">
          Have a question paper to share with the community?
        </p>
       <Link
  href="/Submit"
  className="group flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg hover:shadow-primary/25 hover:bg-primary/90 hover:scale-105 transition-all duration-300"
>
  <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
  Submit PYQ
</Link>
      </div>

    </section>
  )
}