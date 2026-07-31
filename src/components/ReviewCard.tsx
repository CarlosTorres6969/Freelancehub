"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"
import { editReview, replyToReview } from "@/actions/reviews"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import PasswordConfirmModal from "@/components/PasswordConfirmModal"
import type { Review } from "@/types"

export default function ReviewCard({ review, freelancerId }: { review: Review; freelancerId: string }) {
  const { user } = useAuth()
  const { addToast } = useToast()
  const router = useRouter()

  const [editing, setEditing] = useState(false)
  const [rating, setRating] = useState(review.rating)
  const [hover, setHover] = useState(0)
  const [content, setContent] = useState(review.content)
  const [busy, setBusy] = useState(false)

  const [replying, setReplying] = useState(false)
  const [replyText, setReplyText] = useState(review.freelancer_reply ?? "")

  const [reauthAction, setReauthAction] = useState<null | ((password: string) => Promise<void>)>(null)
  const [reauthError, setReauthError] = useState("")
  const [reauthLoading, setReauthLoading] = useState(false)

  const isAuthor = user?.id === review.user_id
  const isFreelancer = user?.id === freelancerId

  function requestReauth(run: (password: string) => Promise<void>) {
    setReauthError("")
    setReauthAction(() => run)
  }

  async function handleReauthConfirm(password: string) {
    if (!reauthAction) return
    setReauthLoading(true)
    setReauthError("")
    try {
      await reauthAction(password)
      setReauthAction(null)
    } catch (e) {
      setReauthError(e instanceof Error ? e.message : "Contraseña incorrecta")
    } finally {
      setReauthLoading(false)
    }
  }

  function saveEdit() {
    if (rating < 1 || !content.trim()) {
      addToast("Completa la calificación y el comentario", "error")
      return
    }
    requestReauth(async (password) => {
      setBusy(true)
      try {
        const data = new FormData()
        data.set("rating", String(rating))
        data.set("content", content.trim())
        data.set("password", password)
        await editReview(review.id, data)
        addToast("Reseña actualizada", "success")
        setEditing(false)
        router.refresh()
      } finally {
        setBusy(false)
      }
    })
  }

  function saveReply() {
    if (!replyText.trim()) {
      addToast("Escribe una respuesta", "error")
      return
    }
    requestReauth(async (password) => {
      setBusy(true)
      try {
        const data = new FormData()
        data.set("reply", replyText.trim())
        data.set("password", password)
        await replyToReview(review.id, data)
        addToast("Respuesta publicada", "success")
        setReplying(false)
        router.refresh()
      } finally {
        setBusy(false)
      }
    })
  }

  return (
    <div className="neo-card rounded-lg p-5">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-fg">
            {review.user_avatar}
          </div>
          <div>
            <div className="font-medium text-foreground text-sm">{review.user_name}</div>
            <div className="text-xs text-muted-fg">
              {new Date(review.created_at).toLocaleDateString("es-HN")}
              {review.updated_at ? " (editada)" : ""}
            </div>
          </div>
        </div>
        {!editing && (
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < review.rating ? "text-amber-400" : "text-zinc-200 dark:text-zinc-600"}`}
                fill="currentColor"
                strokeWidth={1.5}
              />
            ))}
          </div>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="p-0.5"
                aria-label={`${star} estrellas`}
              >
                <Star
                  className={`h-5 w-5 ${star <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-zinc-300 dark:text-zinc-600"}`}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="input-future w-full resize-none rounded-lg px-4 py-2.5 text-sm"
          />
          <div className="flex gap-2">
            <button disabled={busy} onClick={saveEdit} className="btn-primary px-4 py-2 text-xs disabled:opacity-50">
              Guardar
            </button>
            <button
              disabled={busy}
              onClick={() => { setEditing(false); setRating(review.rating); setContent(review.content) }}
              className="btn-secondary px-4 py-2 text-xs"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-fg leading-relaxed">&ldquo;{review.content}&rdquo;</p>
          {isAuthor && (
            <button onClick={() => setEditing(true)} className="mt-2 text-xs font-bold text-foreground hover:underline">
              Editar
            </button>
          )}
        </>
      )}

      {(review.freelancer_reply || isFreelancer) && (
        <div className="mt-4 rounded-lg border border-card-border bg-accent/40 p-3">
          {replying ? (
            <div className="space-y-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={2}
                placeholder="Responde a esta reseña..."
                className="input-future w-full resize-none rounded-lg px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button disabled={busy} onClick={saveReply} className="btn-primary px-4 py-2 text-xs disabled:opacity-50">
                  Publicar
                </button>
                <button
                  disabled={busy}
                  onClick={() => { setReplying(false); setReplyText(review.freelancer_reply ?? "") }}
                  className="btn-secondary px-4 py-2 text-xs"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : review.freelancer_reply ? (
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Respuesta del freelancer</span>
                {isFreelancer && (
                  <button onClick={() => setReplying(true)} className="text-xs font-bold text-foreground hover:underline">
                    Editar
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-fg">{review.freelancer_reply}</p>
            </div>
          ) : (
            <button onClick={() => setReplying(true)} className="text-xs font-bold text-foreground hover:underline">
              Responder a esta reseña
            </button>
          )}
        </div>
      )}

      <PasswordConfirmModal
        isOpen={!!reauthAction}
        loading={reauthLoading}
        error={reauthError}
        onConfirm={handleReauthConfirm}
        onCancel={() => { setReauthAction(null); setReauthError("") }}
      />
    </div>
  )
}
