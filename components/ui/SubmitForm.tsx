"use client";
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
} from "react";
import { getSupabaseClient } from "@/lib/supabase";

/* Icons (black) */
const UploadIcon = () => (
  <svg className="w-8 h-8 text-black mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const FileIcon = () => (
  <svg className="w-5 h-5 text-black mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default function SubmitForm() {
  /* ✅ ALL HOOKS FIRST (NO RETURNS ABOVE THIS) */
  const [mounted, setMounted] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState("PYQ");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ✅ Client-only init */
  useEffect(() => {
    setMounted(true);
    const client = getSupabaseClient();
    setSupabase(client);
  }, []);

  /* ✅ SAFE CONDITIONAL RENDER (AFTER HOOKS) */
  if (!mounted || !supabase) {
    return null;
  }

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      alert("File size must be under 10MB.");
      return;
    }

    setFile(selected);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please upload a PDF.");

    try {
      setIsSubmitting(true);

      const fileName = `${Date.now()}-${file.name}`;
      const { data, error: storageError } = await supabase.storage
        .from("pdfs")
        .upload(fileName, file);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase.from("pdfs").insert({
        title,
        subject,
        semester: year,
        doc_type: type,
        file_path: data.path,
        status: "pending",
      });

      if (dbError) throw dbError;

      alert("Submitted! Awaiting admin approval.");

      setTitle("");
      setSubject("");
      setYear("");
      setType("PYQ");
      setFile(null);
    } catch (err: any) {
  console.error("FULL ERROR:", err);
  alert(err?.message || "Upload failed");
}
 {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-black">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border">
        <div className="p-6 text-center border-b">
          <h2 className="text-2xl font-bold text-black">Contribute Material</h2>
          <p className="text-sm text-black mt-1">
            Help your juniors by uploading PYQs or Assignments
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <input
            className="w-full px-4 py-2 border rounded-lg text-black"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              className="w-full px-4 py-2 border rounded-lg text-black"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <select
              className="w-full px-4 py-2 border rounded-lg text-black"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            >
              <option value="" disabled>Select Year</option>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
          </div>

          <div className="flex gap-4">
            {["PYQ", "Assignment"].map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={type === opt}
                  onChange={() => setType(opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>

          <div className="relative border-2 border-dashed rounded-lg p-6 text-center">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFile}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {file ? (
              <div className="flex justify-center items-center">
                <FileIcon />
                {file.name}
              </div>
            ) : (
              <>
                <UploadIcon />
                <p className="text-sm">Click to upload PDF (max 10MB)</p>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-black text-white rounded-lg"
          >
            {isSubmitting ? "Uploading..." : "Submit Material"}
          </button>
        </form>
      </div>
    </div>
  );
}
