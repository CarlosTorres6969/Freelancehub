"use client"

import { useAuth } from "@/contexts/AuthContext"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

const STEPS = [
  { id: 1, title: "Bienvenido a FreelanceHub 🎉", desc: "Cuéntanos un poco sobre ti para personalizar tu experiencia." },
  { id: 2, title: "Tu perfil profesional", desc: "Esta información aparecerá en tu perfil público." },
  { id: 3, title: "¿Cómo quieres usar FreelanceHub?", desc: "Debes elegir un rol para continuar." },
]

interface OnboardingModalProps {
  onComplete: () => void
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const { user, refreshProfile } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [skills, setSkills] = useState("")
  const [role, setRole] = useState<"client" | "freelancer" | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<number, string>>({})

  function validateStep(s: number): boolean {
    if (s === 1 && !name.trim()) {
      setErrors({ 1: "El nombre es requerido" })
      return false
    }
    if (s === 3 && !role) {
      setErrors({ 3: "Debes elegir un rol para continuar" })
      return false
    }
    setErrors({})
    return true
  }

  function handleNext() {
    if (!validateStep(step)) return
    setStep(s => (s + 1) as 1 | 2 | 3)
  }

  async function handleFinish() {
    if (!validateStep(step)) return
    if (!user || !role) return
    setLoading(true)
    await supabase.from("profiles").update({
      name: name.trim(),
      title: title.trim() || null,
      location: location.trim() || null,
      role,
      skills: skills ? skills.split(",").map(s => s.trim()).filter(Boolean) : [],
    }).eq("id", user.id)
    await refreshProfile()
    setLoading(false)
    onComplete()
    if (role === "freelancer") router.push("/profile")
    else router.push("/marketplace")
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100

  return (
    // Sin onClick en el backdrop — no se puede cerrar haciendo click afuera
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card-bg rounded-2xl shadow-2xl w-full max-w-lg mx-4 border border-card-border overflow-hidden animate-scale-in">
        {/* Progress bar */}
        <div className="h-1.5 bg-muted">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-8">
          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-6">
            {STEPS.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > s.id ? "bg-indigo-500 text-white" :
                  step === s.id ? "bg-foreground text-background" :
                  "bg-muted text-muted-fg"
                }`}>
                  {step > s.id ? "✓" : s.id}
                </div>
                {s.id < STEPS.length && <div className="w-8 h-px bg-card-border" />}
              </div>
            ))}
            <span className="ml-auto text-xs text-muted-fg">{step} de {STEPS.length}</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-1">{STEPS[step - 1].title}</h2>
          <p className="text-sm text-muted-fg mb-6">{STEPS[step - 1].desc}</p>

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  ¿Cómo te llamas? <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setErrors({}) }}
                  placeholder="Tu nombre completo"
                  autoFocus
                  className={`w-full px-4 py-2.5 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-colors ${errors[1] ? "border-red-400" : "border-card-border"}`}
                />
                {errors[1] && <p className="text-xs text-red-500 mt-1">{errors[1]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">¿Dónde estás ubicado?</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Ciudad, País"
                  className="w-full px-4 py-2.5 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-colors border-card-border"
                />
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Título profesional</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ej: Diseñador UI/UX, Desarrollador Full Stack"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-colors border-card-border"
                />
                <p className="text-xs text-muted-fg mt-1">Puedes completarlo después desde tu perfil</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Habilidades principales</label>
                <input
                  type="text"
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  placeholder="React, Figma, SEO (separadas por coma)"
                  className="w-full px-4 py-2.5 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-colors border-card-border"
                />
                {skills && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {skills.split(",").filter(s => s.trim()).map((s, i) => (
                      <span key={i} className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3 — rol obligatorio */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                {([
                  { value: "client", icon: "🛒", title: "Contratar talento", desc: "Busco profesionales para mis proyectos" },
                  { value: "freelancer", icon: "💼", title: "Ofrecer servicios", desc: "Quiero trabajar y ganar dinero" },
                ] as const).map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setRole(opt.value); setErrors({}) }}
                    className={`p-5 rounded-2xl border-2 text-left transition-all ${
                      role === opt.value
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md"
                        : errors[3] ? "border-red-300 hover:border-indigo-300" : "border-card-border hover:border-indigo-300"
                    }`}
                  >
                    <div className="text-3xl mb-3">{opt.icon}</div>
                    <div className="font-semibold text-foreground text-sm">{opt.title}</div>
                    <div className="text-xs text-muted-fg mt-1">{opt.desc}</div>
                    {role === opt.value && (
                      <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium">✓ Seleccionado</div>
                    )}
                  </button>
                ))}
              </div>
              {errors[3] && (
                <p className="text-xs text-red-500 text-center">{errors[3]}</p>
              )}
              <p className="text-xs text-muted-fg text-center pt-1">
                Podrás cambiar tu rol después desde tu perfil
              </p>
            </div>
          )}

          {/* Actions — sin botón de saltar */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={() => setStep(s => (s - 1) as 1 | 2 | 3)}
                className="text-sm text-muted-fg hover:text-foreground transition-colors flex items-center gap-1"
              >
                ← Atrás
              </button>
            ) : (
              <div /> // espacio vacío para mantener el layout
            )}
            <button
              onClick={step < 3 ? handleNext : handleFinish}
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : step === 3 ? "Empezar →" : "Continuar →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
