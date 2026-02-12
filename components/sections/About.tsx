"use client";
import { RevealSection } from "@/components/ui/reveal-section";


export function AboutPFGSection() {
  return (
    <RevealSection variant="slide-up">
      <div className="mx-auto max-w-6xl px-4 md:px-6 w-full">

        {/* Black blended rectangle bar behind section links (Hero style) */}
        <div className="relative w-full mb-12">
          <div className="absolute inset-0 flex items-center justify-center">
            

        </div>
        </div>

        {/* About PFG content card */}
        <div className="rounded-3xl bg-white/10 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all p-12 md:p-20 w-full text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 md:mb-8">
            About PFG
          </h2>
         <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-200 leading-relaxed max-w-4xl mx-auto">
  <strong>Programming for Genz (PFG)</strong> is a student-driven community founded by a group of enthusiastic first-year coders. We’re not an official college club — just passionate learners who wanted to create a space where students can grow, share, and explore coding beyond the classroom.
</p>

<p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-200 leading-relaxed max-w-4xl mx-auto">
  At <strong>PFG</strong>, our mission is simple: to connect Gen Z learners who love programming, technology, and creativity. Whether you’re just starting your coding journey or already diving deep into development, this is the place to learn, collaborate, and level up together.
</p>

<p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-200 leading-relaxed max-w-4xl mx-auto">
  We believe everyone starts somewhere and at <strong>Programming for Genz</strong>, we start as learners and rise as innovators.
</p>

        </div>
      </div>
    </RevealSection>
  );
}
