"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { addReview, getReviewEligibility } from "@/actions/reviews"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import PasswordConfirmModal from "@/components/PasswordConfirmModal"

export default function ReviewForm({ serviceId, onSubmitted }: { serviceId: string; onSubmitted?: () => void }) {
  const { user, loading: authLoading } = useAuth()
  const { addToast } = useToast()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [eligible, setEligible] = useState<boolean | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [reauthError, setReauthError] = useState("")

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setEligible(null)
      return
    }
    let cancelled = false
    getReviewEligibility(serviceId).then((result) => {
      if (!cancelled) setEligible(result)
    })
    return () => {
      cancelled = true
    }
  }, [authLoading, user, serviceId])

  function handleSubmit(e: React.FormEvent) {
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

    setReauthError("")
    setConfirmOpen(true)
  }

  async function confirmSubmit(password: string) {
    setSubmitting(true)
    setReauthError("")
    try {
      const data=new FormData();data.set("serviceId",serviceId);data.set("rating",String(rating));data.set("content",comment.trim());data.set("password",password);await addReview(data)
    } catch (err) {
      setReauthError(err instanceof Error ? err.message : "Error al enviar la reseña")
      setSubmitting(false)
      return
    }

    addToast("Reseña enviada con éxito", "success")
    setRating(0)
    setComment("")
    setSubmitting(false)
    setConfirmOpen(false)
    setEligible(false)
    onSubmitted?.()
  }

  if (authLoading) return null

  if (!user) {
    return (
      <div className="neo-card rounded-lg p-6 text-sm text-muted-fg">
        Inicia sesión para dejar una reseña de este servicio.
      </div>
    )
  }

  if (eligible === null) return null

  if (!eligible) {
    return (
      <div className="neo-card rounded-lg p-6 text-sm text-muted-fg">
        Debes completar un pedido de este servicio antes de dejar una reseña.
      </div>
    )
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

      <PasswordConfirmModal
        isOpen={confirmOpen}
        loading={submitting}
        error={reauthError}
        onConfirm={confirmSubmit}
        onCancel={() => { setConfirmOpen(false); setReauthError("") }}
      />
    </form>
  )
}
