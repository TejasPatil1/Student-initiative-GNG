"use client";
import dynamic from "next/dynamic";
import React from "react";

// Dynamically import the full client app. Doing the dynamic import inside a
// client component (rather than in a Server Component) is required by Next.js
// when using `ssr: false`.
const PageClient = dynamic(() => import("./PageClient"), { ssr: false });

export default function PageClientWrapper() {
  return <PageClient />;
}
