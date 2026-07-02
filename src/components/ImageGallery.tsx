"use client"

import NextImage from "next/image"
import { useState } from "react"
import { Image as ImageIcon } from "lucide-react"

export default function ImageGallery({ images }: { images?: string[] }) {
  const [active, setActive] = useState(0)
  const hasImages = Boolean(images?.length)

  return (
    <div>
      <div className="relative mb-3 aspect-video overflow-hidden rounded-lg border border-card-border bg-gradient-to-br from-accent via-card-bg to-muted">
        {hasImages && images ? (
          <NextImage
            src={images[active]}
            alt=""
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="h-16 w-16 text-muted-fg/45" strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
          {hasImages && images ? `Imagen ${active + 1} de ${images.length}` : "Vista previa"}
        </div>
      </div>
      {hasImages && images && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={`h-12 w-16 shrink-0 rounded-lg border-2 transition-all ${
                i === active
                  ? "border-primary ring-1 ring-primary"
                  : "border-card-border opacity-60 hover:opacity-100"
              }`}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <span className="relative block h-full w-full overflow-hidden rounded-md">
                <NextImage src={src} alt="" fill unoptimized className="object-cover" />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
