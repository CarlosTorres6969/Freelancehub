"use client"

import Link from "next/link"
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext"

export default function RecentlyViewed() {
  const { items, clearAll } = useRecentlyViewed()

  if (items.length === 0) return null

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Vistos Recientemente</h2>
        <button
          onClick={clearAll}
          className="text-xs text-muted-fg hover:text-foreground transition-colors"
        >
          Limpiar
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {items.map((item) => (
          <Link
            key={item.serviceId}
            href={`/services/${item.serviceId}`}
            className="shrink-0 w-48 p-3 rounded-xl border border-card-border bg-card-bg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all group"
          >
            <p className="text-xs text-muted-fg mb-1">{item.category}</p>
            <p className="text-sm font-medium text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
              {item.title}
            </p>
            <p className="text-xs font-semibold text-foreground mt-1">L {item.price.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
