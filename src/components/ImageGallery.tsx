"use client"

import { useState } from "react"

const allImages = [
  { src: "/placeholder.svg", label: "Vista principal" },
  { src: "/placeholder.svg", label: "Vista previa 2" },
  { src: "/placeholder.svg", label: "Vista previa 3" },
  { src: "/placeholder.svg", label: "Vista previa 4" },
]

export default function ImageGallery() {
  const [active, setActive] = useState(0)

  return (
    <div>
      <div className="relative aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 rounded-xl overflow-hidden mb-3">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">🖼️</span>
        </div>
        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {allImages[active].label}
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {allImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`shrink-0 w-16 h-12 rounded-lg border-2 transition-all ${
              i === active
                ? "border-indigo-500 ring-1 ring-indigo-500"
                : "border-zinc-200 dark:border-zinc-700 opacity-60 hover:opacity-100"
            }`}
          >
            <div className="w-full h-full rounded-md bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center text-lg">
              🖼️
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
