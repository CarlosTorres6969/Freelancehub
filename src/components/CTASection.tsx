"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, CheckCircle2, ChevronDown, Mail, Radar, Sparkles } from "lucide-react"
import AnimatedSection from "./AnimatedSection"

const faqs = [
  {
    q: "¿Cómo funciona FreelanceHub?",
    a: "Exploras servicios, revisas perfiles, conversas con freelancers y contratas desde la plataforma con un flujo pensado para avanzar rápido.",
  },
  {
    q: "¿Es seguro pagar a través de la plataforma?",
    a: "Sí. El proceso protege a ambas partes y ayuda a liberar pagos cuando la entrega cumple lo acordado.",
  },
  {
    q: "¿Puedo contactar al freelancer antes de contratar?",
    a: "Sí. Puedes resolver dudas, alinear alcance y validar tiempos antes de iniciar el proyecto.",
  },
  {
    q: "¿Qué tipos de servicios puedo encontrar?",
    a: "Desarrollo web, diseño, marketing, redacción, video, programación, música, consultoría y más especialidades digitales.",
  },
]

const stats = [
  { value: "500+", label: "Proyectos completados" },
  { value: "200+", label: "Freelancers activos" },
  { value: "4.8", label: "Calificación promedio" },
  { value: "98%", label: "Clientes satisfechos" },
  { value: "6", label: "Países conectados" },
  { value: "24/7", label: "Operación activa" },
]

export default function CTASection() {
  const [openFaq, setOpenFaq] = useState<string | null>(null)

  return (
    <>
      <section className="relative overflow-hidden bg-muted/60 py-16">
        <div className="absolute inset-0 surface-grid opacity-35" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-card-border bg-card-bg/80 p-4 text-center backdrop-blur transition-colors hover:border-primary/40">
                  <div className="text-3xl font-black tracking-normal text-foreground">{stat.value}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-fg">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative overflow-hidden bg-background py-20 sm:py-28">
        <div className="absolute inset-x-0 top-0 tech-line opacity-70" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-lg border border-white/15 bg-[#080913] p-8 text-white shadow-2xl shadow-black/20 sm:p-12">
              <div className="absolute inset-0 surface-grid opacity-25" />
              <div className="scan-line opacity-40" />
              <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div>
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 backdrop-blur">
                    <Sparkles className="h-4 w-4 text-cyan-200" strokeWidth={1.8} />
                    Próximo proyecto listo para despegar
                  </div>
                  <h2 className="max-w-3xl text-3xl font-black tracking-normal sm:text-5xl">
                    Convierte una idea en un equipo freelance listo para ejecutar.
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                    Reúne especialistas, compara propuestas y mantén el avance visible desde el primer contacto.
                  </p>
                </div>

                <div className="grid gap-3">
                  {["Perfiles verificados", "Mensajes directos", "Dashboard de seguimiento"].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white/80 backdrop-blur">
                      <CheckCircle2 className="h-5 w-5 text-emerald-300" strokeWidth={1.8} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/marketplace"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-[#11131c] transition-transform hover:scale-[1.02]"
                >
                  Explorar servicios
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  <Radar className="h-4 w-4" strokeWidth={1.8} />
                  Ver el proceso
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative overflow-hidden bg-muted/60 py-20 sm:py-28">
        <div className="absolute inset-0 surface-grid opacity-30" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-primary">Respuestas rápidas</p>
              <h2 className="text-3xl font-black tracking-normal text-foreground sm:text-5xl">Preguntas frecuentes</h2>
            </div>
          </AnimatedSection>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <AnimatedSection key={faq.q} delay={i * 70}>
                <div className="overflow-hidden rounded-lg border border-card-border bg-card-bg/80 backdrop-blur-xl transition-colors hover:border-primary/40">
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.q ? null : faq.q)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="font-bold text-foreground">{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-muted-fg transition-transform ${openFaq === faq.q ? "rotate-180 text-primary" : ""}`}
                      strokeWidth={1.8}
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

      <section className="relative overflow-hidden bg-foreground py-20 text-background">
        <div className="absolute inset-0 surface-grid opacity-10" />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-background/10 text-background">
              <Mail className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <h2 className="text-3xl font-black tracking-normal sm:text-4xl">Mantente en la señal.</h2>
            <p className="mt-4 text-sm leading-7 text-background/70 sm:text-base">
              Recibe oportunidades, talento destacado y novedades de FreelanceHub directamente en tu correo.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                placeholder="tu@correo.com"
                className="min-w-0 flex-1 rounded-lg border border-background/20 bg-background px-5 py-3 text-sm text-foreground outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/30"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-bold text-secondary-fg transition-transform hover:scale-[1.02]"
              >
                Suscribirme
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </form>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
