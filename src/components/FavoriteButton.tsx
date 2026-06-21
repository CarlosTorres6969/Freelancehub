"use client"

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
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-sm ${
        fav
          ? "bg-red-500 text-white shadow-lg"
          : "bg-white/80 text-zinc-600 hover:bg-white"
      }`}
      aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <svg
        className="w-4 h-4"
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
    </button>
  )
}
