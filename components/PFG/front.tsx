"use client";

import { RevealSection } from "@/components/ui/reveal-section";

/* Icons */
const BookIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
);
const ChatIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
);
const WhatsAppIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
);
const PaperIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);

export function Hero() {
  return (
    <RevealSection className="min-h-[100dvh] flex items-center justify-center relative overflow-hidden bg-black">
      
      {/* ---------------- BACKGROUND LAYERS ---------------- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Subtle Gradient Spotlights */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[128px] opacity-40 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[128px] opacity-40" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center text-center">
        
        {/* Badge / Pill */}
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)] backdrop-blur-md mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
          Student Community
        </div>

        {/* Hero Title with Updated Gradient */}
        <h1 className="font-[(--font-orbitron)] text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight font-black mb-8 animate-in fade-in zoom-in-50 duration-1000 delay-150">
          <span className="text-white drop-shadow-md">Programming for </span>
          {/* BRIGHTER & VIBRANT GRADIENT */}
         <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.9)] font-bold">
  GenZ
</span>

        </h1>

        {/* Subtitle - Increased Bottom Margin */}
        <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light mb-14 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          Turning coding struggles into success stories. Join our student-driven 
          ecosystem of future <span className="text-white font-semibold">innovators</span>.
        </p>

        {/* ---------------- ACTION BUTTONS ---------------- */}
        {/* Mobile: Grid 2x2 | Desktop: Flex Row | Consistent Heights */}
        <div className="w-full grid grid-cols-2 gap-4 sm:flex sm:justify-center sm:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          
          <a
            href="/assignments"
            className="group flex items-center justify-center h-14 sm:h-12 px-8 rounded-xl bg-blue-600 text-white font-semibold text-base shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-300"
          >
            <PaperIcon />
            Assignments
          </a>

          <a
            href="/pyqs"
            className="group flex items-center justify-center h-14 sm:h-12 px-8 rounded-xl border border-white/20 bg-white/5 text-white font-medium text-base backdrop-blur-sm hover:bg-white/10 hover:border-white/40 hover:scale-105 transition-all duration-300"
          >
            <BookIcon />
            PYQs
          </a>

          <a
            href="/chat"
            className="group flex items-center justify-center h-14 sm:h-12 px-8 rounded-xl border border-white/20 bg-white/5 text-white font-medium text-base backdrop-blur-sm hover:bg-white/10 hover:border-white/40 hover:scale-105 transition-all duration-300"
          >
            <ChatIcon />
            Chat Room
          </a>

          <a
            href="https://chat.whatsapp.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center h-14 sm:h-12 px-8 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] font-medium text-base backdrop-blur-sm hover:bg-[#25D366]/20 hover:border-[#25D366]/60 hover:scale-105 hover:shadow-[0_0_20px_rgba(37,211,102,0.2)] transition-all duration-300"
          >
            <WhatsAppIcon />
            WhatsApp
          </a>

        </div>
      </div>
    </RevealSection>
  );
}
