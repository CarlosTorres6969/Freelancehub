"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"

export type AuthMode = "login" | "register"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: AuthMode
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const mode = initialMode
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  useEffect(() => {
    if (isOpen) {
      setError("")
      setSuccessMsg("")
    }
  }, [isOpen, initialMode])

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccessMsg("")
    setLoading(true)

    try {
      if (mode === "register") {
        if (password !== confirmPassword) {
          setError("Las contraseñas no coinciden")
          return
        }
        if (password.length < 6) {
          setError("La contraseña debe tener al menos 6 caracteres")
          return
        }

        const response = await fetch("/api/auth/register", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({email,password}) })
        const result = await response.json()
        if (!response.ok) {
          setError(result.error || "Error al crear la cuenta")
          return
        }
        window.location.reload()
      } else {
        const response = await fetch("/api/auth/login", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({email,password}) })
        const result = await response.json()
        if (!response.ok) {
          setError(result.error || "Credenciales incorrectas")
          return
        }
        window.location.reload()
        onClose()
      }
    } catch (err: unknown) {
      let msg = "Error de autenticación"
      if (err instanceof Error) {
        msg = err.message
      } else if (typeof err === "object" && err !== null) {
        const e = err as Record<string, unknown>
        msg = (e.message as string) || (e.error_description as string) || (e.code as string) || JSON.stringify(err)
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  async function handleOAuth(provider: "google" | "apple") {
    setError(`El acceso con ${provider} todavía no está configurado.`)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="neo-card w-full max-w-md mx-4 overflow-hidden rounded-lg shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-card-border flex items-center justify-between">
          <h2 className="text-xl font-black text-foreground">
            {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 transition-colors hover:bg-accent group"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5 text-muted-fg transition-all duration-300 group-hover:rotate-90 group-hover:text-foreground" strokeWidth={1.8} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm">
              {successMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              className="input-future w-full rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-fg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input-future w-full rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-fg"
            />
          </div>

          {mode === "register" && (
            <div className="animate-fade-in">
              <label className="block text-sm font-medium text-foreground mb-1">Confirmar contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input-future w-full rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-fg"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>
              {loading ? "Procesando..." : mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
            </span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-card-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card-bg px-2 text-muted-fg">O continúa con</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              className="flex items-center justify-center gap-2 rounded-lg border border-card-border py-2.5 text-sm text-foreground transition-all hover:-translate-y-0.5 hover:bg-accent"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("apple")}
              className="flex items-center justify-center gap-2 rounded-lg border border-card-border py-2.5 text-sm text-foreground transition-all hover:-translate-y-0.5 hover:bg-accent"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.627-5.372-12-12-12zm-2 17.5l-5-5 1.41-1.41L10 14.67l7.59-7.59L19 8.5l-9 9z"/></svg>
              Apple
            </button>
          </div>

          <p className="text-center text-xs text-muted-fg mt-4">
            Al continuar, aceptas nuestros{" "}
            <Link href="/terms" className="text-indigo-500 hover:text-indigo-600 underline">Términos y condiciones</Link>{" "}
            y{" "}
            <Link href="/privacy" className="text-indigo-500 hover:text-indigo-600 underline">Política de privacidad</Link>.
          </p>
        </form>
      </div>
    </div>
  )
}
