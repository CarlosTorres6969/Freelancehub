"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageIcon } from "lucide-react"

export default function ImageGallery({ images }: { images?: string[] }) {
  const [active, setActive] = useState(0)
  const hasImages = images && images.length > 0

  return (
    <div>
      <div className="neo-card relative mb-3 aspect-video overflow-hidden rounded-lg bg-muted">
        {hasImages ? (
          <Image
            src={images[active]}
            alt=""
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className="object-cover"
            priority
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
              className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                i === active
                  ? "border-violet-500 ring-2 ring-violet-500/30"
                  : "border-card-border opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
