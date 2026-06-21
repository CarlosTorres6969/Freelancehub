"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import AnimatedSection from "./AnimatedSection"
import TiltCard from "./TiltCard"
import type { Testimonial } from "@/types"

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("*")
      .order("created_at")
      .then(({ data }) => {
        if (data) setTestimonials(data)
      })
  }, [])

  return (
    <section className="py-20 sm:py-28 bg-background relative overflow-hidden" style={{ perspective: "1000px" }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-50 via-transparent to-transparent opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Lo que dicen nuestros clientes
            </h2>
            <p className="mt-4 text-lg text-muted-fg">
              Miles de profesionales y empresas confían en FreelanceHub para sus proyectos.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.id} delay={index * 150} type={index === 1 ? "up" : index === 0 ? "left" : "right"}>
              <TiltCard tiltDegree={4} glare={true} scale={1.01}>
                <div className="group bg-card-bg p-6 rounded-2xl border border-card-border shadow-sm hover:border-indigo-200 transition-colors duration-300">
                  <div className="flex items-center gap-1 mb-4" style={{ transform: "translateZ(15px)" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 transition-all duration-300 ${i < testimonial.rating ? "text-amber-400" : "text-zinc-200"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-fg text-sm leading-relaxed mb-6 italic group-hover:text-foreground transition-colors" style={{ transform: "translateZ(10px)" }}>
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3" style={{ transform: "translateZ(20px)" }}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-sm font-medium text-white">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm">{testimonial.name}</div>
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
