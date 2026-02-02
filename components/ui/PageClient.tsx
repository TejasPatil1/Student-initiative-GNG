"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Pages
import { PYQsPage } from "@/components/PFG/pyqs";
import { AssignmentsPage } from "@/components/PFG/assignments";
import AnnouncementsPage from "@/components/PFG/Announcements";
import { ChatRoom } from "@/components/PFG/chat-room";
import { WhatsAppPage } from "@/components/PFG/whatsapp";
import { ContributorsPage } from "@/components/PFG/contributors";

// Sections
import { Hero } from "@/components/PFG/front";
import { AboutPFGSection } from "@/components/sections/About";
import { PeerLearningSection } from "@/components/sections/peer-learning";
import { OpportunitiesSection } from "@/components/sections/opportunities";
import { LearningTracksSection } from "@/components/sections/tracks";
import { JoinPFGSection } from "@/components/sections/join";
import { ContributorSection } from "@/components/sections/contributor";

// ---------------- Video Background ----------------

export function VideoBackground() {
  const [mounted, setMounted] = useState(false);

  // ✅ Correct useEffect to ensure the component renders only after mount (fixes hydration issues)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    
    <div className="fixed inset-0 z-0 overflow-hidden" data-nosnippet>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/bg2.mp4" type="video/mp4" />
      </video>
      {}
      <div className="absolute inset-0 bg-black/40"></div>
    </div>
  );
}

// ----------------  Navbar ----------------
export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const navLinks = ["/", "/pyqs", "/assignments", "/Announcements", "/chat", "/whatsapp", "/contributors"];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-primary/10 ring-1 ring-primary/25"></div>
          <span className="font-mono text-lg tracking-wide">PFG</span>
        </div>
        <button
          className="md:hidden btn px-3 py-2 text-xs sm:text-sm"
          aria-label="Toggle menu"
          onClick={() => setOpen(v => !v)}
        >
          Menu
        </button>
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((path, i) => {
            const isActive = pathname === path || (path === "/" && pathname === "/");
            return (
              <Link
                key={i}
                href={path}
                className={isActive ? "nav-link nav-link-active" : "nav-link"}
              >
                {path === "/" ? "Home" : path.slice(1).toUpperCase()}
              </Link>
            );
          })}
        </div>
      </nav>

      {open && (
        <div className="border-t bg-background/95 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-3 py-2 sm:px-4">
            {navLinks.map((path, i) => {
              const isActive = pathname === path || (path === "/" && pathname === "/");
              return (
                <Link
                  key={i}
                  href={path}
                  className={isActive ? "nav-link nav-link-active py-2.5" : "nav-link py-2.5"}
                  onClick={() => setOpen(false)}
                >
                  {path === "/" ? "Home" : path.slice(1).toUpperCase()}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

// ---------------- Home Page ----------------
function HomePage() {
  return (
    <>
      <Hero />
      <AboutPFGSection />
      <PeerLearningSection />
      <OpportunitiesSection />
      <LearningTracksSection />
      <JoinPFGSection />
      <ContributorSection />
    </>
  );
}

// ---------------- Main Client App ----------------
export default function PageClient() {
  const pathname = usePathname();

  return (
    <>
      <VideoBackground />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-12 relative z-10">
        {pathname === "/" && <HomePage />}
        {pathname === "/pyqs" && <PYQsPage />}
        {pathname === "/assignments" && <AssignmentsPage />}
        {pathname === "/Announcements" && <AnnouncementsPage />}
        {pathname === "/chat" && <ChatRoom />}
        {pathname === "/whatsapp" && <WhatsAppPage />}
        {pathname === "/contributors" && <ContributorsPage />}
      </main>
      <footer className="mx-auto max-w-6xl border-t px-4 py-8 text-sm text-muted-foreground relative z-10 text-center">
        © {new Date().getFullYear()} Programming for Genz (PFG). Built for students.
      </footer>
    </>
  );
}
