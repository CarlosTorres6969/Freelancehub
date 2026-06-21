"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import AnimatedSection from "./AnimatedSection"
import TiltCard from "./TiltCard"
import type { Category } from "@/types"

const iconSvgs: Record<string, string> = {
  "🌐": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-full h-full"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>',
  "🎨": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-full h-full"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 00-7.07 17.07 4 4 0 005.66-5.66 4 4 0 015.66-5.66 4 4 0 005.66 5.66A10 10 0 0012 2z"/><path d="M12 22v-4"/></svg>',
  "📊": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-full h-full"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
  "✍️": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-full h-full"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  "🎬": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-full h-full"><rect x="2" y="2" width="20" height="20" rx="2.18"/><path d="M8 2v20M16 2v20M2 8h20M2 16h20"/></svg>',
  "🎵": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-full h-full"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  "💻": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-full h-full"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  "💼": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-full h-full"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>',
}

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
                    <span
                      className="w-10 h-10 flex items-center justify-center hover:scale-110 hover:rotate-6 transition-all duration-300"
                      style={{ transform: "translateZ(20px)" }}
                      dangerouslySetInnerHTML={{ __html: iconSvgs[category.icon] || iconSvgs["💼"] }}
                    />
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
