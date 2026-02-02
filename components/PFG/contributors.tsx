"use client"

import useSWR from "swr"
// FIXED: Added Instagram and Youtube to imports
import { Github, Linkedin, Youtube, Instagram, User } from "lucide-react"

// Define the shape of a contributor
type Contributor = {
  name: string
  role?: string
  avatar?: string
  socials?: {
    github?: string
    youtube?: string
    discord?: string
    instagram?: string
    linkedin?: string
  }
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// Custom Discord Icon (since Lucide doesn't have it)
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    className={className}
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.076.076 0 0 0-.04.106c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z" />
  </svg>
)

export function ContributorsPage() {
  const { data } = useSWR<Contributor[]>("/data/contributors.json", fetcher)

  return (
    <section className="relative z-10 min-h-screen px-4 pt-24 pb-12 md:px-8">
      {/* Header */}
      <header className="relative z-10 mb-12 text-center">
        <h2 className="font-[var(--font-orbitron)] text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Contributors
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400">
          Connect with the team on their favorite platforms.
        </p>
      </header>

      {/* Contributors Grid */}
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
        {(data ?? []).map((c, index) => (
          <li
            key={c.name + index}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-white/10 hover:shadow-2xl hover:shadow-purple-500/10"
          >
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/10 bg-gradient-to-br from-white/10 to-transparent shadow-inner">
                {c.avatar ? (
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-gray-400" />
                )}
              </div>

              {/* Name & Role */}
              <h3 className="mb-1 text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                {c.name}
              </h3>
              {c.role && (
                <div className="mb-6 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-gray-400 backdrop-blur-sm">
                  {c.role}
                </div>
              )}

              {/* Divider */}
              <div className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Social Icons Row */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {renderSocialIcon(
                  c.socials?.github,
                  <Github size={18} />,
                  "GitHub",
                  "hover:text-white hover:bg-black"
                )}
                {renderSocialIcon(
                  c.socials?.youtube,
                  <Youtube size={18} />,
                  "YouTube",
                  "hover:text-white hover:bg-red-600"
                )}
                {renderSocialIcon(
                  c.socials?.discord,
                  <DiscordIcon className="w-[18px] h-[18px]" />,
                  "Discord",
                  "hover:text-white hover:bg-[#5865F2]"
                )}
                {renderSocialIcon(
                  c.socials?.instagram,
                  <Instagram size={18} />,
                  "Instagram",
                  "hover:text-white hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-500"
                )}
                {renderSocialIcon(
                  c.socials?.linkedin,
                  <Linkedin size={18} />,
                  "LinkedIn",
                  "hover:text-white hover:bg-[#0077b5]"
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

// Helper function to render icons safely
function renderSocialIcon(
  link: string | undefined,
  icon: React.ReactNode,
  label: string,
  colorClass: string
) {
  // If the link is missing/empty, we return null (renders nothing)
  if (!link) return null
  
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-400 transition-all duration-300 hover:scale-110 active:scale-95 ${colorClass}`}
    >
      {icon}
    </a>
  )
}