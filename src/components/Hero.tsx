"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, BarChart3, CheckCircle2, RadioTower, Search, ShieldCheck, Sparkles, Zap } from "lucide-react"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"

const fallbackStats = {
  projects: "500+",
  freelancers: "200+",
  rating: "4.8",
  satisfaction: "98%",
}

export default function Hero() {
  const [stats, setStats] = useState(fallbackStats)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    async function loadStats() {
      const supabase = createClient()

      try {
        const [{ count: projects }, { count: freelancers }, { data: ratingData }] = await Promise.all([
          supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "completed"),
          supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "freelancer"),
          supabase.from("services").select("rating"),
        ])
        const avgRating = ratingData && ratingData.length > 0
          ? (ratingData.reduce((sum, s) => sum + Number(s.rating ?? 0), 0) / ratingData.length).toFixed(1)
          : fallbackStats.rating

        setStats({
          projects: `${projects ?? 0}+`,
          freelancers: `${freelancers ?? 0}+`,
          rating: avgRating,
          satisfaction: fallbackStats.satisfaction,
        })
      } catch {
        setStats(fallbackStats)
      }
    }

    loadStats()
  }, [])

  const statItems = [
    { value: stats.projects, label: "Proyectos completados" },
    { value: stats.freelancers, label: "Freelancers activos" },
    { value: stats.rating, label: "Calificación promedio" },
    { value: stats.satisfaction, label: "Clientes satisfechos" },
  ]

  return (
    <section className="relative isolate overflow-hidden bg-[#080913] text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/media/purple-desert.jpg"
        aria-hidden="true"
      >
        <source src="/media/purple-desert.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,19,0.92)_0%,rgba(7,9,19,0.68)_42%,rgba(7,9,19,0.32)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,19,0.08)_0%,rgba(7,9,19,0.42)_72%,rgba(7,9,19,0.94)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(124,58,237,0.18),transparent_34%),radial-gradient(circle_at_24%_72%,rgba(34,211,238,0.08),transparent_30%)]" />
      <div className="scan-line opacity-60" />
      <div className="absolute bottom-10 left-1/2 h-px w-[120vw] -translate-x-1/2 horizon-panel opacity-70" />

      <div className="relative mx-auto flex min-h-[calc(100svh-7rem)] max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-xl animate-fade-in">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
            Talento verificado para equipos que se mueven rápido
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.94] tracking-normal text-white sm:text-6xl lg:text-8xl animate-fade-in-up">
            FreelanceHub
            <span className="mt-3 block text-gradient">
              talento freelance en modo futuro.
            </span>
          </h1>

          <p
            className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-xl animate-fade-in-up"
            style={{ animationDelay: "0.15s", animationFillMode: "both" }}
          >
            Conecta proyectos ambiciosos con freelancers de Centroamérica en una experiencia rápida,
            visual y segura, diseñada para descubrir, contratar y avanzar sin fricción.
          </p>

          <div
            className="mt-8 flex flex-col gap-3 sm:flex-row animate-fade-in-up"
            style={{ animationDelay: "0.28s", animationFillMode: "both" }}
          >
            <Link
              href="/marketplace"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-[#11131c] shadow-2xl shadow-violet-950/30 transition-transform hover:scale-[1.02]"
            >
              <Search className="h-4 w-4" strokeWidth={2} />
              Explorar servicios
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
            </Link>
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-xl transition-colors hover:bg-white/15"
            >
              <BarChart3 className="h-4 w-4" strokeWidth={2} />
              Ver dashboard
            </Link>
          </div>

          <div
            className="mt-10 grid max-w-3xl grid-cols-1 gap-3 text-sm text-white/80 sm:grid-cols-3 animate-fade-in-up"
            style={{ animationDelay: "0.42s", animationFillMode: "both" }}
          >
            {[
              { icon: ShieldCheck, label: "Pagos protegidos" },
              { icon: RadioTower, label: "Mensajes en tiempo real" },
              { icon: Zap, label: "Match de talento ágil" },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">
                  <Icon className="h-4 w-4 text-cyan-200" strokeWidth={1.8} />
                  {item.label}
                </div>
              )
            })}
          </div>
        </div>

        <div
          className="mt-12 grid gap-3 border-t border-white/15 pt-6 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up"
          style={{ animationDelay: "0.56s", animationFillMode: "both" }}
        >
          {statItems.map((stat) => (
            <div key={stat.label} className="group rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur-xl transition-colors hover:bg-white/15">
              <div className="flex items-center justify-between gap-3">
                <div className="text-3xl font-black tracking-normal text-white sm:text-4xl">{stat.value}</div>
                <CheckCircle2 className="h-5 w-5 text-emerald-300 opacity-80 transition-transform group-hover:scale-110" strokeWidth={1.8} />
              </div>
              <div className="mt-1 text-sm font-medium text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-white/45">
          <Sparkles className="h-4 w-4 text-cyan-200" strokeWidth={1.8} />
          Red regional activa
        </div>
      </div>
    </section>
  )
}
