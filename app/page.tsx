

export const metadata = {
  title: "Programming for Genz | Coding, Courses & PYQs for Students",
  description:
    "Join Programming for Genz — a student-driven coding community with assignments, PYQs, courses, and opportunities to grow in tech.",
  keywords:
    "Programming for Genz, coding community, student coding platform, PYQs, programming courses, CodexClub",
  openGraph: {
    title: "Programming for Genz | Coding Community",
    description:
      "Explore Programming for Genz — a platform for students to learn, code, and collaborate.",
    url: "https://programmingforgenz.vercel.app",
    siteName: "Programming for Genz",
    images: [
      {
        url: "https://programmingforgenz.vercel.app/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

// Import after metadata
import PageClientWrapper from "@/components/ui/PageClientWrapper";

export default function Page() {
  return <PageClientWrapper />;
}


