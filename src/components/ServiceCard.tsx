"use client"

import { memo } from "react"
import Link from "next/link"
import { Clock3, Star } from "lucide-react"
import type { Service } from "@/types"
import TiltCard from "./TiltCard"
import FavoriteButton from "./FavoriteButton"

function ServiceCardInner({ service }: { service: Service }) {
  const categoryName = service.category?.name ?? ""
  const freelancerName = service.freelancer?.name ?? ""
  const freelancerAvatar = service.freelancer
    ? (service.freelancer.avatar_url
        ? undefined
        : service.freelancer.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase())
    : undefined

  return (
    <TiltCard tiltDegree={6} glare={true} scale={1.02}>
      <Link href={`/services/${service.id}`} className="group block h-full">
        <div className="neo-card flex min-h-72 flex-col rounded-lg p-5 transition-transform duration-300 group-hover:-translate-y-1">
          <div className="mb-4 flex items-start justify-between gap-3" style={{ transform: "translateZ(15px)" }}>
            <span className="chip max-w-[62%] truncate rounded-lg px-2.5 py-1 text-xs font-bold">
              {categoryName}
            </span>
            <div className="flex shrink-0 items-center gap-2">
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" strokeWidth={1.4} />
                <span className="font-semibold text-foreground">{service.rating}</span>
                <span className="text-muted-fg">({service.reviews_count})</span>
              </div>
              <FavoriteButton serviceId={service.id} />
            </div>
          </div>

          <h3 className="mb-3 text-lg font-black leading-snug text-foreground transition-colors group-hover:text-violet-500" style={{ transform: "translateZ(20px)" }}>
            {service.title}
          </h3>

          <p className="mb-5 line-clamp-2 text-sm leading-6 text-muted-fg">
            {service.description}
          </p>

          {freelancerName && (
            <div className="mb-5 flex items-center gap-2" style={{ transform: "translateZ(10px)" }}>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-xs font-bold text-white shadow-lg shadow-violet-500/20">
                {freelancerAvatar ?? "?"}
              </div>
              <span className="truncate text-sm font-medium text-muted-fg transition-colors group-hover:text-foreground">{freelancerName}</span>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between border-t border-card-border pt-4" style={{ transform: "translateZ(12px)" }}>
            <div className="flex items-center gap-2 text-sm text-muted-fg">
              <Clock3 className="h-4 w-4 text-cyan-500" strokeWidth={1.7} />
              {service.delivery_time}
            </div>
            <div className="text-right text-lg font-black text-foreground">
              L {service.price.toLocaleString()}
              <span className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-fg">HNL</span>
            </div>
          </div>
        </div>
      </Link>
    </TiltCard>
  )
}

export default memo(ServiceCardInner)
