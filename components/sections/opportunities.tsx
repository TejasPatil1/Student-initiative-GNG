"use client";

import { RevealSection } from "@/components/ui/reveal-section";

export function OpportunitiesSection() {
  return (
    <RevealSection variant="slide-up" className="min-h-screen flex items-center py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6 w-full">
        <div className="group rounded-2xl shadow-md hover:shadow-xl transition-all bg-background p-6 md:p-10 w-full">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Opportunities</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Take a benefit of all future Oppurtinities
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div className="rounded-xl p-4 shadow-sm hover:shadow-md transition hover:-translate-y-0.5 border w-full">
              <h3 className="font-medium">Projects</h3>
              <p className="text-sm text-muted-foreground mt-1">Work on real-world problems with peers.</p>
            </div>
            <div className="rounded-xl p-4 shadow-sm hover:shadow-md transition hover:-translate-y-0.5 border w-full">
              <h3 className="font-medium">Mentoring</h3>
              <p className="text-sm text-muted-foreground mt-1">Guide others and grow your leadership.</p>
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
