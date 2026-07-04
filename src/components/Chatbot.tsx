"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, MessageCircle, Send, X } from "lucide-react"

interface Message {
  role: "user" | "bot"
  content: string
}

const initialMessages: Message[] = [
  {
    role: "bot",
    content: "¡Hola! Soy el asistente de FreelanceHub. ¿En qué puedo ayudarte hoy?",
  },
]

const responses: Record<string, string> = {
  "hola": "¡Hola! ¿Cómo puedo ayudarte? Puedes preguntarme sobre servicios, freelancers o cómo funciona la plataforma.",
  "servicios": "Ofrecemos servicios en categorías como Desarrollo Web, Diseño Gráfico, Marketing Digital, Redacción, Video y Animación, y más. Explora nuestro Marketplace.",
  "freelancer": "Para convertirte en freelancer, regístrate en la plataforma, completa tu perfil y comienza a publicar tus servicios. Es gratis.",
  "pago": "Los pagos se procesan de forma segura a través de nuestra plataforma. El pago se libera al freelancer cuando confirmes que el trabajo está completo.",
  "tiempo": "Los tiempos de entrega varían según el servicio. Puedes ver el tiempo estimado en cada servicio del Marketplace.",
  "precio": "Los precios están en Lempiras (LPS) y son fijados por cada freelancer. Puedes filtrar por precio en el Marketplace para encontrar opciones que se ajusten a tu presupuesto.",
  "contacto": "Puedes contactar directamente con los freelancers a través del chat en cada servicio antes de contratar.",
  "gracias": "¡De nada! Si tienes más preguntas, aquí estoy para ayudarte.",
  "adiós": "¡Hasta luego! Que tengas un excelente día.",
}

const defaultResponse = "No tengo una respuesta preparada para eso. ¿Puedes preguntarme sobre servicios, freelancers, pagos o tiempos de entrega?"

function getBotResponse(input: string): string {
  const q = input.toLowerCase().trim()

  for (const [key, response] of Object.entries(responses)) {
    if (q.includes(key)) {
      return response
    }
  }

  if (q.includes("cómo") || q.includes("como")) {
    return "¿Te gustaría saber cómo funciona la plataforma, cómo contratar un servicio o cómo registrarte como freelancer?"
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

    setTimeout(() => {
      const botReply = getBotResponse(text)
      setMessages((prev) => [...prev, { role: "bot", content: botReply }])
    }, 500)
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
        <div className="fixed bottom-20 right-4 z-50 flex h-[500px] max-h-[70vh] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-card-border bg-card-bg shadow-2xl sm:right-6 sm:w-96">
          <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-violet-700 via-fuchsia-600 to-cyan-500 p-4 text-white">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/18">
                <Bot className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-sm font-bold">Asistente FH</div>
                <div className="text-xs text-white/70">En línea</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 transition-colors hover:bg-white/10"
              aria-label="Cerrar chat"
            >
              <X className="h-5 w-5" strokeWidth={1.8} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-md bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white"
                      : "rounded-bl-md bg-muted text-foreground"
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
                className="input-future flex-1 rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-fg"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="btn-primary px-4 py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Enviar"
              >
                <Send className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-400 text-white shadow-xl shadow-violet-500/25 transition-all hover:scale-110 sm:right-6"
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? <X className="h-6 w-6" strokeWidth={1.8} /> : <MessageCircle className="h-6 w-6" strokeWidth={1.8} />}
      </button>
    </>
  )
}
