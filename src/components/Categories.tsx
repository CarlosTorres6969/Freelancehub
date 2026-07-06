"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import AnimatedSection from "./AnimatedSection"
import TiltCard from "./TiltCard"
import {
  Briefcase,
  Clapperboard,
  Code,
  Globe,
  Music,
  Palette,
  PenTool,
  TrendingUp,
} from "lucide-react"
import type { Category } from "@/types"
import type { LucideIcon } from "lucide-react"

interface CategoryInfo {
  icon: LucideIcon
  gradient: string
  name: string
}

const categoriesMap: Record<string, CategoryInfo> = {
  "desarrollo-web": { icon: Globe, gradient: "from-cyan-400 to-blue-500", name: "Desarrollo Web" },
  "diseno-grafico": { icon: Palette, gradient: "from-fuchsia-500 to-rose-500", name: "Diseño Gráfico" },
  "marketing-digital": { icon: TrendingUp, gradient: "from-amber-400 to-orange-500", name: "Marketing Digital" },
  redaccion: { icon: PenTool, gradient: "from-emerald-400 to-teal-500", name: "Redacción y Traducción" },
  "video-animacion": { icon: Clapperboard, gradient: "from-rose-500 to-red-500", name: "Video y Animación" },
  "musica-audio": { icon: Music, gradient: "from-violet-500 to-purple-500", name: "Música y Audio" },
  "programacion-tech": { icon: Code, gradient: "from-indigo-500 to-cyan-400", name: "Programación y Tech" },
  consultoria: { icon: Briefcase, gradient: "from-slate-500 to-violet-500", name: "Consultoría" },
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
  }, [supabase])

  return (
    <section className="relative overflow-hidden border-y border-card-border bg-background/72 py-20 sm:py-24">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(118,87,245,0.10),transparent_38%),linear-gradient(300deg,rgba(8,182,214,0.10),transparent_34%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="chip inline-flex rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
              Rutas de talento
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-normal text-foreground sm:text-4xl">
              Explora por categoría
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-fg">
              Encuentra exactamente lo que necesitas en categorías diseñadas para proyectos digitales.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((category, index) => {
            const cfg = categoriesMap[category.slug] || { icon: Briefcase, gradient: "from-slate-500 to-violet-500", name: category.name }
            const IconComponent = cfg.icon
            return (
              <AnimatedSection key={category.id} delay={index * 80}>
                <Link href={`/marketplace?category=${category.slug}`} className="group block">
                  <TiltCard tiltDegree={4} glare={true} scale={1.03}>
                    <div className="neo-card flex min-h-44 flex-col items-center justify-center gap-3 rounded-lg p-5 text-center transition-transform duration-300 group-hover:-translate-y-1">
                      <div className={`grid h-14 w-14 place-items-center rounded-lg bg-gradient-to-br ${cfg.gradient} text-white shadow-lg shadow-violet-500/15`}>
                        <IconComponent className="h-7 w-7" strokeWidth={1.7} />
                      </div>
                      <span className="text-sm font-bold text-foreground">
                        {cfg.name}
                      </span>
                      <span className="text-xs text-muted-fg">
                        {category.services_count} servicios
                      </span>
                    </div>
                  </TiltCard>
                </Link>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
