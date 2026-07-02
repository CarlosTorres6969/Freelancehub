"use client"

import { useEffect, useRef, useState } from "react"
import { Bell, Info, MessageSquare, Package, Star } from "lucide-react"
import { useNotifications } from "@/contexts/NotificationContext"

function formatTime(ts: string) {
  const seconds = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  if (seconds < 60) return "Ahora"
  if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`
  if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} h`
  return `Hace ${Math.floor(seconds / 86400)} d`
}

const iconMap = {
  order: Package,
  message: MessageSquare,
  review: Star,
  system: Info,
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-card-bg/80 text-muted-fg backdrop-blur transition-colors hover:text-foreground"
        aria-label="Notificaciones"
        title="Notificaciones"
      >
        <Bell className="h-5 w-5" strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-card-border bg-card-bg shadow-2xl shadow-black/10 backdrop-blur-xl animate-fade-in">
          <div className="flex items-center justify-between gap-3 border-b border-card-border px-4 py-3">
            <span className="text-sm font-bold text-foreground">Notificaciones</span>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs font-semibold text-primary hover:text-secondary">
                Marcar leídas
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-fg">
                No hay notificaciones nuevas.
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = iconMap[n.type] ?? Info
                return (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent ${!n.read ? "bg-primary/10" : ""}`}
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-sm text-foreground ${!n.read ? "font-bold" : "font-medium"}`}>{n.title}</span>
                      <span className="block truncate text-xs text-muted-fg">{n.message}</span>
                      <span className="mt-1 block text-[11px] text-muted-fg">{formatTime(n.created_at)}</span>
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
