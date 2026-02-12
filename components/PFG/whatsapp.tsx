"use client"

import useSWR from "swr"

type Group = {
  name: string
  link: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function WhatsAppPage() {
  const { data } = useSWR<Group[]>("/data/whatsapp.json", fetcher)

  return (
    <section className="space-y-6">
      <header className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          WhatsApp Groups
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Join the community groups and connect with fellow learners
        </p>
      </header>

      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(data ?? []).map((g) => (
          <a
            key={g.name}
            href={g.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-card border border-border rounded-xl p-4 sm:p-5 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex items-center justify-center text-center"
          >
            <div className="flex flex-col items-center gap-2">
              <svg
                className="w-6 h-6 text-primary group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.116-4.922 5.144-4.922 8.143 0 2.289.55 4.501 1.599 6.485L2.071 23.987l6.305-1.654a9.857 9.857 0 004.888 1.242h.005c5.396 0 9.791-4.396 9.791-9.791 0-2.618-.1-5.192-1.532-7.649C19.285 3.009 16.064.5 12.051.5 6.655.5 2.051 4.896 2.051 10.292c0 2.821.779 5.457 2.262 7.752l-1.61 5.694 6.051-1.59c2.281 1.246 4.844 1.902 7.523 1.902h.005c5.396 0 9.791-4.396 9.791-9.791 0-5.395-4.396-9.791-9.791-9.791" />
              </svg>
              <span className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {g.name}
              </span>
              <span className="text-xs text-muted-foreground">Join Group</span>
            </div>
          </a>
        ))}
      </div>

      {/* Empty state */}
      {(data ?? []).length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <svg
            className="w-12 h-12 text-muted-foreground/50 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-foreground mb-1">No groups available</h3>
          <p className="text-sm text-muted-foreground">Check back soon for community groups</p>
        </div>
      )}
    </section>
  )
}
