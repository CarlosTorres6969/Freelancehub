"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

const STEPS = [
  { id: 1, title: "Bienvenido a FreelanceHub 🎉", desc: "Cuéntanos un poco sobre ti para personalizar tu experiencia." },
  { id: 2, title: "Tu perfil profesional", desc: "Esta información aparecerá en tu perfil público." },
  { id: 3, title: "¿Cómo quieres usar FreelanceHub?", desc: "Puedes cambiar esto después desde tu perfil." },
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
  const [role, setRole] = useState<"client" | "freelancer">("client")
  const [loading, setLoading] = useState(false)

  async function handleFinish() {
    if (!user) return
    setLoading(true)
    await supabase.from("profiles").update({
      name: name || undefined,
      title: title || undefined,
      location: location || undefined,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="neo-card w-full max-w-lg mx-4 overflow-hidden rounded-lg shadow-2xl animate-scale-in">
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-8">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {STEPS.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step > s.id ? "bg-indigo-500 text-white" :
                  step === s.id ? "bg-foreground text-background" :
                  "bg-muted text-muted-fg"
                }`}>
                  {step > s.id ? "✓" : s.id}
                </div>
                {s.id < STEPS.length && <div className="w-8 h-px bg-card-border" />}
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-1">{STEPS[step - 1].title}</h2>
          <p className="text-sm text-muted-fg mb-6">{STEPS[step - 1].desc}</p>

          {/* Step 1 - Nombre */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">¿Cómo te llamas?</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Tu nombre completo"
                  autoFocus
                  className="input-future w-full rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">¿Dónde estás ubicado?</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Ciudad, País"
                  className="input-future w-full rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          )}

          {/* Step 2 - Perfil profesional */}
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
                  className="input-future w-full rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Habilidades principales</label>
                <input
                  type="text"
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  placeholder="React, Figma, SEO (separadas por coma)"
                  className="input-future w-full rounded-lg px-4 py-2.5 text-sm"
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

          {/* Step 3 - Rol */}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-4">
              {([
                { value: "client", icon: "🛒", title: "Contratar", desc: "Busco talento para mis proyectos" },
                { value: "freelancer", icon: "💼", title: "Trabajar", desc: "Ofrezco mis servicios profesionales" },
              ] as const).map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setRole(opt.value)}
                  className={`p-5 rounded-lg border-2 text-left transition-all ${
                    role === opt.value
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                      : "border-card-border hover:border-indigo-300"
                  }`}
                >
                  <div className="text-3xl mb-3">{opt.icon}</div>
                  <div className="font-semibold text-foreground">{opt.title}</div>
                  <div className="text-xs text-muted-fg mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => step > 1 ? setStep(s => (s - 1) as 1 | 2 | 3) : onComplete()}
              className="text-sm text-muted-fg hover:text-foreground transition-colors"
            >
              {step === 1 ? "Omitir por ahora" : "Atrás"}
            </button>
            <button
              onClick={() => step < 3 ? setStep(s => (s + 1) as 1 | 2 | 3) : handleFinish()}
              disabled={loading}
              className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50"
            >
              {loading ? "Guardando..." : step === 3 ? "Empezar →" : "Continuar →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
