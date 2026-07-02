"use client"

import { Heart } from "lucide-react"
import { useFavorites } from "@/contexts/FavoritesContext"
import { useAuth } from "@/contexts/AuthContext"

export default function FavoriteButton({ serviceId }: { serviceId: string }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { user } = useAuth()
  const fav = isFavorite(serviceId)

  if (!user) return null

  return (
    <button
      onClick={(e) => { e.preventDefault(); toggleFavorite(serviceId) }}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all backdrop-blur-sm ${
        fav
          ? "border-danger bg-danger text-white shadow-lg shadow-danger/20"
          : "border-card-border bg-card-bg/80 text-muted-fg hover:bg-accent hover:text-foreground"
      }`}
      aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <Heart className={`h-4 w-4 ${fav ? "fill-current" : ""}`} strokeWidth={1.8} />
    </button>
  )
}
