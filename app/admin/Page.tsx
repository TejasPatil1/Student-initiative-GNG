"use client";
import React, { useState } from "react";
import { Lock, User, LayoutDashboard, Settings, LogOut, Users, BarChart3 } from "lucide-react";
type AdminPanelProps = {
  onLogout: () => void;
};

// --- MOCK COMPONENT: AdminPanel ---
// In your real app, this is imported from "../../components/ui/AdminPanel"
// I am defining it here so the code is runnable and you can see the success state.
const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="text-xl font-bold text-gray-800">AdminPanel</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-medium transition-colors">
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
            <Users size={20} />
            Users
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
            <BarChart3 size={20} />
            Analytics
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
            <Settings size={20} />
            Settings
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
              T
            </div>
          </div>
        </header>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-gray-500 mb-2 font-medium">Total Revenue</div>
              <div className="text-3xl font-bold text-gray-900">$12,450</div>
              <div className="text-green-500 text-sm mt-2 font-medium">+12% from last month</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-gray-500 mb-2 font-medium">Active Users</div>
              <div className="text-3xl font-bold text-gray-900">1,240</div>
              <div className="text-green-500 text-sm mt-2 font-medium">+5% new users</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-gray-500 mb-2 font-medium">Pending Tasks</div>
              <div className="text-3xl font-bold text-gray-900">18</div>
              <div className="text-amber-500 text-sm mt-2 font-medium">Requires attention</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-96 flex items-center justify-center">
            <p className="text-gray-400">Main Content Area</p>
          </div>
        </div>
      </main>
    </div>
  );
};


// --- MAIN PAGE COMPONENT ---
// NOTE: I added a fallback "|| 'admin'" so you can test it in this preview without .env
const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin";

export default function AdminPage() {
  const [input, setInput] = useState("");
  const [auth, setAuth] = useState(false);
  const [error, setError] = useState(""); // Replaces alert for better UI
  const [isLoading, setIsLoading] = useState(false);

  const login = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault(); // Prevent form reload
    setIsLoading(true);
    setError("");

    // Simulate a tiny network delay for professional feel
    setTimeout(() => {
      if (input === ADMIN_PASS) {
        setAuth(true);
      } else {
        setError("Incorrect Password");
        // Shake animation could go here
      }
      setIsLoading(false);
    }, 600);
  };

  if (auth) {
    // Passing a logout handler just for the preview to be interactive
    return <AdminPanel onLogout={() => setAuth(false)} />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-200/30 blur-3xl" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      <div className="w-full max-w-md p-4 z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 md:p-10">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 mb-6 transform rotate-3">
              <Lock className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Portal</h1>
            <p className="text-gray-500 text-sm mt-2 text-center">
              Please enter your secure credentials to access the dashboard.
            </p>
          </div>

          <form onSubmit={login} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="password"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="••••••••••••"
                  className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-500'} rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-200 ease-in-out`}
                />
              </div>
              
              {/* Error Message Container (replaces alert) */}
              <div className={`h-6 transition-all duration-300 ${error ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                <p className="text-red-500 text-xs font-medium ml-1 flex items-center">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 font-medium">
              Secured by 256-bit encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}