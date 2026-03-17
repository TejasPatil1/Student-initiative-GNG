"use client";
import { useState, useEffect } from "react";

export default function VideoBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // prevents server-side rendering issues

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/Background.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40"></div>
    </div>
  );
}
