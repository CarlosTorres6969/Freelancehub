"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"

export interface RecentlyViewedItem {
  serviceId: string
  title: string
  category: string
  price: number
  viewedAt: string
}

const RecentlyViewedContext = createContext<{
  items: RecentlyViewedItem[]
  addItem: (item: Omit<RecentlyViewedItem, "viewedAt">) => void
  clearAll: () => void
}>({
  items: [],
  addItem: () => {},
  clearAll: () => {},
})

const STORAGE_KEY = "freelancehub_recently_viewed"
const MAX_ITEMS = 6

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<RecentlyViewedItem[]>(() => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    try {
      return JSON.parse(stored) as RecentlyViewedItem[]
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((item: Omit<RecentlyViewedItem, "viewedAt">) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.serviceId !== item.serviceId)
      const newItem: RecentlyViewedItem = { ...item, viewedAt: new Date().toISOString() }
      return [newItem, ...filtered].slice(0, MAX_ITEMS)
    })
  }, [])

  const clearAll = useCallback(() => {
    setItems([])
  }, [])

  return (
    <RecentlyViewedContext.Provider value={{ items, addItem, clearAll }}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export const useRecentlyViewed = () => useContext(RecentlyViewedContext)
