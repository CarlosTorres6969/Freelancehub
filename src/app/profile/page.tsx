"use client"

import { useState, useEffect } from "react"
import { updateProfile } from "@/actions/profile"
import { useAuth } from "@/contexts/AuthContext"
import { toTitleCase } from "@/lib/validation"
import AnimatedSection from "@/components/AnimatedSection"
import AvatarUpload from "@/components/AvatarUpload"
import TitleDocumentUpload from "@/components/TitleDocumentUpload"
import LanguageCertificates from "@/components/LanguageCertificates"
import LocationPicker from "@/components/LocationPicker"
import TagAutocomplete from "@/components/TagAutocomplete"
import PortfolioSection from "@/components/PortfolioSection"
import { COMMON_LANGUAGES } from "@/data/languages"
import { COMMON_SKILLS } from "@/data/skills"

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const [name, setName] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [bio, setBio] = useState("")
  const [department, setDepartment] = useState("")
  const [municipality, setMunicipality] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [nativeLanguage, setNativeLanguage] = useState("")
  const [role, setRole] = useState<"client" | "freelancer">("client")
  const [changingRole, setChangingRole] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "")
      setTitle(profile.title ?? "")
      setDescription(profile.description ?? "")
      setBio(profile.bio ?? "")
      setDepartment(profile.department ?? "")
      setMunicipality(profile.municipality ?? "")
      setSkills(profile.skills ?? [])
      setLanguages(profile.languages ?? [])
      setNativeLanguage(profile.native_language ?? "")
      setRole((profile.role === "freelancer" ? "freelancer" : "client"))
    }
  }, [profile])

  useEffect(() => {
    if (nativeLanguage && !languages.includes(nativeLanguage)) setNativeLanguage("")
  }, [languages, nativeLanguage])

  async function handleRoleChange(newRole: "client" | "freelancer") {
    if (!user) return
    setChangingRole(true)
    await fetch("/api/me/role",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({role:newRole})})
    await refreshProfile()
    setRole(newRole)
    setChangingRole(false)
  }

  async function handleSave() {
    if (!user) return
    setLoading(true)
    setError("")
    setSaved(false)

    try {const data=new FormData();Object.entries({name,title,description,bio,department,municipality,native_language:nativeLanguage}).forEach(([k,v])=>data.set(k,v));data.set("skills",skills.join(","));data.set("languages",languages.join(","));await updateProfile(data)
      setSaved(true)
      await refreshProfile()
      setTimeout(() => setSaved(false), 3000)
    }catch(e){setError(e instanceof Error?e.message:"No se pudo guardar")}
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
            <div className="flex-1">
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

        {/* Cambio de rol — solo si no es admin */}
        {profile?.role !== "admin" && (
          <AnimatedSection>
            <div className="p-6 rounded-xl border border-card-border bg-card-bg">
              <h3 className="text-sm font-semibold text-foreground mb-1">Tipo de cuenta</h3>
              <p className="text-xs text-muted-fg mb-4">Cambia entre modo cliente y freelancer en cualquier momento.</p>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: "client", icon: "🛒", label: "Cliente", desc: "Contratar servicios" },
                  { value: "freelancer", icon: "💼", label: "Freelancer", desc: "Ofrecer servicios" },
                ] as const).map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleRoleChange(opt.value)}
                    disabled={changingRole || role === opt.value}
                    className={`p-4 rounded-xl border-2 text-left transition-all disabled:cursor-default ${
                      role === opt.value
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-card-border hover:border-indigo-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">{opt.icon}</div>
                    <div className="text-sm font-semibold text-foreground">{opt.label}</div>
                    <div className="text-xs text-muted-fg">{opt.desc}</div>
                    {role === opt.value && <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium">✓ Actual</div>}
                  </button>
                ))}
              </div>
              {changingRole && <p className="text-xs text-muted-fg mt-2 text-center animate-pulse">Actualizando...</p>}
            </div>
          </AnimatedSection>
        )}

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
                  onBlur={() => setName((current) => toTitleCase(current))}
                  className="input-future w-full rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-fg mb-1">Ubicación</label>
                <LocationPicker
                  department={department}
                  municipality={municipality}
                  onChange={(next) => { setDepartment(next.department); setMunicipality(next.municipality) }}
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
                <TagAutocomplete
                  value={languages}
                  onChange={setLanguages}
                  suggestions={COMMON_LANGUAGES.map((l) => l.label)}
                  placeholder="Escribe un idioma, ej: Inglés"
                />
                {languages.length > 0 && (
                  <div className="mt-3">
                    <label className="block text-xs text-muted-fg mb-1">Idioma nativo</label>
                    <select
                      value={nativeLanguage}
                      onChange={(e) => setNativeLanguage(e.target.value)}
                      className="input-future w-full rounded-lg px-4 py-2.5 text-sm"
                    >
                      <option value="">Ninguno</option>
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {role === "freelancer" && (
          <AnimatedSection>
            <div className="p-6 rounded-xl border border-card-border bg-card-bg space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Perfil de Freelancer</h3>
                <p className="text-xs text-muted-fg">Esta información solo la ven los clientes cuando estás en modo freelancer.</p>
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
                <div className="mt-3">
                  <TitleDocumentUpload />
                </div>
              </div>

              <LanguageCertificates languages={languages} />

              <div>
                <label className="block text-sm font-medium text-muted-fg mb-1">Habilidades</label>
                <TagAutocomplete
                  value={skills}
                  onChange={setSkills}
                  suggestions={COMMON_SKILLS}
                  placeholder="Escribe una habilidad, ej: TypeScript"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-fg mb-1">Biografía</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="input-future w-full resize-none rounded-lg px-4 py-2.5 text-sm"
                />
              </div>

              <PortfolioSection editable />
            </div>
          </AnimatedSection>
        )}

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
      </div>
    </div>
  )
}
