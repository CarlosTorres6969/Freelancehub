"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import AnimatedSection from "./AnimatedSection"
import TiltCard from "./TiltCard"
import type { Category } from "@/types"

const gradientMap: Record<string, string> = {
  web: "from-blue-500 to-cyan-500",
  diseño: "from-pink-500 to-rose-500",
  marketing: "from-amber-500 to-orange-500",
  redacción: "from-emerald-500 to-teal-500",
  video: "from-red-500 to-rose-500",
  música: "from-violet-500 to-purple-500",
  programación: "from-indigo-500 to-blue-500",
  consultoría: "from-zinc-600 to-zinc-800",
}

function getGradient(slug: string): string {
  for (const [key, value] of Object.entries(gradientMap)) {
    if (slug.includes(key)) return value
  }
  return "from-indigo-500 to-purple-500"
}

function firstLetter(slug: string): string {
  const map: Record<string, string> = {
    "desarrollo-web": "DW",
    "diseno-grafico": "DG",
    "marketing-digital": "MD",
    redaccion: "RT",
    "video-animacion": "VA",
    "musica-audio": "MA",
    "programacion-tech": "PT",
    consultoria: "CO",
  }
  return map[slug] || slug.slice(0, 2).toUpperCase()
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .order("name")
      .then(({ data }) => {
        if (data) setCategories(data)
      })
  }, [])

  return (
    <section className="py-20 sm:py-28 bg-muted/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-50 via-transparent to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Explora por categoría
            </h2>
            <p className="mt-4 text-lg text-muted-fg">
              Encuentra exactamente lo que necesitas en nuestras categorías especializadas.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <AnimatedSection key={category.id} delay={index * 80}>
              <Link href={`/marketplace?category=${category.slug}`}>
                <TiltCard tiltDegree={4} glare={true} scale={1.03}>
                  <div className="relative flex flex-col items-center gap-3 p-6 rounded-2xl border border-card-border bg-card-bg hover:border-transparent transition-colors duration-300 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(category.slug)} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getGradient(category.slug)} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                      {firstLetter(category.slug)}
                    </div>
                    <span className="font-medium text-foreground text-sm text-center">
                      {category.name}
                    </span>
                    <span className="text-xs text-muted-fg">
                      {category.services_count} servicios
                    </span>
                  </div>
                </TiltCard>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
