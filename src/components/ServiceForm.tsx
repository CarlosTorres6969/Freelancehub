"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/contexts/ToastContext"
import { createService, updateService } from "@/actions/services"
import type { Category, Service } from "@/types"

interface ServiceFormProps {
  service?: Service
}

export default function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const isEdit = Boolean(service)

  useEffect(() => {
    fetch("/api/public/catalog").then(r=>r.json()).then(data=>setCategories(data.categories??[]))
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      if (isEdit && service) {
        await updateService(service.id, formData)
        addToast("Servicio actualizado", "success")
        router.push("/dashboard")
      } else {
        await createService(formData)
        addToast("Servicio publicado", "success")
        router.push("/dashboard")
      }
      router.refresh()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo guardar el servicio"
      setError(msg)
      addToast(msg, "error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Título del servicio *</label>
        <input
          name="title"
          defaultValue={service?.title}
          required
          minLength={5}
          maxLength={100}
          placeholder="Ej: Diseñaré un logo profesional para tu marca"
          className="input-future w-full rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-fg"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Categoría *</label>
          <select
            name="category_id"
            defaultValue={service?.category_id ?? ""}
            required
            className="input-future w-full rounded-lg px-4 py-2.5 text-sm"
          >
            <option value="" disabled>Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Precio (HNL) *</label>
          <input
            name="price"
            type="number"
            min={1}
            max={1000000}
            step="0.01"
            defaultValue={service?.price}
            required
            placeholder="1500"
            className="input-future w-full rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-fg"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Tiempo de entrega *</label>
        <input
          name="delivery_time"
          defaultValue={service?.delivery_time}
          required
          placeholder="Ej: 3 días"
          className="input-future w-full rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-fg"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Descripción corta *</label>
        <textarea
          name="description"
          defaultValue={service?.description}
          required
          minLength={20}
          maxLength={300}
          rows={2}
          placeholder="Resumen que aparece en las tarjetas del marketplace (20-300 caracteres)"
          className="input-future w-full rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-fg"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Descripción detallada *</label>
        <textarea
          name="long_description"
          defaultValue={service?.long_description}
          required
          minLength={50}
          maxLength={5000}
          rows={6}
          placeholder="Explica en detalle qué incluye tu servicio, el proceso y lo que el cliente recibirá."
          className="input-future w-full rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-fg"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Etiquetas</label>
        <input
          name="tags"
          defaultValue={service?.tags?.join(", ")}
          placeholder="logo, branding, diseño (separadas por coma)"
          className="input-future w-full rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-fg"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Imágenes (URLs)</label>
        <input
          name="images"
          defaultValue={service?.images?.join(", ")}
          placeholder="https://... , https://... (separadas por coma)"
          className="input-future w-full rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-fg"
        />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={submitting} className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50">
          {submitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Publicar servicio"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary px-6 py-2.5 text-sm">
          Cancelar
        </button>
      </div>
    </form>
  )
}
