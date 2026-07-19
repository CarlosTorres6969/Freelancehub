"use client"

import { useEffect, useState } from "react"
import { Quote, Star } from "lucide-react"
import AnimatedSection from "./AnimatedSection"
import TiltCard from "./TiltCard"
import type { Testimonial } from "@/types"

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  useEffect(() => {
    fetch("/api/public/home").then(r=>r.json()).then(data=>setTestimonials(data.testimonials??[]))
  }, [])

  return (
    <section className="mesh-surface py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="chip inline-flex rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
              Señales de confianza
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-normal text-foreground sm:text-4xl">
              Lo que dicen nuestros clientes
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-fg">
              Profesionales y empresas usan FreelanceHub para convertir ideas en entregables reales.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.id} delay={index * 150} type={index === 1 ? "up" : index === 0 ? "left" : "right"}>
              <TiltCard tiltDegree={4} glare={true} scale={1.01}>
                <div className="neo-card group min-h-72 rounded-lg p-6 transition-transform duration-300 hover:-translate-y-1">
                  <div className="mb-5 flex items-center justify-between">
                    <Quote className="h-8 w-8 text-violet-400/70" strokeWidth={1.6} />
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? "fill-amber-400 text-amber-400" : "text-zinc-300 dark:text-zinc-600"}`}
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mb-6 text-sm leading-7 text-muted-fg transition-colors group-hover:text-foreground">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="mt-auto flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">{testimonial.name}</div>
                      <div className="text-xs text-muted-fg">{testimonial.role}</div>
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
