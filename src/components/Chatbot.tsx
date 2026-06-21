"use client"

import { useState, useRef, useEffect } from "react"

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
  "hola": "¡Hola! ¿Cómo puedo ayudarte? Puedes preguntarme sobre servicios, freelancers, o cómo funciona la plataforma.",
  "servicios": "Ofrecemos servicios en categorías como: Desarrollo Web, Diseño Gráfico, Marketing Digital, Redacción, Video y Animación, y más. ¡Explora nuestro Marketplace!",
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
        <div className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[500px] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-zinc-200 flex flex-col z-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-zinc-900 text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-sm">Asistente FH</div>
                <div className="text-xs text-zinc-300">En línea</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Cerrar chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-zinc-900 text-white rounded-br-md"
                      : "bg-zinc-100 text-zinc-700 rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-zinc-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-zinc-400 focus:outline-none text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Enviar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:right-6 w-14 h-14 rounded-full bg-zinc-900 text-white shadow-lg hover:bg-zinc-800 transition-all hover:scale-110 hover:shadow-xl hover:shadow-indigo-500/20 animate-fade-in flex items-center justify-center z-50 group overflow-hidden"
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        <span className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </>
  )
}
