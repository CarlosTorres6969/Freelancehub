"use client"

import Link from "next/link"
import { ArrowRight, BadgeCheck, Bell, LockKeyhole, MessageSquare, Rocket, ShieldCheck, Star, Zap } from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"

const steps = [
  { number: "01", title: "Crea tu cuenta", description: "Regístrate gratis y completa tu perfil con habilidades, experiencia y portafolio." },
  { number: "02", title: "Publica o explora servicios", description: "Define tus entregables como freelancer o encuentra especialistas por categoría como cliente." },
  { number: "03", title: "Conecta con claridad", description: "Conversa, alinea alcance, resuelve dudas y confirma tiempos antes de contratar." },
  { number: "04", title: "Entrega y cobra seguro", description: "Trabaja con seguimiento visible, pagos protegidos y reputación verificable." },
]

const benefits = [
  { icon: ShieldCheck, title: "Pagos seguros", description: "Un flujo diseñado para proteger a cliente y freelancer durante la entrega." },
  { icon: MessageSquare, title: "Comunicación directa", description: "Mensajes y contexto del proyecto en un solo lugar, sin perder información." },
  { icon: Star, title: "Reputación verificable", description: "Reseñas, calificaciones y perfiles pensados para elegir con confianza." },
  { icon: BadgeCheck, title: "Talento regional", description: "Profesionales de Centroamérica con visión digital y velocidad de ejecución." },
  { icon: Bell, title: "Señal en tiempo real", description: "Notificaciones y seguimiento para mantener el proyecto en movimiento." },
  { icon: LockKeyhole, title: "Control operativo", description: "Dashboard, favoritos, órdenes y conversaciones listos para revisar rápido." },
]

const plans = [
  { name: "Básico", price: "Gratis", period: "siempre", features: ["Perfil público", "3 servicios activos", "Comisión del 15%", "Soporte por email"], highlighted: false },
  { name: "Profesional", price: "L 250", period: "/mes", features: ["Perfil destacado", "Servicios ilimitados", "Comisión del 10%", "Soporte prioritario", "Estadísticas avanzadas"], highlighted: true },
  { name: "Premium", price: "L 500", period: "/mes", features: ["Todo lo de Profesional", "Insignia verificada", "Comisión del 7%", "Soporte 24/7", "Promoción en redes", "API de integración"], highlighted: false },
]

export default function HowItWorksPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 surface-grid opacity-15 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 tech-line opacity-70" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <AnimatedSection>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-card-border bg-card-bg/80 px-4 py-2 text-sm font-bold text-muted-fg backdrop-blur">
              <Rocket className="h-4 w-4 text-primary" strokeWidth={1.8} />
              Guía de inicio
            </div>
            <h1 className="text-4xl font-black tracking-normal text-foreground sm:text-6xl">
              Cómo funciona <span className="text-gradient">FreelanceHub</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-fg sm:text-lg">
              Descubre cómo conectar con talento excepcional o encontrar tu próximo proyecto freelance sin fricción.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="mb-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="rounded-lg border border-card-border bg-card-bg/80 p-6 backdrop-blur-xl transition-colors hover:border-primary/40">
                <div className="mb-3 text-3xl font-black text-primary/45">{step.number}</div>
                <div className="mb-4 h-1 w-12 rounded-full bg-primary" />
                <h3 className="mb-2 text-xl font-black text-foreground">{step.title}</h3>
                <p className="text-sm leading-7 text-muted-fg">{step.description}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <section className="mb-20">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-foreground sm:text-5xl">Beneficios de usar FreelanceHub</h2>
              <p className="mt-4 text-lg text-muted-fg">Todo lo que necesitas para trabajar de forma segura y eficiente.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon
                return (
                  <div key={benefit.title} className="rounded-lg border border-card-border bg-card-bg/80 p-6 backdrop-blur-xl transition-colors hover:border-primary/40">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-rose-400 text-white shadow-lg shadow-black/10">
                      <Icon className="h-6 w-6" strokeWidth={1.8} />
                    </div>
                    <h3 className="mb-2 font-black text-foreground">{benefit.title}</h3>
                    <p className="text-sm leading-7 text-muted-fg">{benefit.description}</p>
                  </div>
                )
              })}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="mb-16">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-foreground sm:text-5xl">Planes para freelancers</h2>
              <p className="mt-4 text-lg text-muted-fg">Elige el plan que mejor se adapte a tu forma de trabajar.</p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-lg border p-6 backdrop-blur-xl transition-colors ${
                    plan.highlighted
                      ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/10"
                      : "border-card-border bg-card-bg/80"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-fg">
                      Más popular
                    </div>
                  )}
                  <h3 className="mb-1 text-lg font-black text-foreground">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-black text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-fg"> {plan.period}</span>
                  </div>
                  <ul className="mb-6 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-fg">
                        <BadgeCheck className="h-4 w-4 shrink-0 text-success" strokeWidth={1.8} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full rounded-lg py-2.5 text-sm font-bold transition-transform hover:scale-[1.01] ${
                      plan.highlighted
                        ? "bg-foreground text-background"
                        : "border border-card-border text-foreground hover:bg-accent"
                    }`}
                  >
                    {plan.price === "Gratis" ? "Comenzar gratis" : "Seleccionar plan"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="relative overflow-hidden rounded-lg border border-white/15 bg-[#080913] p-8 text-center text-white shadow-2xl shadow-black/20 sm:p-12">
            <div className="absolute inset-0 surface-grid opacity-20" />
            <div className="relative z-10">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                <Zap className="h-6 w-6 text-cyan-200" strokeWidth={1.8} />
              </div>
              <h2 className="mb-4 text-3xl font-black sm:text-5xl">Listo para empezar</h2>
              <p className="mx-auto mb-8 max-w-2xl text-base leading-8 text-white/70">
                Únete a freelancers y clientes que ya confían en FreelanceHub para avanzar proyectos digitales.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-[#11131c] transition-transform hover:scale-[1.02]"
                >
                  Explorar servicios
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Crear cuenta gratis
                </Link>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </div>
    </div>
  )
}
