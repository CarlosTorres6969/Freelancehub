"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant"
  content: string
}

// ─── Sugerencias iniciales ────────────────────────────────────────────────────

const SUGGESTIONS = [
  "¿Qué servicios hay disponibles?",
  "¿Cuál es el servicio más barato?",
  "¿Cuáles son los más vendidos?",
  "¿Cómo funciona la plataforma?",
]

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "¡Hola! Soy el asistente de FreelanceHub. Puedo ayudarte a encontrar servicios, ver precios, revisar tu historial y más. ¿En qué te ayudo?",
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Chatbot() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  // Focus al abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setError(null)
    setInput("")

    // Agregar mensaje del usuario inmediatamente
    const userMsg: Message = { role: "user", content: trimmed }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    // Historial para enviar al API (excluye el mensaje inicial del sistema)
    const historyToSend = messages
      .filter(m => m !== INITIAL_MESSAGE)
      .map(m => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: historyToSend,
          userId: user?.id ?? null,
        }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Error del servidor")
      }

      setMessages(prev => [...prev, { role: "assistant", content: data.reply }])
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido"
      setError(msg)
      // Quitar el mensaje del usuario si falló para que pueda reintentar
      setMessages(prev => prev.filter(m => m !== userMsg))
      setInput(trimmed)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  function handleOpen() {
    setIsOpen(o => !o)
  }

  return (
    <>
      {/* ── Panel del chat ───────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 flex h-[520px] max-h-[75vh] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-card-border bg-card-bg shadow-2xl sm:right-6 sm:w-96">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-violet-700 via-fuchsia-600 to-cyan-500 px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15">
                <Bot className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-sm font-bold leading-tight">Asistente FH</div>
                <div className="flex items-center gap-1 text-xs text-white/70">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                  En línea · Powered by Llama 3.3
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 transition-colors hover:bg-white/15"
              aria-label="Cerrar chat"
            >
              <X className="h-5 w-5" strokeWidth={1.8} />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">

            {/* Sugerencias — solo si es el primer mensaje */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pb-1">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="rounded-full border border-card-border bg-muted px-3 py-1 text-xs text-foreground transition-colors hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Avatar del bot */}
                {msg.role === "assistant" && (
                  <div className="mr-2 mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500">
                    <Bot className="h-3.5 w-3.5 text-white" strokeWidth={2} />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "rounded-br-md bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white"
                      : "rounded-bl-md bg-muted text-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Indicador de escritura */}
            {loading && (
              <div className="flex justify-start">
                <div className="mr-2 mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500">
                  <Bot className="h-3.5 w-3.5 text-white" strokeWidth={2} />
                </div>
                <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-fg [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-fg [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-fg [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            {/* Error inline */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
                {error} — intenta de nuevo.
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-card-border p-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => { setInput(e.target.value); setError(null) }}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu pregunta..."
                disabled={loading}
                className="input-future flex-1 rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-fg disabled:opacity-60"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="btn-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Enviar"
              >
                {loading
                  ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                  : <Send className="h-4 w-4" strokeWidth={1.8} />
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Botón flotante ───────────────────────────────────────────────────── */}
      <button
        onClick={handleOpen}
        className="fixed bottom-4 right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-400 text-white shadow-xl shadow-violet-500/25 transition-all hover:scale-110 sm:right-6"
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen
          ? <X className="h-6 w-6" strokeWidth={1.8} />
          : <MessageCircle className="h-6 w-6" strokeWidth={1.8} />
        }
      </button>
    </>
  )
}
