"use client"

import Link from "next/link"
import { ArrowRight, BadgeCheck, Globe2, MessageCircle, Rocket, ShieldCheck, Smartphone, Star, Zap } from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"

const steps = [
  { number: "01", title: "Crea tu cuenta", description: "Regístrate gratis en FreelanceHub y completa tu perfil con habilidades, experiencia y portafolio." },
  { number: "02", title: "Publica tus servicios", description: "Define precios claros, entregables concretos y tiempos realistas para atraer clientes adecuados." },
  { number: "03", title: "Conecta con clientes", description: "Recibe solicitudes, conversa directamente, resuelve dudas y cierra acuerdos con confianza." },
  { number: "04", title: "Trabaja y cobra", description: "Entrega resultados de calidad y recibe pagos seguros a través de nuestra plataforma." },
]

const benefits = [
  { icon: ShieldCheck, title: "Pagos seguros", description: "Retenemos el pago hasta confirmar que el trabajo está completo, protegiendo a ambas partes." },
  { icon: MessageCircle, title: "Comunicación directa", description: "Chatea con clientes sin intermediarios y conserva el contexto del proyecto en un solo lugar." },
  { icon: Star, title: "Sistema de reputación", description: "Construye confianza con reseñas verificadas y perfiles que destacan el trabajo bien hecho." },
  { icon: Globe2, title: "Talento centroamericano", description: "Conecta con profesionales de toda la región: calidad local con visión global." },
  { icon: Zap, title: "Respuesta rápida", description: "Notificaciones y procesos ágiles para moverte de la idea al entregable sin fricción." },
  { icon: Smartphone, title: "Plataforma moderna", description: "Una interfaz clara y responsive para gestionar servicios, pedidos y conversaciones." },
]

const plans = [
  { name: "Básico", price: "Gratis", period: "siempre", features: ["Perfil público", "3 servicios activos", "Comisión del 15%", "Soporte por email"], highlighted: false },
  { name: "Profesional", price: "L 250", period: "/mes", features: ["Perfil destacado", "Servicios ilimitados", "Comisión del 10%", "Soporte prioritario", "Estadísticas avanzadas"], highlighted: true },
  { name: "Premium", price: "L 500", period: "/mes", features: ["Todo lo de Profesional", "Insignia verificada", "Comisión del 7%", "Soporte 24/7", "Promoción en redes", "API de integración"], highlighted: false },
]

export default function HowItWorksPage() {
  return (
    <div className="page-shell">
      <AnimatedSection>
        <div className="mb-16 text-center">
          <span className="chip inline-flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
            <Rocket className="h-4 w-4" strokeWidth={1.8} />
            Guía de inicio
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-black text-foreground sm:text-6xl">
            Cómo funciona <span className="text-gradient">FreelanceHub</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-fg">
            Conecta con talento excepcional o encuentra tu próximo proyecto freelance en un flujo simple, seguro y moderno.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="mb-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="neo-card group rounded-lg p-6 transition-transform duration-300 hover:-translate-y-1">
              <div className="mb-4 text-3xl font-black text-violet-300 transition-colors group-hover:text-violet-500">
                {step.number}
              </div>
              <div className="mb-4 h-1 w-10 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300 group-hover:w-16" />
              <h3 className="mb-3 text-xl font-black text-foreground">{step.title}</h3>
              <p className="text-sm leading-7 text-muted-fg">{step.description}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="mb-20">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-foreground sm:text-4xl">Beneficios de usar FreelanceHub</h2>
            <p className="mt-4 text-lg leading-8 text-muted-fg">Todo lo que necesitas para trabajar de forma segura y eficiente.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div key={benefit.title} className="neo-card group rounded-lg p-6 transition-transform duration-300 hover:-translate-y-1">
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-lg shadow-violet-500/15">
                    <Icon className="h-6 w-6" strokeWidth={1.8} />
                  </div>
                  <h3 className="mb-2 font-black text-foreground transition-colors group-hover:text-violet-500">{benefit.title}</h3>
                  <p className="text-sm leading-7 text-muted-fg">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="mb-12">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-foreground sm:text-4xl">Planes para freelancers</h2>
            <p className="mt-4 text-lg leading-8 text-muted-fg">Elige el plan que mejor se adapte a tus necesidades como profesional.</p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`neo-card relative rounded-lg p-6 transition-transform duration-300 hover:-translate-y-1 ${
                  plan.highlighted ? "ring-2 ring-violet-400/60" : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-3 py-1 text-xs font-bold text-white">
                    Más popular
                  </div>
                )}
                <h3 className="mb-1 text-lg font-black text-foreground">{plan.name}</h3>
                <div className="mb-5">
                  <span className="text-3xl font-black text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-fg"> {plan.period}</span>
                </div>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-fg">
                      <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-500" strokeWidth={1.8} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={plan.highlighted ? "btn-primary w-full py-2.5 text-sm" : "btn-secondary w-full py-2.5 text-sm"}>
                  {plan.price === "Gratis" ? "Comenzar gratis" : "Seleccionar plan"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="relative overflow-hidden rounded-lg border border-white/15 bg-[#080710] p-8 text-center text-white shadow-strong sm:p-12">
          <img src="/visuals/purple-desert.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.38]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,7,16,0.92),rgba(8,7,16,0.70),rgba(8,7,16,0.92))]" />
          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-black sm:text-4xl">¿Listo para empezar?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-white/78">
              Únete a freelancers y clientes que ya confían en FreelanceHub. Crear tu cuenta es gratis.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/marketplace" className="btn-primary px-8 py-3">
                Explorar servicios
                <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
              </Link>
              <Link href="/" className="inline-flex items-center justify-center rounded-lg border border-white/22 bg-white/10 px-8 py-3 font-bold text-white backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/16">
                Crear cuenta gratis
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
