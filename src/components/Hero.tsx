"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import FloatingParticles3D from "./HeroParticles"

export default function Hero() {
  const [stats, setStats] = useState({ projects: "—", freelancers: "—", rating: "—", satisfaction: "98%" })
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
  }, [])

  return (
    <section className="relative overflow-hidden bg-foreground text-background" style={{ perspective: "1200px" }}>
      <div
        className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-indigo-950/30 to-zinc-900"
        style={{ backgroundSize: "200% 200%", animation: "gradient-shift 8s ease infinite" }}
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/15 via-transparent to-transparent"
      />

      <FloatingParticles3D />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative">
        <div className="max-w-3xl">
          <div
            className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-1.5 text-sm text-white/70 mb-6 animate-fade-in"
            style={{ animationDuration: "0.8s" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Talento Centroamericano en un solo lugar
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight animate-fade-in-up" style={{ animationDuration: "1s" }}>
            Encuentra el talento
            <span className="block text-gradient mt-2">
              que tu proyecto necesita
            </span>
          </h1>

          <p
            className="mt-6 text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed animate-fade-in-up"
            style={{ animationDuration: "1s", animationDelay: "0.2s", opacity: 0, animationFillMode: "forwards" }}
          >
            Conectamos a las mejores freelancers de Centroamérica con proyectos innovadores.
            Desde desarrollo web hasta marketing digital, encuentra el profesional ideal para tu próximo proyecto.
          </p>

          <div
            className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in-up"
            style={{ animationDuration: "1s", animationDelay: "0.4s", opacity: 0, animationFillMode: "forwards" }}
          >
            <Link
              href="/marketplace"
              className="group relative inline-flex items-center justify-center gap-2 bg-white text-foreground font-semibold px-8 py-3 rounded-xl overflow-hidden transition-all duration-150 hover:scale-105"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
              <span className="relative z-10 group-hover:text-white transition-colors duration-150 flex items-center gap-2">
                Explorar Servicios
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-2 border border-white/20 text-white/70 font-semibold px-8 py-3 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-150"
            >
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Ver Dashboard
            </Link>
          </div>
        </div>

        <div
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/20 pt-12 animate-fade-in-up"
          style={{ animationDuration: "1s", animationDelay: "0.6s", opacity: 0, animationFillMode: "forwards" }}
        >
          {[
            { value: stats.projects, label: "Proyectos Completados" },
            { value: stats.freelancers, label: "Freelancers Activos" },
            { value: stats.rating, label: "Calificación Promedio" },
            { value: stats.satisfaction, label: "Clientes Satisfechos" },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-3xl sm:text-4xl font-bold text-white group-hover:text-gradient transition-all duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-white/50 mt-1 group-hover:text-white/70 transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
