"use client"

import { useEffect, useState } from "react"
import { Quote, Star } from "lucide-react"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import AnimatedSection from "./AnimatedSection"
import TiltCard from "./TiltCard"
import type { Testimonial } from "@/types"

const fallbackTestimonials: Testimonial[] = [
  {
    id: "fallback-1",
    name: "María Fernanda",
    role: "Founder, Studio Nova",
    avatar: "MF",
    rating: 5,
    content: "Encontramos una diseñadora senior en horas y el proyecto avanzó con una claridad que no habíamos logrado en otras plataformas.",
    created_at: "",
  },
  {
    id: "fallback-2",
    name: "Carlos Rivera",
    role: "Product Lead",
    avatar: "CR",
    rating: 5,
    content: "La experiencia se siente premium: perfiles claros, comunicación directa y una sensación de control durante todo el proceso.",
    created_at: "",
  },
  {
    id: "fallback-3",
    name: "Ana Lucía",
    role: "Marketing Manager",
    avatar: "AL",
    rating: 5,
    content: "FreelanceHub nos ayudó a armar un equipo flexible para campaña, landing y contenido sin perder velocidad.",
    created_at: "",
  },
]

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    const supabase = createClient()
    supabase
      .from("testimonials")
      .select("*")
      .order("created_at")
      .then(({ data }) => {
        if (data?.length) setTestimonials(data)
      })
  }, [])

  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 tech-line opacity-70" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-primary">Confianza en movimiento</p>
            <h2 className="text-3xl font-black tracking-normal text-foreground sm:text-5xl">
              Clientes que convierten briefings en entregables.
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-fg sm:text-lg">
              La plataforma está construida para que el talento se vea, se compare y se contrate con seguridad.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.id} delay={index * 120} type={index === 1 ? "up" : index === 0 ? "left" : "right"}>
              <TiltCard tiltDegree={3} glare scale={1.01}>
                <div className="group relative h-full overflow-hidden rounded-lg border border-card-border bg-card-bg/80 p-6 backdrop-blur-xl transition-colors hover:border-primary/40">
                  <div className="mb-5 flex items-center justify-between gap-4" style={{ transform: "translateZ(16px)" }}>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? "fill-warning text-warning" : "text-muted-fg/30"}`}
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                    <Quote className="h-8 w-8 text-primary/30 transition-colors group-hover:text-primary/55" strokeWidth={1.4} />
                  </div>

                  <p className="text-sm leading-7 text-muted-fg transition-colors group-hover:text-foreground" style={{ transform: "translateZ(10px)" }}>
                    “{testimonial.content}”
                  </p>

                  <div className="mt-7 flex items-center gap-3 border-t border-card-border pt-5" style={{ transform: "translateZ(18px)" }}>
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-rose-400 text-sm font-black text-white shadow-lg shadow-black/10">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{testimonial.name}</div>
                      <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-fg">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
