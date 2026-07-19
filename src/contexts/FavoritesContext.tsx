"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
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

  useEffect(() => {
    if (!user) {
      setFavorites([])
      return
    }
    fetch("/api/me/favorites").then(r=>r.json()).then(data=>Array.isArray(data)&&setFavorites(data))
  }, [user])

  const toggleFavorite = useCallback(async (serviceId: string) => {
    if (!user) return

    const response=await fetch("/api/me/favorites",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({serviceId})});if(response.ok){const{active}=await response.json();setFavorites(prev=>active?[...new Set([...prev,serviceId])]:prev.filter(id=>id!==serviceId))}
  }, [user])

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
