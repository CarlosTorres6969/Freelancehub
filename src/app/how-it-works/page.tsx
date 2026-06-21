"use client"

import { useState } from "react"
import Link from "next/link"
import AnimatedSection from "@/components/AnimatedSection"

const steps = [
  { number: "01", title: "Crea tu cuenta", description: "Regístrate gratis en FreelanceHub. Completa tu perfil con tus habilidades, experiencia y portafolio para destacar entre los mejores freelancers de Centroamérica." },
  { number: "02", title: "Publica tus servicios", description: "Define tus servicios con precios claros, descripciones detalladas y tiempos de entrega realistas. Muestra tu trabajo y atrae a los clientes adecuados." },
  { number: "03", title: "Conecta con clientes", description: "Recibe solicitudes de clientes interesados en tus servicios. Comunícate directamente, resuelve dudas y cierra acuerdos de forma segura." },
  { number: "04", title: "Trabaja y cobra", description: "Realiza el trabajo acordado, entrega resultados de calidad y recibe pagos seguros a través de nuestra plataforma. Acumula reseñas positivas." },
]

const benefits = [
  { icon: "🔒", title: "Pagos Seguros", description: "Retenemos el pago hasta que confirmes que el trabajo está completo, protegiendo a ambas partes." },
  { icon: "💬", title: "Comunicación Directa", description: "Chatea directamente con tus clientes sin intermediarios. Toda la comunicación en un solo lugar." },
  { icon: "⭐", title: "Sistema de Reputación", description: "Construye tu reputación con reseñas verificadas. Los mejores perfiles obtienen más proyectos." },
  { icon: "🌎", title: "Talento Centroamericano", description: "Conecta con profesionales de toda la región. Calidad local con visión global." },
  { icon: "⚡", title: "Respuesta Rápida", description: "Notificaciones en tiempo real y procesos ágiles para que empieces a trabajar cuanto antes." },
  { icon: "📱", title: "Plataforma Moderna", description: "Interfaz intuitiva y moderna con las mejores herramientas para gestionar tus proyectos." },
]

const plans = [
  { name: "Básico", price: "Gratis", period: "siempre", features: ["Perfil público", "3 servicios activos", "Comisión del 15%", "Soporte por email"], highlighted: false },
  { name: "Profesional", price: "L 250", period: "/mes", features: ["Perfil destacado", "Servicios ilimitados", "Comisión del 10%", "Soporte prioritario", "Estadísticas avanzadas"], highlighted: true },
  { name: "Premium", price: "L 500", period: "/mes", features: ["Todo lo de Profesional", "Insignia verificada", "Comisión del 7%", "Soporte 24/7", "Promoción en redes", "API de integración"], highlighted: false },
]

export default function HowItWorksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero */}
      <AnimatedSection>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4">
            <span>🚀</span>
            <span>Guía de inicio</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Cómo funciona <span className="text-gradient">FreelanceHub</span>
          </h1>
          <p className="text-lg text-muted-fg max-w-2xl mx-auto">
            Descubre lo fácil que es conectar con talento excepcional o encontrar tu próximo proyecto freelance.
          </p>
        </div>
      </AnimatedSection>

      {/* Steps */}
      <AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {steps.map((step, i) => (
            <div key={i} className="relative p-6 rounded-2xl border border-card-border bg-card-bg group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl font-bold text-indigo-200 dark:text-indigo-800 group-hover:text-indigo-400 dark:group-hover:text-indigo-500 transition-colors mb-3">
                {step.number}
              </div>
              <div className="w-10 h-1 bg-indigo-500 rounded-full mb-4 group-hover:w-16 transition-all duration-300" />
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-gradient transition-all">{step.title}</h3>
              <p className="text-muted-fg text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Benefits */}
      <AnimatedSection>
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Beneficios de usar FreelanceHub</h2>
            <p className="mt-4 text-lg text-muted-fg">Todo lo que necesitas para trabajar de forma segura y eficiente.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="p-6 rounded-2xl border border-card-border bg-card-bg group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform duration-300">{benefit.icon}</span>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-indigo-600 transition-colors">{benefit.title}</h3>
                <p className="text-sm text-muted-fg">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Plans */}
      <AnimatedSection>
        <div className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Planes para freelancers</h2>
            <p className="mt-4 text-lg text-muted-fg">Elige el plan que mejor se adapte a tus necesidades como profesional.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  plan.highlighted
                    ? "border-indigo-300 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 shadow-lg"
                    : "border-card-border bg-card-bg"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-500 text-white text-xs font-semibold rounded-full">
                    Más popular
                  </div>
                )}
                <h3 className={`text-lg font-semibold mb-1 ${plan.highlighted ? "text-indigo-600 dark:text-indigo-400" : "text-foreground"}`}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className={`text-3xl font-bold ${plan.highlighted ? "text-foreground" : "text-foreground"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlighted ? "text-muted-fg" : "text-muted-fg"}`}> {plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-fg">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all ${
                    plan.highlighted
                      ? "bg-foreground text-background hover:opacity-90"
                      : "border border-card-border text-foreground hover:bg-muted"
                  }`}
                >
                  {plan.price === "Gratis" ? "Comenzar gratis" : "Seleccionar plan"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 sm:p-12 text-center">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              ¿Listo para empezar?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Únete a miles de freelancers y clientes que ya confían en FreelanceHub para sus proyectos. Es gratis crear tu cuenta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/marketplace"
                className="group relative inline-flex items-center gap-2 bg-white text-foreground font-semibold px-8 py-3 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span>Explorar servicios</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white font-semibold px-8 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all"
              >
                Crear cuenta gratis
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
