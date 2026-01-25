"use client";

import { RevealSection } from "@/components/ui/reveal-section";

export function ContributorSection() {
  return (
    <RevealSection variant="slide-up" className="min-h-screen flex items-center py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6 w-full">
        <div className="rounded-2xl border bg-background/70 backdrop-blur-sm shadow-md hover:shadow-lg transition p-6 md:p-10 w-full">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Contributor</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed text-lg md:text-xl">
            No Zone of Contributors anyone can Contribute which helps community to grow widely
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div className="rounded-xl border p-4 shadow-sm hover:shadow-md transition hover:-translate-y-0.5 w-full">
              <p className="font-medium text-lg">How to contribute</p>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Fork, improve docs, add features, and submit PRs.
              </p>
            </div>
            <div className="rounded-xl border p-4 shadow-sm hover:shadow-md transition hover:-translate-y-0.5 w-full">
              <p className="font-medium text-lg">Code of conduct</p>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Be respectful, helpful, and supportive in discussions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
