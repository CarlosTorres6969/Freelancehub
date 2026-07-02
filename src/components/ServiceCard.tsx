"use client"

import { memo } from "react"
import Link from "next/link"
import { Clock, Star } from "lucide-react"
import type { Service } from "@/types"
import TiltCard from "./TiltCard"
import FavoriteButton from "./FavoriteButton"

function ServiceCardInner({ service }: { service: Service }) {
  const categoryName = service.category?.name ?? "Servicio"
  const freelancerName = service.freelancer?.name ?? ""
  const freelancerAvatar = service.freelancer
    ? (service.freelancer.avatar_url
        ? undefined
        : service.freelancer.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase())
    : undefined

  return (
    <TiltCard tiltDegree={4} glare scale={1.015}>
      <Link href={`/services/${service.id}`} className="group block">
        <div className="relative overflow-hidden rounded-lg border border-card-border bg-card-bg/80 p-5 backdrop-blur-xl transition-colors hover:border-primary/40">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-rose-400 opacity-80" />

          <div className="mb-4 flex items-start justify-between gap-3" style={{ transform: "translateZ(15px)" }}>
            <span className="max-w-[58%] truncate rounded-lg border border-card-border bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-muted-fg">
              {categoryName}
            </span>
            <div className="flex shrink-0 items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg bg-warning/10 px-2 py-1 text-sm font-semibold text-foreground">
                <Star className="h-4 w-4 fill-warning text-warning" strokeWidth={1.5} />
                <span>{service.rating}</span>
                <span className="text-muted-fg">({service.reviews_count})</span>
              </div>
              <FavoriteButton serviceId={service.id} />
            </div>
          </div>

          <h3 className="text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary" style={{ transform: "translateZ(20px)" }}>
            {service.title}
          </h3>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-fg">
            {service.description}
          </p>

          {freelancerName && (
            <div className="mt-5 flex items-center gap-2" style={{ transform: "translateZ(10px)" }}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-rose-400 text-xs font-black text-white shadow-lg shadow-black/10">
                {freelancerAvatar ?? "?"}
              </div>
              <span className="truncate text-sm font-medium text-muted-fg transition-colors group-hover:text-foreground">{freelancerName}</span>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-card-border pt-4" style={{ transform: "translateZ(12px)" }}>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-fg">
              <Clock className="h-4 w-4 text-secondary" strokeWidth={1.8} />
              {service.delivery_time}
            </div>
            <div className="text-right text-lg font-black text-foreground">
              L {service.price.toLocaleString()}
              <span className="ml-1 text-xs font-bold uppercase tracking-[0.12em] text-muted-fg">HNL</span>
            </div>
          </div>
        </div>
      </Link>
    </TiltCard>
  )
}

export default memo(ServiceCardInner)
