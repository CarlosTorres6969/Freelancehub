"use client"

import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"

interface LanguageCertificate {
  id: string
  language: string | null
  certificate_url: string
  created_at: string
}

interface LanguageCertificatesProps {
  languages: string[]
}

export default function LanguageCertificates({ languages }: LanguageCertificatesProps) {
  const { user } = useAuth()
  const [items, setItems] = useState<LanguageCertificate[]>([])
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState("")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    fetch("/api/language-certificates").then(r => r.json()).then((data) => {
      setItems(data ?? [])
      setLoading(false)
    })
  }, [user])

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (!language) {
      setError("Selecciona primero el idioma del certificado")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("El archivo debe ser menor a 5MB")
      return
    }
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes")
      return
    }

    setError("")
    setUploading(true)

    const form=new FormData();form.set("file",file);form.set("language",language);const response=await fetch("/api/language-certificates",{method:"POST",body:form}),data=await response.json()
    if (!response.ok) {
      setError(data.error || "No se pudo subir")
      setUploading(false)
      return
    }

    setItems(prev => [data, ...prev])
    setLanguage("")
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  async function handleDelete(id: string) {
    await fetch(`/api/language-certificates?id=${id}`, { method: "DELETE" })
    setItems(prev => prev.filter(i => i.id !== id))
  }

  if (loading) return null

  return (
    <div>
      <label className="block text-sm font-medium text-muted-fg mb-1">Certificados de idioma</label>

      {languages.length === 0 ? (
        <p className="text-xs text-muted-fg">Agrega primero uno o más idiomas para poder subir un certificado.</p>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-future flex-1 rounded-lg px-4 py-2.5 text-sm"
          >
            <option value="">Selecciona un idioma</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading || !language}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50 whitespace-nowrap"
          >
            {uploading ? "Subiendo..." : "+ Agregar certificado"}
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {items.map((item) => (
            <span key={item.id} className="chip inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm">
              <a href={item.certificate_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {item.language || "Certificado"}
              </a>
              <button type="button" onClick={() => handleDelete(item.id)} className="text-muted-fg hover:text-foreground">
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
