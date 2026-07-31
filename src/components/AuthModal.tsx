"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialView?: "login" | "register"
}

function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center justify-center gap-2.5 w-full border border-card-border rounded-xl py-2.5 hover:bg-muted transition-all text-sm text-foreground group">
      <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
      Google
    </button>
  )
}

export default function AuthModal({ isOpen, onClose, initialView }: AuthModalProps) {
  const router = useRouter()
  const [view, setView] = useState<"login" | "register">(initialView ?? "login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<"client" | "freelancer">("client")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const supabase = createClient()

  useEffect(() => {
    if (!isOpen) return
    setView(initialView ?? "login")
    setError("")
    setSuccessMsg("")
    setName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setRole("client")
  }, [isOpen, initialView])

  if (!isOpen) return null

  function switchView(v: "login" | "register") {
    setView(v)
    setError("")
    setSuccessMsg("")
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      if (signInError.message?.toLowerCase().includes("invalid login credentials")) {
        setError("Correo o contraseña incorrectos")
      } else {
        setError(signInError.message)
      }
      setLoading(false)
      return
    }

    onClose()
    window.location.href = "/dashboard"
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccessMsg("")

    if (!name.trim()) {
      setError("El nombre es obligatorio")
      return
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: name.trim(), role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    setSuccessMsg("¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.")
  }

  async function handleOAuth(provider: "google") {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) setError(error.message)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-card-bg rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-scale-in border border-card-border" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/10 blur-lg" />
          <svg className="w-10 h-10 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
          </svg>
          <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white/80 hover:text-white transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pt-4 pb-1">
          <h2 className="text-lg font-semibold text-foreground">
            {view === "login" ? "Bienvenido de vuelta" : "Únete a FreelanceHub"}
          </h2>
          <p className="text-sm text-muted-fg mt-0.5">
            {view === "login" ? "Ingresa tus credenciales para continuar" : "Crea tu cuenta y empieza hoy"}
          </p>
        </div>

        <div className="grid grid-cols-1">
          <form onSubmit={handleLogin}
            className={`col-start-1 row-start-1 p-6 pt-4 space-y-3.5 transition-all duration-150 ease-out ${
              view === "login" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Correo electrónico</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com" required autoFocus={view === "login"}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 focus:outline-none text-sm transition-all placeholder:text-muted-fg" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Contraseña</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 focus:outline-none text-sm transition-all placeholder:text-muted-fg" />
              </div>
            </div>

            <div className="flex justify-end -mt-1">
              <button type="button" onClick={() => router.push("/auth/reset-password")}
                className="text-xs text-indigo-500 hover:text-indigo-600 font-medium transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 active:scale-[0.98]">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Entrando...
                </span>
              ) : "Iniciar Sesión"}
            </button>

            <div className="text-center text-sm text-muted-fg">
              ¿No tienes cuenta?{' '}
              <button type="button" onClick={() => switchView("register")} className="text-indigo-500 hover:text-indigo-600 font-medium transition-colors">
                Registrarse
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-card-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card-bg px-2 text-muted-fg">o continúa con</span></div>
            </div>

            <GoogleButton onClick={() => handleOAuth("google")} />

            <p className="text-center text-xs text-muted-fg leading-relaxed">
              Al continuar, aceptas nuestros{" "}
              <Link href="/terms" className="text-indigo-500 hover:text-indigo-600 font-medium">Términos</Link>{" "}y{" "}
              <Link href="/privacy" className="text-indigo-500 hover:text-indigo-600 font-medium">Política de privacidad</Link>.
            </p>
          </form>
          <form onSubmit={handleRegister}
            className={`col-start-1 row-start-1 p-6 pt-4 space-y-3.5 transition-all duration-150 ease-out ${
              view === "register" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{successMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nombre completo</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre" required autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 focus:outline-none text-sm transition-all placeholder:text-muted-fg" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tipo de cuenta</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button type="button" onClick={() => setRole("client")}
                  className={`relative flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${role === "client" ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30" : "border-card-border hover:border-indigo-300 dark:hover:border-indigo-700 bg-transparent"}`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${role === "client" ? "bg-indigo-500 text-white" : "bg-muted text-muted-fg"}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground leading-tight">Cliente</div>
                    <div className="text-[11px] text-muted-fg leading-tight mt-0.5">Contratar servicios</div>
                  </div>
                </button>
                <button type="button" onClick={() => setRole("freelancer")}
                  className={`relative flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${role === "freelancer" ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30" : "border-card-border hover:border-indigo-300 dark:hover:border-indigo-700 bg-transparent"}`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${role === "freelancer" ? "bg-indigo-500 text-white" : "bg-muted text-muted-fg"}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground leading-tight">Freelancer</div>
                    <div className="text-[11px] text-muted-fg leading-tight mt-0.5">Ofrecer servicios</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Correo electrónico</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com" required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 focus:outline-none text-sm transition-all placeholder:text-muted-fg" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Contraseña</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres" required minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 focus:outline-none text-sm transition-all placeholder:text-muted-fg" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Confirmar contraseña</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña" required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 focus:outline-none text-sm transition-all placeholder:text-muted-fg" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 active:scale-[0.98]">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Creando cuenta...
                </span>
              ) : "Crear Cuenta"}
            </button>

            <div className="text-center text-sm text-muted-fg">
              ¿Ya tienes cuenta?{' '}
              <button type="button" onClick={() => switchView("login")} className="text-indigo-500 hover:text-indigo-600 font-medium transition-colors">
                Iniciar sesión
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-card-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card-bg px-2 text-muted-fg">o continúa con</span></div>
            </div>

            <GoogleButton onClick={() => handleOAuth("google")} />

            <p className="text-center text-xs text-muted-fg leading-relaxed">
              Al continuar, aceptas nuestros{" "}
              <Link href="/terms" className="text-indigo-500 hover:text-indigo-600 font-medium">Términos</Link>{" "}y{" "}
              <Link href="/privacy" className="text-indigo-500 hover:text-indigo-600 font-medium">Política de privacidad</Link>.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
