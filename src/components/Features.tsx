"use client"

import AnimatedSection from "./AnimatedSection"
import TiltCard from "./TiltCard"

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Búsqueda Inteligente",
    description: "Encuentra el talento perfecto con filtros por categoría, precio, calificación y más.",
    gradient: "from-indigo-500 to-purple-500",
    glow: "glow-indigo",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Pagos Seguros",
    description: "Sistema de pagos protegido. Solo liberamos el pago cuando estés satisfecho con el trabajo.",
    gradient: "from-emerald-500 to-teal-500",
    glow: "glow-emerald",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Chat en Tiempo Real",
    description: "Comunicación directa con los freelancers. Resuelve dudas al instante antes de contratar.",
    gradient: "from-blue-500 to-cyan-500",
    glow: "glow-pink",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Dashboard de Control",
    description: "Gestiona tus proyectos, órdenes activas y estadísticas desde un solo panel.",
    gradient: "from-amber-500 to-orange-500",
    glow: "glow-indigo",
  },
]

export default function Features() {
  return (
    <section className="py-20 sm:py-28 bg-background relative overflow-hidden" style={{ perspective: "1000px" }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-50 via-transparent to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Todo lo que necesitas para trabajar
            </h2>
            <p className="mt-4 text-lg text-muted-fg">
              FreelanceHub ofrece las herramientas que necesitas para encontrar y gestionar el mejor talento.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <AnimatedSection key={index} delay={index * 100}>
              <TiltCard tiltDegree={5} glare={true} scale={1.02}>
                <div className="group relative p-6 rounded-2xl border border-card-border bg-card-bg hover:border-transparent transition-colors duration-300 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <div style={{ transform: "translateZ(15px)" }}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-foreground group-hover:text-white transition-all duration-300 mb-4 bg-muted group-hover:bg-gradient-to-br ${feature.gradient} group-hover:shadow-lg group-hover:scale-110`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2" style={{ transform: "translateZ(20px)" }}>{feature.title}</h3>
                  <p className="text-sm text-muted-fg leading-relaxed group-hover:text-muted-fg transition-colors" style={{ transform: "translateZ(10px)" }}>{feature.description}</p>
                </div>
              </TiltCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
