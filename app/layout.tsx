import type { Metadata } from "next";
import { Orbitron, Inter, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";
import "./globals.css";

// Font configurations

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Customize weights as needed
});


export const metadata: Metadata = {
  title: "Programming for Genz | Student Initiative GNG",
  description:
    "Programming for Genz (PFG) — a student-driven platform for courses, assignments, PYQs, community learning, and tech collaboration.",
  keywords: [
    "Programming for Genz",
    "PFG",
    "Student Initiative",
    "GNG",
    "Courses",
    "Assignments",
    "PYQs",
    "Tech Club",
    "Student Projects",
    "Coding Community",
    "Hackathons",
    "AI Learning",
  ],
  authors: [{ name: "Programming for Genz Team", url: "https://programmingforgenz.vercel.app/" }],
  generator: "Next.js",
  metadataBase: new URL("https://programmingforgenz.vercel.app"),
  alternates: {
    canonical: "https://programmingforgenz.vercel.app/",
  },
  openGraph: {
    title: "Programming for Genz | Student Initiative GNG",
    description:
      "A student-driven tech community offering resources, assignments, PYQs, and learning opportunities.",
    url: "https://programmingforgenz.vercel.app/",
    siteName: "Programming for Genz",
    images: [
      {
        url: "https://programmingforgenz.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Programming for Genz Banner",
      },
    ],
    locale: "en_IN", // India-based for better regional targeting
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Programming for Genz | Student Initiative GNG",
    description:
      "Join Programming for Genz (PFG) — a student community for coding, learning, and tech collaboration.",
    images: ["https://programmingforgenz.vercel.app/og-image.png"],
    creator: "@CodexClub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  category: "education",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable} dark antialiased`}>
      <body className={poppins.className}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  );
}
  