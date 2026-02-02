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
  await fetch("/api/admin/pdf/approve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

async function rejectPdf(id: string, filePath: string) {
  await fetch("/api/admin/pdf/reject", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, filePath }),
  });
}

/* ---------------- ADMIN DASHBOARD ---------------- */

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const { data, mutate } = useSWR("pending-pdfs", fetchPending);

  return (
    <div className="flex h-screen bg-gray-50 text-black">
      {/* Sidebar - Hidden on Mobile */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col shadow-sm">
        <div className="p-6 font-bold text-xl border-b">AdminPanel</div>

        <nav className="p-4 space-y-2 flex-1">
          <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-medium transition-colors">
            <LayoutDashboard size={18} /> Dashboard
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-black rounded-xl transition-colors cursor-pointer">
            <Users size={18} /> Users
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-black rounded-xl transition-colors cursor-pointer">
            <BarChart3 size={18} /> Analytics
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-black rounded-xl transition-colors cursor-pointer">
            <Settings size={18} /> Settings
          </div>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-3 text-red-600 w-full px-4 py-3 rounded-xl hover:bg-red-50 font-medium transition-all active:scale-95"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header - Added Mobile Logout Button */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl md:text-2xl font-bold">Pending Submissions</h2>
          <button
            onClick={onLogout}
            className="md:hidden flex items-center gap-2 text-red-600 text-sm font-medium px-3 py-2 rounded-lg bg-red-50 active:scale-95 transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </header>

        <div className="p-4 md:p-8 space-y-4 max-w-5xl mx-auto">
          {data?.length === 0 && (
            <div className="text-gray-500 text-center py-20 bg-white border border-dashed rounded-xl">
              No pending PDFs 🎉
            </div>
          )}

          {data?.map((d) => (
            <div
              key={d.id}
              className="bg-white border rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all hover:shadow-md"
            >
              <div className="space-y-1">
                <p className="font-semibold text-lg text-black">{d.title}</p>
                <p className="text-sm text-gray-600">
                  {d.subject} • {d.semester} • {d.doc_type}
                </p>

                {/*View PDF */}
                <a
                  href={`${SUPABASE_URL}/storage/v1/object/public/pdfs/${d.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 text-sm text-indigo-600 hover:text-indigo-800 underline font-medium transition-colors"
                >
                  View PDF
                </a>
              </div>

              {/* Action Buttons - Stacked on mobile, side-by-side on desktop */}
              <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button
                  onClick={async () => {
                    await approvePdf(d.id);
                    mutate();
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 font-medium transition-all active:scale-95"
                >
                  <Check size={16} /> Approve
                </button>

                <button
                  onClick={async () => {
                    await rejectPdf(d.id, d.file_path);
                    mutate();
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 font-medium transition-all active:scale-95"
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={login}
        className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-md transition-all"
      >
        <div className="text-center mb-6 text-black">
          <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <Lock className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-black">Admin Login</h1>
        </div>

        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Admin password"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all mb-3"
        />

        {error && <p className="text-red-500 text-sm mb-3 text-center font-medium animate-pulse">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              Checking...
            </span>
          ) : (
            "Access Dashboard"
          )}
        </button>
      </form>
    </div>
  );
}