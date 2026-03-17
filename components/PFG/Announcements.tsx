"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { getAnnouncementsSupabaseClient } from "@/lib/supabaseAnnouncements"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Announcement = {
  id: string
  title: string
  description: string
  created_at: string
  file_url?: string
}

const fetcher = async (): Promise<Announcement[]> => {
  const supabase = getAnnouncementsSupabaseClient()
  if (!supabase) return []

  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })

  return data || []
}

export default function AnnouncementsPage() {
  const { data: announcements } = useSWR("supabase-announcements", fetcher)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })

  const [file, setFile] = useState<File | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = getAnnouncementsSupabaseClient()
    if (!supabase) {
      alert("Supabase client not initialized. Please check your environment variables.")
      setIsSubmitting(false)
      return
    }

    let file_url: string | null = null

    if (file) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ]

      if (!allowedTypes.includes(file.type)) {
        alert("Only PDF and image files are allowed")
        setIsSubmitting(false)
        return
      }

      const fileName = `${Date.now()}-${file.name}`

      const { error: uploadError } = await supabase.storage
        .from("announcements-images")
        .upload(fileName, file)

      if (uploadError) {
        console.error("Upload Error:", uploadError)
        
        // Check if it's a bucket not found error
        if (uploadError.message?.includes("Bucket not found") || uploadError.message?.includes("bucket not found")) {
          alert(
            "Bucket 'announcements-images' not found in your Supabase Announcements project.\n\n" +
            "Please create it:\n" +
            "1. Go to your Supabase Dashboard\n" +
            "2. Navigate to Storage\n" +
            "3. Create a new bucket named 'announcements-images'\n" +
            "4. Make it Public\n" +
            "5. Set proper policies for uploads"
          )
        } else {
          alert(`File upload failed: ${uploadError.message}`)
        }
        setIsSubmitting(false)
        return
      }

      const { data } = supabase.storage
        .from("announcements-images")
        .getPublicUrl(fileName)

      file_url = data.publicUrl
    }

    const { error } = await supabase.from("announcements").insert([
      {
        title: formData.title,
        description: formData.description,
        file_url,
      },
    ])

    if (!error) {
      setFormData({ title: "", description: "" })
      setFile(null)
      setIsModalOpen(false)
      mutate("supabase-announcements")
    } else {
      console.error("Database Error:", error)
      alert(`Error posting announcement: ${error.message}`)
    }

    setIsSubmitting(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          + Upload Announcement
        </Button>
      </div>

      {/* Announcement Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {announcements?.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 space-y-3">
              <h2 className="text-lg font-semibold">{item.title}</h2>

              <p className="text-sm text-muted-foreground">
                {new Date(item.created_at).toLocaleString()}
              </p>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>

              {item.file_url &&
                (item.file_url.endsWith(".pdf") ? (
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline font-medium"
                  >
                    View PDF
                  </a>
                ) : (
                  <img
                    src={item.file_url}
                    alt={item.title}
                    className="mt-3 w-full rounded-lg object-cover max-h-60"
                  />
                ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Announcement</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-3 sm:space-y-4">
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />

            {/* Professional File Upload */}
            <div className="space-y-2">
              <label htmlFor="fileUpload" className="cursor-pointer inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 w-full sm:w-auto justify-center sm:justify-start">
                + Choose File
              </label>
              
              <input
                id="fileUpload"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="hidden"
              />

              {file && (
                <span className="text-sm text-gray-600 truncate max-w-[120px] sm:max-w-[200px]">
                  {file.name}
                </span>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Uploading..." : "Submit"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
