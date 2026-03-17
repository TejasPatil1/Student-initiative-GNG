"use client"

import { useEffect, useRef, useState } from "react"

type Message = { id: string; name: string; text: string; ts: number }

export function ChatRoom() {
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const endRef = useRef<HTMLDivElement | null>(null)

  function addMessage() {
    if (!text.trim()) return
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), name: name || "Anon", text: text.trim(), ts: Date.now() },
    ])
    setText("")
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <section className="grid gap-6 relative z-10">
      {/* Header */}
      <header className="relative z-10 text-center">
        <h2 className="font-[var(--font-orbitron)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-white">
          Chat Room
        </h2>
        <p className="mt-1 text-sm text-gray-300">
          Chat Room is Under Maintainance.........
        </p>
      </header>

      {/* Input area */}
      <div className="card p-4">
        <div className="mb-3 grid gap-3 md:grid-cols-3">
          <input
            className="rounded-md border bg-card px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Your name"
          />
          <input
            className="rounded-md border bg-card px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring md:col-span-2"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMessage()}
            aria-label="Message input"
          />
        </div>
        <button className="btn btn-primary" onClick={addMessage}>
          Send
        </button>
      </div>

      {/* Messages */}
      <div className="card h-80 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-400">No messages yet. Say hi!</p>
        ) : (
          <ul className="space-y-3">
            {messages.map((m) => (
              <li key={m.id} className="rounded-md border p-3 bg-card/80 backdrop-blur-sm">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="font-medium text-white">{m.name}</span>
                  <span>{new Date(m.ts).toLocaleString()}</span>
                </div>
                <p className="mt-1 text-white">{m.text}</p>
              </li>
            ))}
          </ul>
        )}
        <div ref={endRef} />
      </div>
    </section>
  )
}
