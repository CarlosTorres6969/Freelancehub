"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
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
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import AnimatedSection from "./AnimatedSection"
import TiltCard from "./TiltCard"
import type { Category } from "@/types"
import type { LucideIcon } from "lucide-react"

interface CategoryInfo {
  icon: LucideIcon
  gradient: string
  name: string
}

const categoriesMap: Record<string, CategoryInfo> = {
  "desarrollo-web": { icon: Globe, gradient: "from-cyan-400 to-blue-500", name: "Desarrollo Web" },
  "diseno-grafico": { icon: Palette, gradient: "from-fuchsia-400 to-rose-500", name: "Diseño Gráfico" },
  "marketing-digital": { icon: TrendingUp, gradient: "from-amber-300 to-orange-500", name: "Marketing Digital" },
  redaccion: { icon: PenTool, gradient: "from-emerald-400 to-teal-500", name: "Redacción y Traducción" },
  "video-animacion": { icon: Clapperboard, gradient: "from-rose-400 to-red-500", name: "Video y Animación" },
  "musica-audio": { icon: Music, gradient: "from-violet-400 to-purple-500", name: "Música y Audio" },
  "programacion-tech": { icon: Code, gradient: "from-indigo-400 to-cyan-500", name: "Programación y Tech" },
  consultoria: { icon: Briefcase, gradient: "from-slate-500 to-zinc-800", name: "Consultoría" },
}

const fallbackCategories: Category[] = Object.entries(categoriesMap).map(([slug, category], index) => ({
  id: `fallback-${slug}`,
  name: category.name,
  slug,
  icon: "",
  description: "",
  services_count: [34, 28, 22, 18, 16, 12, 31, 14][index],
  created_at: "",
}))

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>(fallbackCategories)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    const supabase = createClient()
    supabase
      .from("categories")
      .select("*")
      .order("name")
      .then(({ data }) => {
        if (data?.length) setCategories(data)
      })
  }, [])

  return (
    <section className="relative overflow-hidden bg-muted/60 py-20 sm:py-28">
      <div className="absolute inset-0 surface-grid opacity-35 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-secondary">Mapa de talento</p>
              <h2 className="text-3xl font-black tracking-normal text-foreground sm:text-5xl">
                Encuentra especialistas por disciplina.
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-muted-fg">
              De tecnología a contenido, cada categoría está pensada para escanear opciones rápido y entrar al marketplace con intención.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => {
            const cfg = categoriesMap[category.slug] || { icon: Briefcase, gradient: "from-slate-500 to-zinc-800", name: category.name }
            const IconComponent = cfg.icon
            return (
              <AnimatedSection key={category.id} delay={index * 70}>
                <Link href={`/marketplace?category=${category.slug}`} className="group block">
                  <TiltCard tiltDegree={3} glare scale={1.015}>
                    <div className="relative overflow-hidden rounded-lg border border-card-border bg-card-bg/80 p-5 backdrop-blur-xl transition-colors hover:border-primary/40">
                      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${cfg.gradient}`} />
                      <div className="flex items-center gap-4" style={{ transform: "translateZ(16px)" }}>
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${cfg.gradient} text-white shadow-lg shadow-black/10`}>
                          <IconComponent className="h-6 w-6" strokeWidth={1.7} />
                        </div>
                        <div className="min-w-0">
                          <span className="block truncate font-bold text-foreground transition-colors group-hover:text-primary">
                            {cfg.name}
                          </span>
                          <span className="mt-1 block text-sm text-muted-fg">
                            {category.services_count} servicios
                          </span>
                        </div>
                      </div>
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
