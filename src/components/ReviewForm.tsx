"use client"

import { useState } from "react"
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
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-card-border bg-card-bg">
      <h3 className="font-semibold text-foreground mb-4">Deja tu reseña</h3>

      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <svg
              className={`w-6 h-6 ${star <= (hover || rating) ? "text-amber-400" : "text-zinc-300 dark:text-zinc-600"} transition-colors`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        <span className="text-sm text-muted-fg ml-2">
          {rating > 0 ? `${rating} de 5` : "Califica"}
        </span>
      </div>

      <div className="space-y-3">
        <textarea
          placeholder="Comparte tu experiencia..."
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="btn-3d px-5 py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-xl text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all disabled:opacity-50"
        >
          {submitting ? "Enviando..." : "Enviar Reseña"}
        </button>
      </div>
    </form>
  )
}
