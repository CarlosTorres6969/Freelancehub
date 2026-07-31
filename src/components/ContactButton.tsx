"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"

export default function ContactButton({ freelancerId, label = "Enviar Mensaje" }: { freelancerId: string; label?: string }) {
  const { user } = useAuth()
  const { addToast } = useToast()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (!user) {
      router.push("/?auth=login")
      return
    }

    if (user.id === freelancerId) return

    setLoading(true)
    try {
      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .filter("participant_ids", "cs", `{${user.id},${freelancerId}}`)

      if (existing && existing.length > 0) {
        router.push("/messages")
        return
      }

      const { error } = await supabase
        .from("conversations")
        .insert({ participant_ids: [user.id, freelancerId] })

      if (error) {
        addToast("Error al crear la conversación", "error")
        setLoading(false)
        return
      }

      router.push("/messages")
    } catch {
      addToast("Error al crear la conversación", "error")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || user?.id === freelancerId}
      className="w-full border border-card-border text-muted-fg font-medium py-3 rounded-xl hover:bg-accent transition-colors disabled:opacity-50"
    >
      {loading ? "Creando..." : label}
    </button>
  )
}
