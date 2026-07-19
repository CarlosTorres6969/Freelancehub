"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useFavorites } from "@/contexts/FavoritesContext"
import AnimatedSection from "@/components/AnimatedSection"
import ServiceCard from "@/components/ServiceCard"
import type { Service } from "@/types"

export default function FavoritesPage() {
  const { user } = useAuth()
  const { favorites } = useFavorites()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    if (favorites.length === 0) { setServices([]); setLoading(false); return }

    fetch("/api/public/catalog").then(r=>r.json()).then(({services:data}) => {
        if (data) setServices(data.filter((s:Service)=>favorites.includes(s.id)))
        setLoading(false)
      })
  }, [user, favorites])

  if (loading) {
    return (
      <div className="page-shell">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-48 rounded-lg bg-muted" />
          <div className="h-6 w-64 rounded-lg bg-muted" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-72 rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <AnimatedSection>
        <span className="chip inline-flex rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
          Selección personal
        </span>
        <h1 className="mt-3 text-4xl font-black text-foreground">Mis Favoritos</h1>
        <p className="mt-2 mb-8 text-muted-fg">
          {services.length > 0
            ? `Tienes ${services.length} servicio${services.length === 1 ? "" : "s"} guardado${services.length === 1 ? "" : "s"}`
            : "Aún no has guardado ningún servicio"}
        </p>
      </AnimatedSection>

      {services.length === 0 ? (
        <AnimatedSection>
          <div className="neo-card rounded-lg py-20 text-center">
            <Heart className="mx-auto mb-4 h-14 w-14 text-rose-400" strokeWidth={1.5} />
            <p className="mx-auto mb-6 max-w-lg text-lg leading-8 text-muted-fg">
              Guarda tus servicios favoritos tocando el corazón en las tarjetas del marketplace.
            </p>
            <Link
              href="/marketplace"
              className="btn-primary px-6 py-3"
            >
              Explorar Servicios
            </Link>
          </div>
        </AnimatedSection>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <AnimatedSection key={service.id}>
              <ServiceCard service={service} />
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  )
}
