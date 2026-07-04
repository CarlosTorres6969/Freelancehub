"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, ChevronDown, Mail } from "lucide-react"
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
      <section className="border-y border-card-border bg-background/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {stats.map((stat) => (
                <div key={stat.label} className="panel-line pb-5 text-center">
                  <div className="text-3xl font-black text-gradient">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-fg">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="mesh-surface py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-lg border border-white/15 bg-[#080710] p-8 text-center text-white shadow-strong sm:p-12">
              <img
                src="/visuals/purple-desert.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-[0.42]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,7,16,0.90),rgba(8,7,16,0.68),rgba(8,7,16,0.90))]" />
              <div className="absolute inset-0 noise-overlay opacity-50" />
              <div className="relative z-10 mx-auto max-w-3xl">
                <span className="inline-flex rounded-lg border border-white/18 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white/74 backdrop-blur-xl">
                  Nuevo proyecto, mejor equipo
                </span>
                <h2 className="mt-5 text-3xl font-black sm:text-4xl">¿Listo para empezar?</h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/72">
                  Únete a profesionales que ya encuentran talento confiable, pagos seguros y entregas claras en FreelanceHub.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link href="/marketplace" className="btn-primary px-8 py-3">
                    Explorar servicios
                    <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="inline-flex items-center justify-center rounded-lg border border-white/22 bg-white/10 px-8 py-3 font-bold text-white backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/16"
                  >
                    Cómo funciona
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-background/70 py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-12 text-center">
              <span className="chip inline-flex rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
                Respuestas rápidas
              </span>
              <h2 className="mt-4 text-3xl font-black text-foreground sm:text-4xl">Preguntas frecuentes</h2>
              <p className="mt-4 text-lg leading-8 text-muted-fg">Todo lo que necesitas saber antes de contratar o publicar servicios.</p>
            </div>
          </AnimatedSection>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <AnimatedSection key={faq.q} delay={i * 80}>
                <div className="neo-card rounded-lg">
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.q ? null : faq.q)}
                    className="flex w-full items-center justify-between p-5 text-left group"
                  >
                    <span className="pr-4 font-bold text-foreground transition-colors group-hover:text-violet-500">{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-muted-fg transition-transform duration-300 ${openFaq === faq.q ? "rotate-180 text-violet-500" : "group-hover:text-violet-400"}`}
                      strokeWidth={1.9}
                    />
                  </button>
                  {openFaq === faq.q && (
                    <div className="px-5 pb-5 text-sm leading-7 text-muted-fg animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-card-border bg-foreground py-20 text-background">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <AnimatedSection>
            <Mail className="mx-auto mb-4 h-8 w-8 text-cyan-300" strokeWidth={1.6} />
            <h2 className="text-3xl font-black sm:text-4xl">Mantente informado</h2>
            <p className="mt-4 mb-8 text-background/70">
              Recibe ofertas, novedades y señales del marketplace directamente en tu correo.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                placeholder="tu@correo.com"
                className="input-future flex-1 rounded-lg px-5 py-3 text-sm text-foreground placeholder:text-muted-fg"
              />
              <button
                type="submit"
                className="btn-primary px-6 py-3 text-sm"
              >
                Suscribirme
              </button>
            </form>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
