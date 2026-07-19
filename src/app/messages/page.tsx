"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, Search, Send } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import AnimatedSection from "@/components/AnimatedSection"
import type { Conversation, Message, Profile } from "@/types"

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [input, setInput] = useState("")
  const [participants, setParticipants] = useState<Record<string, Profile>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    async function loadConversations() {
      const response=await fetch("/api/me/messages",{cache:"no-store"}),data=await response.json()
      if(response.ok){setConversations(data.conversations);setParticipants(data.participants);if(data.conversations.length)setSelected(prev=>prev??data.conversations[0].id)}
    }

    loadConversations()
  }, [user])

  useEffect(() => {
    if (!selected) return

    const load=()=>fetch(`/api/me/messages?conversationId=${selected}`,{cache:"no-store"}).then(r=>r.json()).then(data=>setMessages(data.messages??[]));load();const timer=setInterval(load,5000);return()=>clearInterval(timer)
  }, [selected])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSend() {
    if (!input.trim() || !user || !selected) return

    const response=await fetch("/api/me/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({conversationId:selected,content:input.trim()})});if(response.ok)setInput("")
  }

  if (!user) {
    return (
      <div className="page-shell text-center">
        <h1 className="text-2xl font-bold mb-4">Inicia sesión para ver tus mensajes</h1>
      </div>
    )
  }

  const filtered = conversations.filter((c) => {
    const participant = participants[c.participant_ids.find((id) => id !== user.id) ?? ""]
    return participant?.name?.toLowerCase().includes(search.toLowerCase())
  })

  const activeConv = conversations.find((c) => c.id === selected)
  const otherId = activeConv?.participant_ids.find((id) => id !== user.id)
  const otherProfile = otherId ? participants[otherId] : null

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <AnimatedSection>
        <span className="chip inline-flex rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
          Conversaciones
        </span>
        <h1 className="mt-3 mb-6 text-4xl font-black text-foreground">Mensajes</h1>
      </AnimatedSection>

      <div className="neo-card flex min-h-[600px] flex-col gap-0 overflow-hidden rounded-lg md:flex-row">
        <div className="flex w-full flex-col border-r border-card-border md:w-80">
          <div className="border-b border-card-border p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-fg" strokeWidth={1.8} />
              <input
                type="text"
                placeholder="Buscar conversaciones..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-future w-full rounded-lg py-2.5 pl-9 pr-3 text-sm placeholder:text-muted-fg"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((conv) => {
              const pid = conv.participant_ids.find((id) => id !== user.id)
              const p = pid ? participants[pid] : null
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelected(conv.id)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                    selected === conv.id
                      ? "border-l-2 border-violet-500 bg-accent"
                      : "hover:bg-accent/60"
                  }`}
                >
                  <div className="shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
                      {p?.name ? p.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "??"}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{p?.name ?? "Usuario"}</p>
                    <p className="truncate text-xs text-muted-fg">{conv.last_message ?? "Sin mensajes"}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          {otherProfile ? (
            <>
              <div className="flex items-center gap-3 border-b border-card-border px-6 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-xs font-bold text-white shadow-lg shadow-violet-500/20">
                  {otherProfile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{otherProfile.name}</p>
                  <p className="text-xs text-muted-fg">{otherProfile.title ?? "Usuario"}</p>
                </div>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                {messages.map((msg) => {
                  const isMe = msg.sender_id === user.id
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                          isMe
                            ? "rounded-br-md bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white"
                            : "rounded-bl-md bg-muted text-foreground"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`mt-1 text-[10px] ${isMe ? "text-white/65" : "text-muted-fg"}`}>
                          {new Date(msg.created_at).toLocaleTimeString("es-HN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
              <div className="border-t border-card-border p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="input-future flex-1 rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-fg"
                  />
                  <button
                    onClick={handleSend}
                    className="btn-primary px-4 py-2.5 text-sm"
                    aria-label="Enviar mensaje"
                  >
                    <Send className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-fg">
              <MessageCircle className="h-10 w-10" strokeWidth={1.5} />
              <span>Selecciona una conversación</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
