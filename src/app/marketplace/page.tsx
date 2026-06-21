"use client"

import { useState, useMemo, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import ServiceCard from "@/components/ServiceCard"
import AnimatedSection from "@/components/AnimatedSection"
import type { Service, Category } from "@/types"

export default function MarketplacePage() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [ratingFilter, setRatingFilter] = useState("")
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const [servicesRes, categoriesRes] = await Promise.all([
        supabase.from("services").select("*, category:categories(*)").eq("active", true).order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name"),
      ])
      if (servicesRes.data) setServices(servicesRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
      setLoading(false)
    }
    load()
  }, [])

  const filteredServices = useMemo(() => {
    let result = [...services]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (selectedCategory) {
      result = result.filter((s) => s.category?.slug === selectedCategory)
    }

    if (priceMin) result = result.filter((s) => s.price >= parseInt(priceMin))
    if (priceMax) result = result.filter((s) => s.price <= parseInt(priceMax))
    if (ratingFilter) result = result.filter((s) => s.rating >= parseFloat(ratingFilter))

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break
      case "price-desc": result.sort((a, b) => b.price - a.price); break
      case "rating": result.sort((a, b) => b.rating - a.rating); break
      case "sales": result.sort((a, b) => b.sales - a.sales); break
    }

    return result
  }, [services, search, selectedCategory, sortBy, priceMin, priceMax, ratingFilter])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-64 bg-muted rounded-xl" />
          <div className="h-12 w-full bg-muted rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Marketplace</h1>
            <p className="mt-1 text-muted-fg">
              {filteredServices.length} servicios encontrados
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-2 sm:mt-0 inline-flex items-center gap-2 text-sm text-muted-fg hover:text-foreground border border-card-border px-3 py-2 rounded-xl hover:bg-accent transition-all"
          >
            <svg className={`w-4 h-4 transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showFilters ? "Ocultar filtros" : "Más filtros"}
          </button>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={100}>
        <div className="flex flex-col sm:flex-row gap-4 mb-4 mt-4">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-sm transition-all placeholder:text-muted-fg"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-sm transition-all"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.icon} {cat.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-sm transition-all"
          >
            <option value="">Ordenar por</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="rating">Mejor calificados</option>
            <option value="sales">Más vendidos</option>
          </select>
        </div>
      </AnimatedSection>

      <div className={`overflow-hidden transition-all duration-300 ${showFilters ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="flex flex-wrap gap-3 mb-6 p-4 rounded-2xl bg-muted border border-card-border">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-fg">Precio:</span>
            <input type="number" placeholder="Mín" value={priceMin} onChange={(e) => setPriceMin(e.target.value)}
              className="w-20 px-3 py-2 rounded-lg border border-card-border bg-background text-foreground focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-sm transition-all placeholder:text-muted-fg" />
            <span className="text-muted-fg">—</span>
            <input type="number" placeholder="Máx" value={priceMax} onChange={(e) => setPriceMax(e.target.value)}
              className="w-20 px-3 py-2 rounded-lg border border-card-border bg-background text-foreground focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-sm transition-all placeholder:text-muted-fg" />
          </div>

          <div className="w-px h-8 bg-card-border hidden sm:block self-center" />

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-fg">Calificación:</span>
            <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-card-border bg-background text-foreground focus:border-indigo-400 focus:outline-none text-sm transition-all">
              <option value="">Cualquiera</option>
              <option value="4.5">4.5+ estrellas</option>
              <option value="4">4+ estrellas</option>
              <option value="3.5">3.5+ estrellas</option>
            </select>
          </div>

          {(priceMin || priceMax || ratingFilter) && (
            <button onClick={() => { setPriceMin(""); setPriceMax(""); setRatingFilter("") }}
              className="text-sm text-muted-fg hover:text-indigo-600 underline transition-colors">
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="text-4xl mb-4 animate-bounce-in">🔍</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron servicios</h3>
          <p className="text-muted-fg">Intenta con otros términos de búsqueda o filtros.</p>
          <button onClick={() => { setSearch(""); setSelectedCategory(""); setPriceMin(""); setPriceMax(""); setRatingFilter("") }}
            className="mt-4 text-sm text-indigo-500 hover:text-indigo-600 underline transition-colors">
            Limpiar todos los filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, i) => (
            <AnimatedSection key={service.id} delay={i * 60}>
              <ServiceCard service={service} />
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  )
}
