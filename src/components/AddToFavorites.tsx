"use client"

import { Heart } from "lucide-react"
import { useFavorites } from "@/contexts/FavoritesContext"
import { useAuth } from "@/contexts/AuthContext"

export default function AddToFavorites({ serviceId }: { serviceId: string }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { user } = useAuth()
  const fav = isFavorite(serviceId)

  if (!user) return null

  return (
    <button
      onClick={() => toggleFavorite(serviceId)}
      className={`mb-3 flex w-full items-center justify-center gap-2 rounded-lg border py-3 text-sm font-bold transition-all ${
        fav
          ? "border-danger bg-danger text-white shadow-lg shadow-danger/20"
          : "border-card-border text-muted-fg hover:bg-accent hover:text-foreground"
      }`}
    >
      <Heart className={`h-5 w-5 ${fav ? "fill-current" : ""}`} strokeWidth={1.8} />
      {fav ? "Quitar de favoritos" : "Guardar en favoritos"}
    </button>
  )
}
