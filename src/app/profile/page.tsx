"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import AnimatedSection from "@/components/AnimatedSection"
import AvatarUpload from "@/components/AvatarUpload"
import PortfolioSection from "@/components/PortfolioSection"

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const [name, setName] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [skills, setSkills] = useState("")
  const [languages, setLanguages] = useState("")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "")
      setTitle(profile.title ?? "")
      setDescription(profile.description ?? "")
      setBio(profile.bio ?? "")
      setLocation(profile.location ?? "")
      setSkills(profile.skills?.join(", ") ?? "")
      setLanguages(profile.languages?.join(", ") ?? "")
    }
  }, [profile])

  async function handleSave() {
    if (!user) return
    setLoading(true)
    setError("")
    setSaved(false)

    const { error: err } = await supabase
      .from("profiles")
      .update({
        name,
        title,
        description,
        bio,
        location,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        languages: languages.split(",").map((l) => l.trim()).filter(Boolean),
      })
      .eq("id", user.id)

    if (err) {
      setError(err.message)
    } else {
      setSaved(true)
      refreshProfile()
      setTimeout(() => setSaved(false), 3000)
    }
    setLoading(false)
  }

  if (!user) {
    return (
      <div className="page-shell text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Inicia sesión para ver tu perfil</h1>
        <p className="text-muted-fg">Debes iniciar sesión para acceder a tu perfil.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <AnimatedSection>
        <span className="chip inline-flex rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
          Identidad profesional
        </span>
        <h1 className="mt-3 mb-8 text-4xl font-black text-foreground">Mi Perfil</h1>
      </AnimatedSection>

      <div className="space-y-8">
        <AnimatedSection>
          <div className="neo-card flex items-center gap-6 rounded-lg p-6">
            <AvatarUpload />
            <div>
              <h2 className="text-xl font-semibold">{profile?.name ?? "Usuario"}</h2>
              <p className="text-sm text-muted-fg">{user.email}</p>
              {profile?.role && (
                <span className="inline-block mt-1 text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium">
                  {profile.role === "freelancer" ? "Freelancer" : profile.role === "admin" ? "Admin" : "Cliente"}
                </span>
              )}
            </div>
          </div>
        </AnimatedSection>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
            ✓ Cambios guardados exitosamente
          </div>
        )}

        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-fg mb-1">Nombre completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-future w-full rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-fg mb-1">Título profesional</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Desarrollador Full Stack"
                  className="input-future w-full rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-fg mb-1">Ubicación</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej: Tegucigalpa, Honduras"
                  className="input-future w-full rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-fg mb-1">Descripción corta</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve descripción profesional"
                  className="input-future w-full rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-fg mb-1">Idiomas</label>
                <input
                  type="text"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  placeholder="Separados por coma: Español, Inglés"
                  className="input-future w-full rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div>
            <label className="block text-sm font-medium text-muted-fg mb-1">Biografía</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="input-future w-full resize-none rounded-lg px-4 py-2.5 text-sm"
            />
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div>
            <label className="block text-sm font-medium text-muted-fg mb-1">Habilidades (separadas por coma)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, TypeScript, Node.js"
              className="input-future w-full rounded-lg px-4 py-2.5 text-sm"
            />
            {skills && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.split(",").map((skill, i) => (
                  <span
                    key={i}
                    className="chip rounded-lg px-3 py-1.5 text-sm"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
            {saved && (
              <span className="text-sm text-emerald-500 animate-fade-in">✓ Cambios guardados</span>
            )}
          </div>
        </AnimatedSection>

        {profile?.role === "freelancer" && (
          <AnimatedSection>
            <div className="neo-card rounded-lg p-6">
              <PortfolioSection editable />
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  )
}
