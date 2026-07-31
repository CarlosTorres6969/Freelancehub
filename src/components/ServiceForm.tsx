"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import type { Category, Service } from "@/types"

export default function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter()
  const { user, profile } = useAuth()
  const supabase = createClient()
  const isEdit = !!service

  const [categories, setCategories] = useState<Category[]>([])
  const [title, setTitle] = useState(service?.title ?? "")
  const [description, setDescription] = useState(service?.description ?? "")
  const [longDescription, setLongDescription] = useState(service?.long_description ?? "")
  const [price, setPrice] = useState(service?.price?.toString() ?? "")
  const [deliveryTime, setDeliveryTime] = useState(service?.delivery_time ?? "")
  const [categoryId, setCategoryId] = useState(service?.category_id ?? "")
  const [tags, setTags] = useState(service?.tags?.join(", ") ?? "")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    supabase.from("categories").select("*").order("name").then(({ data }) => {
      if (data) setCategories(data)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || profile?.role !== "freelancer") return
    setSubmitting(true)
    setError("")

    const payload = {
      title: title.trim(),
      description: description.trim(),
      long_description: longDescription.trim(),
      price: parseFloat(price),
      delivery_time: deliveryTime.trim(),
      category_id: categoryId,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      freelancer_id: user.id,
      active: true,
    }

    if (isEdit && service) {
      const { error: err } = await supabase.from("services").update(payload).eq("id", service.id)
      if (err) { setError(err.message); setSubmitting(false); return }
      router.push(`/services/${service.id}`)
    } else {
      const { error: err } = await supabase.from("services").insert(payload)
      if (err) { setError(err.message); setSubmitting(false); return }
      router.push("/dashboard/freelancer")
    }
  }

  if (profile?.role !== "freelancer") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Solo freelancers pueden publicar servicios</h1>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8">{isEdit ? "Editar Servicio" : "Nuevo Servicio"}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Título del servicio</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Categoría</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Seleccionar...</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Precio (L HNL)</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
              min="1"
              className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Descripción corta</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Descripción larga</label>
          <textarea
            value={longDescription}
            onChange={e => setLongDescription(e.target.value)}
            rows={5}
            className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Tiempo de entrega</label>
            <input
              type="text"
              value={deliveryTime}
              onChange={e => setDeliveryTime(e.target.value)}
              required
              placeholder="Ej: 7 días"
              className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Tags (separados por coma)</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="react, node, diseño"
              className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-foreground text-background font-semibold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
        >
          {submitting ? "Guardando..." : isEdit ? "Guardar Cambios" : "Publicar Servicio"}
        </button>
      </form>
    </div>
  )
}
