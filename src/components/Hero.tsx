"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, BarChart3, Briefcase, ShieldCheck, Sparkles, Star, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function Hero() {
  const [stats, setStats] = useState({ projects: "0+", freelancers: "0+", rating: "4.8", satisfaction: "98%" })
  const supabase = createClient()

  useEffect(() => {
    async function loadStats() {
      const [{ count: projects }, { count: freelancers }, { data: ratingData }] = await Promise.all([
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "completed"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "freelancer"),
        supabase.from("services").select("rating"),
      ])
      const avgRating = ratingData && ratingData.length > 0
        ? (ratingData.reduce((sum, s) => sum + s.rating, 0) / ratingData.length).toFixed(1)
        : "4.8"
      setStats({
        projects: `${projects ?? 0}+`,
        freelancers: `${freelancers ?? 0}+`,
        rating: avgRating,
        satisfaction: "98%",
      })
    }
    loadStats()
  }, [supabase])

  const statItems = [
    { value: stats.projects, label: "Proyectos completados", icon: Briefcase },
    { value: stats.freelancers, label: "Freelancers activos", icon: Users },
    { value: stats.rating, label: "Calificación promedio", icon: Star },
    { value: stats.satisfaction, label: "Clientes satisfechos", icon: ShieldCheck },
  ]

  return (
    <section className="relative isolate overflow-hidden bg-[#080710] text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/visuals/purple-desert.mp4"
        poster="/visuals/purple-desert.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,7,16,0.92)_0%,rgba(8,7,16,0.72)_44%,rgba(8,7,16,0.28)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,16,0.25)_0%,rgba(8,7,16,0.04)_45%,rgba(8,7,16,0.82)_100%)]" />
      <div className="absolute inset-0 opacity-[0.45] noise-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:64px_64px] opacity-25 [mask-image:linear-gradient(90deg,black,transparent_82%)]" />

      <div className="relative mx-auto flex min-h-[calc(88svh-4rem)] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/18 bg-white/20 px-3 py-2 text-sm text-white/78 animate-fade-in">
            <Sparkles className="h-4 w-4 text-cyan-200" strokeWidth={1.8} />
            Talento centroamericano listo para crear
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.96] tracking-normal sm:text-6xl lg:text-7xl animate-fade-in-up">
            FreelanceHub
            <span className="mt-3 block text-gradient">
              proyectos con pulso futuro
            </span>
          </h1>

          <p
            className="mt-6 max-w-2xl text-base leading-8 text-white/74 sm:text-xl animate-fade-in-up"
            style={{ animationDuration: "1s", animationDelay: "0.15s", opacity: 0, animationFillMode: "forwards" }}
          >
            Conecta con freelancers verificados, gestiona pedidos y descubre servicios digitales con una experiencia rápida, clara y diseñada para impresionar desde el primer click.
          </p>

          <div
            className="mt-8 flex flex-col gap-3 sm:flex-row animate-fade-in-up"
            style={{ animationDuration: "1s", animationDelay: "0.3s", opacity: 0, animationFillMode: "forwards" }}
          >
            <Link href="/marketplace" className="btn-primary px-7 py-3 text-sm sm:text-base">
              Explorar servicios
              <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/22 bg-white/20 px-7 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:border-white/36 hover:bg-white/30 sm:text-base"
            >
              Ver dashboard
              <BarChart3 className="h-4 w-4" strokeWidth={1.9} />
            </Link>
          </div>
        </div>

        <div
          className="mt-12 grid grid-cols-2 gap-3 border-t border-white/16 pt-6 sm:grid-cols-4 lg:mt-16 animate-fade-in-up"
          style={{ animationDuration: "1s", animationDelay: "0.45s", opacity: 0, animationFillMode: "forwards" }}
        >
          {statItems.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="rounded-lg border border-white/14 bg-white/20 p-4 transition-transform hover:-translate-y-1">
                <Icon className="mb-4 h-5 w-5 text-cyan-200" strokeWidth={1.8} />
                <div className="text-2xl font-black text-white sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-white/52">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
