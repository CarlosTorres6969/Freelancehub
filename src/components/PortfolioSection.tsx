"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

interface PortfolioItem {
  id: string
  title: string
  description: string | null
  image_url: string
  url: string | null
  created_at: string
}

interface PortfolioSectionProps {
  freelancerId?: string    // para vista pública
  editable?: boolean       // solo en /profile
}

export default function PortfolioSection({ freelancerId, editable = false }: PortfolioSectionProps) {
  const { user } = useAuth()
  const supabase = createClient()
  const targetId = freelancerId ?? user?.id

  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!targetId) { setLoading(false); return }
    supabase
      .from("portfolio_items")
      .select("*")
      .eq("freelancer_id", targetId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems(data ?? [])
        setLoading(false)
      })
  }, [targetId])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { setError("Máximo 5MB"); return }
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setError("")
  }

  async function handleAdd() {
    if (!user || !file || !title.trim()) {
      setError("Título e imagen son requeridos")
      return
    }
    setUploading(true)
    setError("")

    const ext = file.name.split(".").pop()
    const path = `${user.id}/${Date.now()}.${ext}`

    const { error: upErr } = await supabase.storage
      .from("services")
      .upload(path, file, { upsert: false })

    if (upErr) { setError(upErr.message); setUploading(false); return }

    const { data: { publicUrl } } = supabase.storage.from("services").getPublicUrl(path)

    const { data, error: insertErr } = await supabase
      .from("portfolio_items")
      .insert({ freelancer_id: user.id, title, description: description || null, image_url: publicUrl, url: url || null })
      .select()
      .single()

    if (insertErr) { setError(insertErr.message); setUploading(false); return }

    setItems(prev => [data, ...prev])
    setTitle(""); setDescription(""); setUrl(""); setFile(null); setPreview(null)
    setShowForm(false)
    setUploading(false)
  }

  async function handleDelete(id: string) {
    await supabase.from("portfolio_items").delete().eq("id", id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  if (loading) return <div className="h-32 animate-pulse rounded-lg bg-muted" />

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Portafolio</h2>
        {editable && (
          <button
            onClick={() => setShowForm(v => !v)}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar trabajo
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="neo-card mb-6 space-y-3 rounded-lg p-5 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Título *</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Nombre del proyecto"
                className="input-future w-full rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">URL del proyecto</label>
              <input value={url} onChange={e => setUrl(e.target.value)}
                placeholder="https://..."
                className="input-future w-full rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Descripción</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              rows={2} placeholder="Breve descripción del trabajo..."
              className="input-future w-full resize-none rounded-lg px-3 py-2 text-sm" />
          </div>

          {/* Image upload */}
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-card-border rounded-xl p-4 text-center cursor-pointer hover:border-indigo-400 transition-colors"
          >
            {preview ? (
              <div className="relative h-32 rounded-lg overflow-hidden">
                <Image src={preview} alt="preview" fill className="object-cover" />
              </div>
            ) : (
              <div className="py-4 text-muted-fg">
                <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Click para subir imagen</p>
                <p className="text-xs mt-1">JPG, PNG, WebP · Máx. 5MB</p>
              </div>
            )}
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={uploading}
              className="btn-primary px-4 py-2 text-sm disabled:opacity-50">
              {uploading ? "Subiendo..." : "Guardar"}
            </button>
            <button onClick={() => { setShowForm(false); setError("") }}
              className="px-4 py-2 text-sm text-muted-fg hover:text-foreground transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-card-border py-10 text-center text-sm text-muted-fg">
          {editable ? "Agrega tus mejores trabajos para atraer clientes." : "Este freelancer aún no ha agregado trabajos."}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="group relative aspect-video overflow-hidden rounded-lg border border-card-border bg-card-bg">
              <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <p className="text-white text-sm font-medium line-clamp-1">{item.title}</p>
                {item.description && <p className="text-white/70 text-xs line-clamp-1 mt-0.5">{item.description}</p>}
                <div className="flex items-center gap-2 mt-2">
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-white/80 hover:text-white underline" onClick={e => e.stopPropagation()}>
                      Ver proyecto
                    </a>
                  )}
                  {editable && (
                    <button onClick={() => handleDelete(item.id)}
                      className="ml-auto text-xs text-red-400 hover:text-red-300 transition-colors">
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
