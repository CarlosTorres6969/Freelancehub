"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import ServiceForm from "@/components/ServiceForm"

export default function NewServicePage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) router.replace("/?auth=login")
    else if (profile && profile.role !== "freelancer" && profile.role !== "admin") {
      router.replace("/dashboard")
    }
  }, [loading, user, profile, router])

  if (loading || !user) {
    return (
      <div className="page-shell">
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  return (
    <div className="page-shell max-w-3xl">
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-fg transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
        Volver al Dashboard
      </Link>
      <h1 className="mb-2 text-3xl font-black text-foreground sm:text-4xl">Publicar un servicio</h1>
      <p className="mb-8 text-muted-fg">Completa los detalles para que tu servicio aparezca en el marketplace.</p>
      <div className="neo-card rounded-lg p-6">
        <ServiceForm />
      </div>
    </div>
  )
}
