"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const supabase = createClient()

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

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (signUpError) throw signUpError
        setSuccessMsg("¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.")
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) throw signInError
        onClose()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error de autenticación"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  async function handleOAuth(provider: "google" | "apple") {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) setError(error.message)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card-bg rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-scale-in border border-card-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-card-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors group"
          >
            <svg className="w-5 h-5 text-muted-fg group-hover:text-foreground group-hover:rotate-90 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-1 bg-muted p-1 rounded-xl">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); setSuccessMsg("") }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                mode === "login"
                  ? "bg-card-bg text-foreground shadow-sm"
                  : "text-muted-fg hover:text-foreground"
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(""); setSuccessMsg("") }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                mode === "register"
                  ? "bg-card-bg text-foreground shadow-sm"
                  : "text-muted-fg hover:text-foreground"
              }`}
            >
              Registrarse
            </button>
          </div>

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
              className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-sm transition-all placeholder:text-muted-fg"
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
              className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-sm transition-all placeholder:text-muted-fg"
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
                className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-sm transition-all placeholder:text-muted-fg"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full bg-foreground text-background font-semibold py-3 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">
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
              className="flex items-center justify-center gap-2 border border-card-border rounded-xl py-2.5 hover:bg-muted transition-all text-sm hover:scale-[1.02] text-foreground"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("apple")}
              className="flex items-center justify-center gap-2 border border-card-border rounded-xl py-2.5 hover:bg-muted transition-all text-sm hover:scale-[1.02] text-foreground"
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
