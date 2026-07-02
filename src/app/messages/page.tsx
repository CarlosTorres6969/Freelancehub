"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
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
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (!user) return
    const userId = user.id

    async function loadConversations() {
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .contains("participant_ids", [userId])
        .order("last_message_time", { ascending: false, nullsFirst: false })

      if (data) {
        setConversations(data)
        setSelected((current) => current ?? data[0]?.id ?? null)

        const allIds = data.flatMap((c) => c.participant_ids)
        const uniqueIds = [...new Set(allIds.filter((id) => id !== userId))]
        if (uniqueIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("*")
            .in("id", uniqueIds)
          if (profiles) {
            const map: Record<string, Profile> = {}
            profiles.forEach((p) => { map[p.id] = p })
            setParticipants(map)
          }
        }
      }
    }

    loadConversations()
  }, [user, supabase])

  useEffect(() => {
    if (!selected) return

    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", selected)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data)
      })

    const channel = supabase
      .channel(`messages:${selected}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selected}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [selected, supabase])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSend() {
    if (!input.trim() || !user || !selected) return

    const { error } = await supabase.from("messages").insert({
      conversation_id: selected,
      sender_id: user.id,
      content: input.trim(),
    })

    if (!error) {
      await supabase
        .from("conversations")
        .update({ last_message: input.trim(), last_message_time: new Date().toISOString() })
        .eq("id", selected)

      setInput("")
    }
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <AnimatedSection>
        <h1 className="text-3xl font-bold text-foreground mb-6">Mensajes</h1>
      </AnimatedSection>

      <div className="flex flex-col md:flex-row gap-0 rounded-xl border border-card-border bg-card-bg overflow-hidden min-h-[600px]">
        <div className="w-full md:w-80 border-r border-card-border flex flex-col">
          <div className="p-3 border-b border-card-border">
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted text-foreground placeholder:text-muted-fg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((conv) => {
              const pid = conv.participant_ids.find((id) => id !== user.id)
              const p = pid ? participants[pid] : null
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelected(conv.id)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                    selected === conv.id
                      ? "bg-indigo-50 dark:bg-indigo-950/30 border-l-2 border-indigo-500"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {p?.name ? p.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "??"}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground truncate">{p?.name ?? "Usuario"}</p>
                    <p className="text-xs text-muted-fg truncate">{conv.last_message ?? "Sin mensajes"}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {otherProfile ? (
            <>
              <div className="flex items-center gap-3 px-6 py-4 border-b border-card-border">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {otherProfile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{otherProfile.name}</p>
                  <p className="text-xs text-muted-fg">{otherProfile.title ?? "Usuario"}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => {
                  const isMe = msg.sender_id === user.id
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                          isMe
                            ? "bg-foreground text-background rounded-br-md"
                            : "bg-muted text-foreground rounded-bl-md"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${isMe ? "text-background/60" : "text-muted-fg"}`}>
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
              <div className="p-4 border-t border-card-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-muted text-foreground placeholder:text-muted-fg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleSend}
                    className="px-4 py-2.5 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-fg">
              Selecciona una conversación
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
