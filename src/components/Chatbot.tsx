"use client"

import { useEffect, useRef, useState } from "react"
import { Bot, MessageCircle, Send, X } from "lucide-react"

interface Message {
  role: "user" | "bot"
  content: string
}

const initialMessages: Message[] = [
  {
    role: "bot",
    content: "¡Hola! Soy el asistente de FreelanceHub. Puedo ayudarte a encontrar servicios, entender pagos o preparar tu primer proyecto.",
  },
]

const responses: Record<string, string> = {
  hola: "¡Hola! Puedes preguntarme sobre servicios, freelancers, pagos o tiempos de entrega.",
  servicios: "Hay servicios de desarrollo web, diseño gráfico, marketing digital, redacción, video, programación, música y consultoría.",
  freelancer: "Para trabajar como freelancer, crea tu cuenta, completa tu perfil y publica servicios con precios, tiempos y entregables claros.",
  pago: "Los pagos se gestionan dentro de la plataforma para proteger a cliente y freelancer durante la entrega.",
  tiempo: "Los tiempos de entrega dependen del servicio. Cada publicación muestra el plazo estimado antes de contratar.",
  precio: "Los precios están en Lempiras y los define cada freelancer. Puedes filtrar por presupuesto en el Marketplace.",
  contacto: "Puedes contactar freelancers desde cada servicio antes de contratar para alinear alcance, tiempos y dudas.",
  gracias: "¡Con gusto! Aquí sigo si necesitas aterrizar el proyecto.",
  adios: "¡Hasta luego! Que tengas un gran día.",
  adiós: "¡Hasta luego! Que tengas un gran día.",
}

const defaultResponse = "Puedo ayudarte con servicios, freelancers, pagos, tiempos de entrega o el proceso de contratación."

function getBotResponse(input: string): string {
  const q = input.toLowerCase().trim()

  for (const [key, response] of Object.entries(responses)) {
    if (q.includes(key)) {
      return response
    }
  }

  if (q.includes("cómo") || q.includes("como")) {
    return "Puedes explorar servicios, revisar perfiles, conversar con freelancers y contratar desde el Marketplace."
  }

  return defaultResponse
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function handleSend() {
    const text = input.trim()
    if (!text) return

    setMessages((prev) => [...prev, { role: "user", content: text }])
    setInput("")

    window.setTimeout(() => {
      const botReply = getBotResponse(text)
      setMessages((prev) => [...prev, { role: "bot", content: botReply }])
    }, 450)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 flex h-[500px] max-h-[70vh] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-card-border bg-card-bg shadow-2xl shadow-black/20 backdrop-blur-xl sm:right-6 sm:w-96">
          <div className="flex items-center justify-between border-b border-card-border bg-foreground p-4 text-background">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/10">
                <Bot className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-sm font-bold">Asistente FH</div>
                <div className="text-xs text-background/60">En línea</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-background/70 transition-colors hover:bg-background/10 hover:text-background"
              aria-label="Cerrar chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-foreground text-background"
                      : "bg-accent text-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-card-border p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe un mensaje..."
                className="min-w-0 flex-1 rounded-lg border border-card-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-fg focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-fg transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Enviar"
              >
                <Send className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-foreground text-background shadow-2xl shadow-primary/20 transition-transform hover:scale-110 sm:right-6"
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        <span className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-violet-500 to-rose-400 opacity-0 transition-opacity duration-300 hover:opacity-100" />
        <span className="relative z-10">
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </span>
      </button>
    </>
  )
}
