"use client"

import { LayoutDashboard, MessagesSquare, Search, ShieldCheck } from "lucide-react"
import AnimatedSection from "./AnimatedSection"
import TiltCard from "./TiltCard"

const features = [
  {
    icon: Search,
    title: "Descubrimiento inteligente",
    description: "Filtros por categoría, precio, calificación y tiempo de entrega para llegar al talento correcto en menos pasos.",
    accent: "from-cyan-400 to-blue-500",
    metric: "4x",
    metricLabel: "más rápido",
  },
  {
    icon: ShieldCheck,
    title: "Contratación protegida",
    description: "Flujos de pago y entrega pensados para que cliente y freelancer trabajen con confianza desde el primer día.",
    accent: "from-emerald-400 to-teal-500",
    metric: "98%",
    metricLabel: "satisfacción",
  },
  {
    icon: MessagesSquare,
    title: "Colaboración directa",
    description: "Mensajes, contexto y seguimiento en un solo espacio para evitar pérdidas de información entre plataformas.",
    accent: "from-fuchsia-400 to-rose-500",
    metric: "24/7",
    metricLabel: "señal activa",
  },
  {
    icon: LayoutDashboard,
    title: "Operación centralizada",
    description: "Dashboard para revisar órdenes, conversaciones, favoritos y progreso sin perder el pulso del proyecto.",
    accent: "from-amber-300 to-orange-500",
    metric: "1",
    metricLabel: "panel único",
  },
]

export default function Features() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28">
      <div className="absolute inset-0 surface-grid opacity-45 [mask-image:linear-gradient(to_bottom,black,transparent_72%)]" />
      <div className="absolute inset-x-0 top-0 tech-line opacity-70" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-primary">Sistema de trabajo</p>
            <h2 className="text-3xl font-black tracking-normal text-foreground sm:text-5xl">
              Una experiencia diseñada para cerrar la brecha entre idea y entrega.
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-fg sm:text-lg">
              FreelanceHub combina búsqueda, confianza y gestión en una interfaz rápida para proyectos modernos.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <AnimatedSection key={feature.title} delay={index * 90}>
                <TiltCard tiltDegree={4} glare scale={1.015}>
                  <div className="group relative h-full overflow-hidden rounded-lg border border-card-border bg-card-bg/80 p-5 backdrop-blur-xl transition-colors hover:border-primary/40">
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${feature.accent}`} />
                    <div className="mb-6 flex items-center justify-between gap-4" style={{ transform: "translateZ(16px)" }}>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.accent} text-white shadow-lg shadow-black/10`}>
                        <Icon className="h-6 w-6" strokeWidth={1.8} />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-foreground">{feature.metric}</div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-fg">{feature.metricLabel}</div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-foreground" style={{ transform: "translateZ(18px)" }}>
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-fg" style={{ transform: "translateZ(10px)" }}>
                      {feature.description}
                    </p>
                  </div>
                </TiltCard>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
