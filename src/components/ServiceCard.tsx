"use client"

import { memo } from "react"
import Link from "next/link"
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
      <Link href={`/services/${service.id}`} className="block">
        <div className="relative p-6 rounded-2xl border border-card-border bg-card-bg hover:border-indigo-300/50 transition-colors duration-300">
          <div className="flex items-start justify-between mb-3" style={{ transform: "translateZ(15px)" }}>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 transition-colors max-w-[55%] truncate">
              {categoryName}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 text-sm">
                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-muted-fg">{service.rating}</span>
                <span className="text-muted-fg">({service.reviews_count})</span>
              </div>
              <FavoriteButton serviceId={service.id} />
            </div>
          </div>

          <h3 className="font-semibold text-foreground mb-2 hover:text-indigo-600 transition-colors" style={{ transform: "translateZ(20px)" }}>
            {service.title}
          </h3>

          <p className="text-sm text-muted-fg mb-4 line-clamp-2">
            {service.description}
          </p>

          {freelancerName && (
            <div className="flex items-center gap-2 mb-4" style={{ transform: "translateZ(10px)" }}>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-medium text-white">
                {freelancerAvatar ?? "?"}
              </div>
              <span className="text-sm text-muted-fg hover:text-foreground transition-colors">{freelancerName}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-card-border" style={{ transform: "translateZ(12px)" }}>
            <div className="flex items-center gap-2 text-sm text-muted-fg hover:text-indigo-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {service.delivery_time}
            </div>
            <div className="text-lg font-bold text-foreground hover:text-indigo-600 transition-colors">
              L {service.price.toLocaleString()}
              <span className="text-sm font-normal text-muted-fg"> HNL</span>
            </div>
          </div>
        </div>
      </Link>
    </TiltCard>
  )
}

export default memo(ServiceCardInner)
