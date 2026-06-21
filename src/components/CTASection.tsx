"use client"

import Link from "next/link"
import { useState } from "react"
import AnimatedSection from "./AnimatedSection"

const faqs = [
  {
    q: "¿Cómo funciona FreelanceHub?",
    a: "FreelanceHub conecta a freelancers con clientes que necesitan servicios profesionales. Los clientes pueden explorar servicios, contactar freelancers y contratar de forma segura a través de nuestra plataforma.",
  },
  {
    q: "¿Es seguro pagar a través de la plataforma?",
    a: "Sí, todos los pagos se procesan de forma segura. Retenemos el pago hasta que el cliente confirme que el trabajo está completo, protegiendo a ambas partes.",
  },
  {
    q: "¿Cómo me registro como freelancer?",
    a: "Regístrate gratis, completa tu perfil con tus habilidades y experiencia, y comienza a publicar servicios. Revisamos cada perfil para garantizar la calidad de nuestra comunidad.",
  },
  {
    q: "¿Qué tipos de servicios puedo encontrar?",
    a: "Ofrecemos servicios en Desarrollo Web, Diseño Gráfico, Marketing Digital, Redacción, Video, Programación, Música y Negocios. Hay más de 100 servicios disponibles.",
  },
  {
    q: "¿Hay garantía de satisfacción?",
    a: "Sí, si el trabajo entregado no cumple con lo acordado, puedes solicitar revisiones gratuitas. Si no se llega a una solución, nuestro equipo de soporte interviene.",
  },
  {
    q: "¿Puedo contactar al freelancer antes de contratar?",
    a: "Sí, cada servicio tiene un chat integrado donde puedes hacer preguntas al freelancer antes de realizar el pago. Es la mejor forma de asegurarte de que es la persona adecuada.",
  },
]

const stats = [
  { value: "500+", label: "Proyectos Completados" },
  { value: "200+", label: "Freelancers Activos" },
  { value: "4.8", label: "Calificación Promedio" },
  { value: "98%", label: "Clientes Satisfechos" },
  { value: "6", label: "Países Centroamericanos" },
  { value: "24/7", label: "Soporte al Cliente" },
]

export default function CTASection() {
  const [openFaq, setOpenFaq] = useState<string | null>(null)

  return (
    <>
      <section className="py-20 bg-muted/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-50 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center group">
                  <div className="text-3xl font-bold text-foreground group-hover:text-gradient transition-all duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-fg mt-1 group-hover:text-foreground transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <div className="relative bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl p-8 sm:p-12 text-white text-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl animate-float" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl animate-float" style={{ animationDelay: "3s" }} />

              <h2 className="text-3xl sm:text-4xl font-bold relative z-10">¿Listo para empezar tu proyecto?</h2>
              <p className="text-muted-fg text-lg mb-8 max-w-2xl mx-auto relative z-10 mt-4">
                Únete a miles de profesionales que ya encontraron el talento perfecto en FreelanceHub.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <Link
                  href="/marketplace"
                  className="group relative inline-flex items-center gap-2 bg-white text-foreground font-semibold px-8 py-3 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 group-hover:text-white transition-colors">Explorar Servicios</span>
                </Link>
                <Link
                  href="/how-it-works"
                  className="group inline-flex items-center gap-2 border border-zinc-600 text-muted-fg font-semibold px-8 py-3 rounded-xl hover:bg-zinc-800 hover:border-zinc-500 transition-all duration-300 hover:scale-105"
                >
                  Cómo Funciona
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 bg-muted/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-50 via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Preguntas Frecuentes</h2>
              <p className="mt-4 text-lg text-muted-fg">Todo lo que necesitas saber sobre FreelanceHub.</p>
            </div>
          </AnimatedSection>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <AnimatedSection key={faq.q} delay={i * 80}>
                <div className="bg-card-bg rounded-2xl border border-card-border overflow-hidden hover:border-card-border hover:shadow-md transition-all duration-300">
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.q ? null : faq.q)}
                    className="w-full flex items-center justify-between p-5 text-left group"
                  >
                    <span className="font-medium text-foreground pr-4 group-hover:text-indigo-600 transition-colors">{faq.q}</span>
                    <svg
                      className={`w-5 h-5 text-muted-fg shrink-0 transition-all duration-300 ${openFaq === faq.q ? "rotate-180 text-indigo-500" : "group-hover:text-indigo-400"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === faq.q && (
                    <div className="px-5 pb-5 text-sm text-muted-fg leading-relaxed animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl animate-float" style={{ animationDuration: "15s" }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl animate-float" style={{ animationDuration: "12s", animationDelay: "4s" }} />

        <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Mantente informado</h2>
            <p className="text-muted-fg mb-8">
              Recibe las mejores ofertas y novedades directamente en tu correo.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="tu@correo.com"
                className="flex-1 px-5 py-3 rounded-xl text-foreground focus:outline-none text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button
                type="submit"
                className="group relative bg-white text-foreground font-semibold px-6 py-3 rounded-xl hover:bg-muted transition-all text-sm overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 group-hover:text-white transition-colors">Suscribirme</span>
              </button>
            </form>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
