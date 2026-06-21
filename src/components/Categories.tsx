"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import AnimatedSection from "./AnimatedSection"
import TiltCard from "./TiltCard"
import type { Category } from "@/types"

const emojiGradients: Record<string, string> = {
  "🌐": "from-blue-500 to-cyan-500",
  "🎨": "from-pink-500 to-rose-500",
  "📊": "from-amber-500 to-orange-500",
  "✍️": "from-emerald-500 to-teal-500",
  "🎬": "from-red-500 to-rose-500",
  "🎵": "from-violet-500 to-purple-500",
  "💻": "from-indigo-500 to-blue-500",
  "💼": "from-zinc-600 to-zinc-800",
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
    <section className="py-20 sm:py-28 bg-muted/50 relative overflow-hidden" style={{ perspective: "1000px" }}>
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
                    <div className={`absolute inset-0 bg-gradient-to-br ${emojiGradients[category.icon] || "from-zinc-500 to-zinc-700"} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <span className="text-4xl hover:scale-110 hover:rotate-6 transition-all duration-300" style={{ transform: "translateZ(20px)" }}>
                      {category.icon}
                    </span>
                    <span className="font-medium text-foreground text-sm text-center" style={{ transform: "translateZ(15px)" }}>
                      {category.name}
                    </span>
                    <span className="text-xs text-muted-fg" style={{ transform: "translateZ(10px)" }}>
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
