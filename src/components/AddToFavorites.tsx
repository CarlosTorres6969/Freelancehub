"use client"

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
      className={`flex items-center justify-center gap-2 w-full border py-3 rounded-xl transition-all mb-3 text-sm ${
        fav
          ? "border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
          : "border-card-border text-muted-fg hover:bg-accent"
      }`}
    >
      <svg
        className="w-5 h-5"
        fill={fav ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {fav ? "Quitar de favoritos" : "Guardar en favoritos"}
    </button>
  )
}
