"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { useAuth } from "./AuthContext"
import type { AppNotification } from "@/types"

const NotificationContext = createContext<{
  notifications: AppNotification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
})

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (!user) { setNotifications([]); return }

    const load=()=>fetch("/api/me/notifications",{cache:"no-store"}).then(r=>r.json()).then(data=>Array.isArray(data)&&setNotifications(data));load();const timer=setInterval(load,15000);return()=>clearInterval(timer)
  }, [user])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    await fetch("/api/me/notifications",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})})
  }, [])

  const markAllAsRead = useCallback(async () => {
    if (!user) return
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    await fetch("/api/me/notifications",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({all:true})})
  }, [user])

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
