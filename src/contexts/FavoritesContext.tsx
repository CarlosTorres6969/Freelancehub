"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "./AuthContext"

const FavoritesContext = createContext<{
  favorites: string[]
  toggleFavorite: (serviceId: string) => Promise<void>
  isFavorite: (serviceId: string) => boolean
}>({
  favorites: [],
  toggleFavorite: async () => {},
  isFavorite: () => false,
})

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      setFavorites([])
      return
    }
    supabase
      .from("favorites")
      .select("service_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setFavorites(data.map((f) => f.service_id))
      })
  }, [user, supabase])

  const toggleFavorite = useCallback(async (serviceId: string) => {
    if (!user) return

    const isFav = favorites.includes(serviceId)

    if (isFav) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("service_id", serviceId)
      if (!error) setFavorites((prev) => prev.filter((id) => id !== serviceId))
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: user.id, service_id: serviceId })
      if (!error) setFavorites((prev) => [...prev, serviceId])
    }
  }, [user, favorites, supabase])

  const isFavorite = useCallback(
    (serviceId: string) => favorites.includes(serviceId),
    [favorites]
  )

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext)
