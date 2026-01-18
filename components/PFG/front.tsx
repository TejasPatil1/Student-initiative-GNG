"use client";

import { RevealSection } from "@/components/ui/reveal-section";

export function Hero() {
  return (
    <RevealSection className="min-h-screen flex items-center justify-center">
      <div className="relative w-full h-full">
        {/* Overlays */}
        <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
        <div className="absolute inset-0 bg-grid-surface" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-black"
          aria-hidden="true"
        />

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 max-w-3xl mx-auto px-4 py-12">
  <h1 className="font-[(--font-orbitron)] text-3xl sm:text-4xl md:text-6xl tracking-tight text-white font-bold">
    Programming for Genz
  </h1>
  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
    Turning coding struggles into success stories. Be part of our student-driven community of future programmers and innovators!
  </p>


          {/* Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-3 mt-4">
            <a
              href="/assignments"
              className="btn btn-primary text-xs sm:text-sm px-4 py-2.5 w-full sm:w-auto text-center"
            >
              Assignments
            </a>
            <a
              href="https://chat.whatsapp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn text-xs sm:text-sm px-4 py-2.5 w-full sm:w-auto text-center"
            >
              Join WhatsApp
            </a>
            <a
              href="/chat"
              className="btn text-xs sm:text-sm px-4 py-2.5 w-full sm:w-auto text-center"
            >
              Chat Room
            </a>
            <a
              href="/pyqs"
              className="btn text-xs sm:text-sm px-4 py-2.5 w-full sm:w-auto text-center"
            >
              PYQs
            </a>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-primary/10 rounded-lg sm:rounded-xl"></div>
      </div>
    </RevealSection>
  );
}
