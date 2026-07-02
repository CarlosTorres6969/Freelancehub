"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useFavorites } from "@/contexts/FavoritesContext"
import AnimatedSection from "@/components/AnimatedSection"
import FavoriteButton from "@/components/FavoriteButton"
import type { Service } from "@/types"

export default function FavoritesPage() {
  const { user } = useAuth()
  const { favorites } = useFavorites()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      queueMicrotask(() => setLoading(false))
      return
    }
    if (favorites.length === 0) {
      queueMicrotask(() => {
        setServices([])
        setLoading(false)
      })
      return
    }
    const supabase = createClient()

    supabase
      .from("services")
      .select("*, category:categories(*)")
      .in("id", favorites)
      .then(({ data }) => {
        if (data) setServices(data)
        setLoading(false)
      })
  }, [user, favorites])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-48 bg-muted rounded-xl" />
          <div className="h-6 w-64 bg-muted rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-72 bg-muted rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <AnimatedSection>
        <h1 className="text-3xl font-bold mb-2">Mis Favoritos</h1>
        <p className="text-muted-fg mb-8">
          {services.length > 0
            ? `Tienes ${services.length} servicio${services.length === 1 ? "" : "s"} guardado${services.length === 1 ? "" : "s"}`
            : "Aún no has guardado ningún servicio"}
        </p>
      </AnimatedSection>

      {services.length === 0 ? (
        <AnimatedSection>
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💝</div>
            <p className="text-lg text-muted-fg mb-6">
              Guarda tus servicios favoritos tocando el corazón en las tarjetas del marketplace.
            </p>
            <Link
              href="/marketplace"
              className="btn-3d inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl font-medium hover:bg-zinc-800 transition-all"
            >
              Explorar Servicios
            </Link>
          </div>
        </AnimatedSection>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <AnimatedSection key={service.id}>
              <div className="group rounded-xl border border-card-border bg-card-bg overflow-hidden hover:shadow-lg transition-all">
                <Link href={`/services/${service.id}`}>
                  <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                      🖼️
                    </div>
                    <div className="absolute top-2 right-2">
                      <FavoriteButton serviceId={service.id} />
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                      {service.category?.name}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-yellow-500">
                      <span>⭐</span>
                      <span className="text-muted-fg">{service.rating}</span>
                    </div>
                  </div>
                  <Link href={`/services/${service.id}`}>
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {service.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-fg mb-3">
                    {service.freelancer_id ? "Freelancer" : "Freelancer"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">L {service.price.toLocaleString()}</span>
                    <Link
                      href={`/services/${service.id}`}
                      className="btn-3d text-xs px-3 py-1.5 bg-foreground text-background rounded-lg hover:bg-zinc-800 transition-all"
                    >
                      Ver más
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  )
}
