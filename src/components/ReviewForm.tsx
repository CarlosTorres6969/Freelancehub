"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"

export default function ReviewForm({ serviceId, onSubmitted }: { serviceId: string; onSubmitted?: () => void }) {
  const { user, profile } = useAuth()
  const { addToast } = useToast()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!user) {
      addToast("Inicia sesión para dejar una reseña", "error")
      return
    }

    if (rating === 0) {
      addToast("Selecciona una calificación", "error")
      return
    }

    if (!comment.trim()) {
      addToast("Escribe un comentario", "error")
      return
    }

    setSubmitting(true)

    const userName = profile?.name ?? user.email?.split("@")[0] ?? "Usuario"
    const userAvatar = userName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()

    const { error } = await supabase.from("reviews").insert({
      service_id: serviceId,
      user_id: user.id,
      user_name: userName,
      user_avatar: userAvatar,
      rating,
      content: comment.trim(),
    })

    if (error) {
      addToast("Error al enviar la reseña", "error")
      setSubmitting(false)
      return
    }

    const { data: stats } = await supabase
      .from("reviews")
      .select("rating")
      .eq("service_id", serviceId)

    if (stats) {
      const avg = stats.reduce((a: number, r: { rating: number }) => a + r.rating, 0) / stats.length
      await supabase
        .from("services")
        .update({ rating: Math.round(avg * 100) / 100, reviews_count: stats.length })
        .eq("id", serviceId)
    }

    addToast("Reseña enviada con éxito", "success")
    setRating(0)
    setComment("")
    setSubmitting(false)
    onSubmitted?.()
  }

  return (
    <form onSubmit={handleSubmit} className="neo-card rounded-lg p-6">
      <h3 className="mb-4 font-black text-foreground">Deja tu reseña</h3>

      <div className="mb-4 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5 transition-transform hover:scale-110"
            aria-label={`${star} estrellas`}
          >
            <Star
              className={`h-6 w-6 ${star <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-zinc-300 dark:text-zinc-600"} transition-colors`}
              strokeWidth={1.5}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-fg">
          {rating > 0 ? `${rating} de 5` : "Califica"}
        </span>
      </div>

      <div className="space-y-3">
        <textarea
          placeholder="Comparte tu experiencia..."
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="input-future w-full resize-none rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-fg"
        />
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary px-5 py-2.5 text-sm disabled:opacity-50"
        >
          {submitting ? "Enviando..." : "Enviar Reseña"}
        </button>
      </div>
    </form>
  )
}
