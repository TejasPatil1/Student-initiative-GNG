"use client";

import Link from "next/link";
import { RevealSection } from "@/components/ui/reveal-section";
import { cn } from "@/lib/utils";

export function JoinPFGSection() {
  return (
    <RevealSection variant="slide-up" className="min-h-screen flex items-center py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6 w-full">
        <div
          className={cn(
            "rounded-2xl p-8 md:p-12 shadow-md hover:shadow-xl transition bg-[linear-gradient(140deg,hsl(var(--primary)/0.10),transparent_40%)] w-full mx-auto"
          )}
        >
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white text-center">
  Login Soon
</h2>

          <p className="mt-4 font-sans text-gray-200 leading-relaxed max-w-4xl mx-auto text-lg md:text-xl">
            Ready to start your programming journey with a supportive community of fellow students? Sign up now, complete your profile, and be the first to know about upcoming meetups, projects, and learning opportunities.
          </p>
          <div className="mt-6">
            <div className="mt-6 text-center">
  <Link
    href="#get-started"
    className={cn(
      "inline-flex items-center justify-center rounded-full px-5 py-2.5 bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    )}
  >
    Get Started
  </Link>
</div>

          </div>
        </div>
      </div>
    </RevealSection>
  );
}
