"use client"

import { createContext, useContext, useState, useCallback } from "react"

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "order" | "message" | "review" | "system"
}

const initialNotifications: Notification[] = [
  { id: "n1", title: "Nuevo pedido", message: "Has recibido un nuevo pedido de TechStart HN", time: "Hace 5 min", read: false, type: "order" },
  { id: "n2", title: "Mensaje nuevo", message: "Carlos Mendoza te envió un mensaje", time: "Hace 15 min", read: false, type: "message" },
  { id: "n3", title: "Reseña recibida", message: "Ricardo Paz calificó tu servicio con 5 estrellas", time: "Hace 1 hora", read: false, type: "review" },
  { id: "n4", title: "Pedido completado", message: "El proyecto 'Landing Page' fue marcado como completado", time: "Hace 2 horas", read: true, type: "order" },
  { id: "n5", title: "Pago recibido", message: "Has recibido un pago de L 1,500.00 HNL", time: "Hace 3 horas", read: true, type: "system" },
]

const NotificationContext = createContext<{
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (n: Omit<Notification, "id" | "time" | "read">) => void
}>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  addNotification: () => {},
})

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const addNotification = useCallback((n: Omit<Notification, "id" | "time" | "read">) => {
    const newN: Notification = {
      ...n,
      id: `n${Date.now()}`,
      time: "Ahora",
      read: false,
    }
    setNotifications((prev) => [newN, ...prev])
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
