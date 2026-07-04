"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, MessageCircle, Package, Star } from "lucide-react"
import { useNotifications } from "@/contexts/NotificationContext"

function formatTime(ts: string) {
  const seconds = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  if (seconds < 60) return "Ahora"
  if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`
  if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} h`
  return `Hace ${Math.floor(seconds / 86400)} d`
}

const typeIcons = {
  order: Package,
  message: MessageCircle,
  review: Star,
  system: Bell,
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
        className="relative rounded-lg p-2 text-muted-fg transition-colors hover:bg-accent hover:text-foreground"
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5" strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-card-border bg-card-bg shadow-xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-card-border px-4 py-3">
            <span className="text-sm font-bold text-foreground">Notificaciones</span>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-300 dark:hover:text-violet-200">
                Marcar todas leídas
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => {
              const Icon = typeIcons[notification.type as keyof typeof typeIcons] || Bell
              return (
                <button
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent ${!notification.read ? "bg-accent/80" : ""}`}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-white">
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm text-foreground ${!notification.read ? "font-semibold" : ""}`}>{notification.title}</p>
                    <p className="truncate text-xs text-muted-fg">{notification.message}</p>
                    <p className="mt-0.5 text-[11px] text-muted-fg">{formatTime(notification.created_at)}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
