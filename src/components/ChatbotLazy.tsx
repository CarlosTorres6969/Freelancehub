"use client"

import dynamic from "next/dynamic"

// ssr: false — el chatbot solo es útil tras la hidratación; diferirlo lo saca
// del bundle inicial y del HTML del servidor en todas las páginas.
const Chatbot = dynamic(() => import("./Chatbot"), { ssr: false })

export default function ChatbotLazy() {
  return <Chatbot />
}
