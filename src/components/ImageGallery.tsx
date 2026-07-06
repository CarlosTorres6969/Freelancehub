"use client"

import { useState } from "react"
import { ImageIcon } from "lucide-react"

export default function ImageGallery({ images }: { images?: string[] }) {
  const [active, setActive] = useState(0)
  const hasImages = images && images.length > 0

  return (
    <div>
      <div className="neo-card relative mb-3 aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-violet-100 to-cyan-100 dark:from-violet-950 dark:to-cyan-950">
        {hasImages ? (
          <img
            src={images[active]}
            alt=""
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="h-16 w-16 text-muted-fg" strokeWidth={1.4} />
          </div>
        )}
        <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur">
          {hasImages ? `Imagen ${active + 1} de ${images.length}` : "Vista previa"}
        </div>
      </div>
      {hasImages && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-12 w-16 shrink-0 rounded-lg border-2 transition-all ${
                i === active
                  ? "border-violet-500 ring-2 ring-violet-500/30"
                  : "border-card-border opacity-60 hover:opacity-100"
              }`}
            >
              <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full rounded-md object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
