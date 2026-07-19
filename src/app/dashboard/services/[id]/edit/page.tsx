"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import ServiceForm from "@/components/ServiceForm"
import type { Service } from "@/types"

export default function EditServicePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [service, setService] = useState<Service | null>(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/?auth=login")
      return
    }
    fetch(`/api/me/service/${params.id}`,{cache:"no-store"}).then(r=>r.ok?r.json():null).then((data) => {
        setService(data)
        setFetching(false)
      })
  }, [loading, user, params.id, router])

  if (loading || fetching) {
    return (
      <div className="page-shell">
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="page-shell max-w-3xl text-center">
        <h1 className="mb-3 text-2xl font-bold text-foreground">Servicio no encontrado</h1>
        <p className="mb-6 text-muted-fg">No existe o no tienes permiso para editarlo.</p>
        <Link href="/dashboard" className="btn-primary px-6 py-2.5 text-sm">Volver al Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="page-shell max-w-3xl">
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-fg transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
        Volver al Dashboard
      </Link>
      <h1 className="mb-2 text-3xl font-black text-foreground sm:text-4xl">Editar servicio</h1>
      <p className="mb-8 text-muted-fg">Actualiza los detalles de tu servicio.</p>
      <div className="neo-card rounded-lg p-6">
        <ServiceForm service={service} />
      </div>
    </div>
  )
}
