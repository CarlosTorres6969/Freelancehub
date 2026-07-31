"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { createConversation } from "@/actions/messages"

export default function ContactFreelancerButton({ freelancerId }: { freelancerId: string }) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  if (user?.id === freelancerId) return null

  async function handleClick() {
    if (!user) {
      router.push(`/?auth=login&redirect=${encodeURIComponent("/messages")}`)
      return
    }
    setLoading(true)
    try {
      const conversation = await createConversation(freelancerId)
      router.push(`/messages?conversationId=${conversation.id}`)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <button onClick={handleClick} disabled={loading} className="btn-secondary w-full py-3 text-sm disabled:opacity-60">
      {loading ? "Abriendo chat..." : "Enviar Mensaje"}
    </button>
  )
}
