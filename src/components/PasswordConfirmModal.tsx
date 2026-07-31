"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface PasswordConfirmModalProps {
  isOpen: boolean
  title?: string
  description?: string
  loading?: boolean
  error?: string
  onConfirm: (password: string) => void
  onCancel: () => void
}

export default function PasswordConfirmModal({
  isOpen,
  title = "Confirma tu contraseña",
  description = "Por seguridad, ingresa tu contraseña para continuar con esta operación.",
  loading = false,
  error,
  onConfirm,
  onCancel,
}: PasswordConfirmModalProps) {
  const [password, setPassword] = useState("")

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onConfirm(password)
  }

  function handleCancel() {
    setPassword("")
    onCancel()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={handleCancel}
    >
      <div
        className="neo-card w-full max-w-sm mx-4 overflow-hidden rounded-lg shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-card-border flex items-center justify-between">
          <h2 className="text-lg font-black text-foreground">{title}</h2>
          <button
            onClick={handleCancel}
            className="rounded-lg p-1 transition-colors hover:bg-accent group"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5 text-muted-fg transition-all duration-300 group-hover:rotate-90 group-hover:text-foreground" strokeWidth={1.8} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-muted-fg">{description}</p>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoFocus
              className="input-future w-full rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-fg"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleCancel} className="btn-secondary flex-1 py-2.5 text-sm">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !password}
              className="btn-primary flex-1 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}