"use client"

import { BarChart3, MessageCircle, Search, ShieldCheck } from "lucide-react"
import AnimatedSection from "./AnimatedSection"
import TiltCard from "./TiltCard"

const features = [
  {
    icon: Search,
    title: "Búsqueda inteligente",
    description: "Encuentra talento ideal por categoría, precio, calificación y especialidad sin perder tiempo.",
    gradient: "from-violet-500 to-cyan-400",
  },
  {
    icon: ShieldCheck,
    title: "Pagos seguros",
    description: "Protección para ambas partes: el pago se libera cuando el trabajo está aprobado.",
    gradient: "from-cyan-400 to-emerald-400",
  },
  {
    icon: MessageCircle,
    title: "Chat en tiempo real",
    description: "Aclara alcance, tiempos y entregables con conversaciones directas antes de contratar.",
    gradient: "from-rose-500 to-violet-500",
  },
  {
    icon: BarChart3,
    title: "Panel de control",
    description: "Gestiona proyectos, órdenes, ingresos y métricas desde una experiencia clara y moderna.",
    gradient: "from-amber-400 to-rose-500",
  },
]

export default function Features() {
  return (
    <section className="mesh-surface py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="chip inline-flex rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
              Infraestructura creativa
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-normal text-foreground sm:text-4xl">
              Todo lo que necesitas para trabajar mejor
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-fg">
              FreelanceHub combina descubrimiento, confianza y gestión en una plataforma hecha para moverse rápido.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <AnimatedSection key={feature.title} delay={index * 100}>
                <TiltCard tiltDegree={5} glare={true} scale={1.02}>
                  <div className="neo-card group min-h-64 rounded-lg p-6 transition-transform duration-300 hover:-translate-y-1">
                    <div className={`mb-5 grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br ${feature.gradient} text-white shadow-lg shadow-violet-500/15 transition-transform duration-300 group-hover:scale-105`}>
                      <Icon className="h-6 w-6" strokeWidth={1.8} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-fg">{feature.description}</p>
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
