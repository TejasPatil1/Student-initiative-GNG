"use client";

import React, { useState } from "react";
import useSWR from "swr";
import {
  Lock,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  Users,
  BarChart3,
  Check,
  X,
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/* ---------------- SUPABASE HELPERS ---------------- */

const fetchPending = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("pdfs")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
};

async function approvePdf(id: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  await supabase.from("pdfs").update({ status: "approved" }).eq("id", id);
}

async function rejectPdf(id: string, filePath: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  // delete file
  await supabase.storage.from("pdfs").remove([filePath]);
  // delete row
  await supabase.from("pdfs").delete().eq("id", id);
}

/* ---------------- ADMIN DASHBOARD ---------------- */

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const { data, mutate } = useSWR("pending-pdfs", fetchPending);

  return (
    <div className="flex h-screen bg-gray-50 text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-6 font-bold text-xl border-b">AdminPanel</div>

        <nav className="p-4 space-y-2 flex-1">
          <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <LayoutDashboard size={18} /> Dashboard
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-black">
            <Users size={18} /> Users
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-black">
            <BarChart3 size={18} /> Analytics
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-black">
            <Settings size={18} /> Settings
          </div>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={onLogout}
            className="flex gap-3 text-red-500 w-full px-4 py-3 rounded-xl hover:bg-red-50"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 bg-white border-b px-8 py-4">
          <h2 className="text-2xl font-bold">Pending Submissions</h2>
        </header>

        <div className="p-8 space-y-4">
          {data?.length === 0 && (
            <div className="text-black text-center py-20">
              No pending PDFs 🎉
            </div>
          )}

          {data?.map((d) => (
            <div
              key={d.id}
              className="bg-white border rounded-xl p-5 flex justify-between items-center"
            >
              <div className="space-y-1">
  <p className="font-semibold text-black">{d.title}</p>
  <p className="text-sm text-black">
    {d.subject} • {d.semester} • {d.doc_type}
  </p>

  {/*View PDF */}
  <a
    href={`${SUPABASE_URL}/storage/v1/object/public/pdfs/${d.file_path}`}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block text-sm text-indigo-600 underline font-medium"
  >
    View PDF
  </a>
</div>


              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await approvePdf(d.id);
                    mutate();
                  }}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white flex items-center gap-1"
                >
                  <Check size={16} /> Approve
                </button>

                <button
                  onClick={async () => {
                    await rejectPdf(d.id, d.file_path);
                    mutate();
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white flex items-center gap-1"
                >
                  <X size={16} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/* ---------------- LOGIN PAGE ---------------- */

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin";

export default function AdminPage() {
  const [input, setInput] = useState("");
  const [auth, setAuth] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (input.trim() === ADMIN_PASS.trim()) {
        setAuth(true);
      } else {
        setError("Incorrect password");
      }
      setLoading(false);
    }, 500);
  };

  if (auth) return <AdminPanel onLogout={() => setAuth(false)} />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={login}
        className="bg-white p-8 rounded-2xl shadow w-full max-w-md"
      >
        <div className="text-center mb-6 text-black">
          <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-black">Admin Login</h1>
        </div>

        {/* ✅ SINGLE password input (this is important) */}
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Admin password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl"
        >
          {loading ? "Checking..." : "Access Dashboard"}
        </button>
      </form>
    </div>
  );
}
