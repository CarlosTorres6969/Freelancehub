"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, SearchX, SlidersHorizontal, XCircle } from "lucide-react"
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
    const params = new URLSearchParams(window.location.search)
    const categoryFromUrl = params.get("category")
    if (categoryFromUrl) setSelectedCategory(categoryFromUrl)
  }, [])

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
  }, [supabase])

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

  function clearFilters() {
    setSearch("")
    setSelectedCategory("")
    setPriceMin("")
    setPriceMax("")
    setRatingFilter("")
    setSortBy("")
  }

  if (loading) {
    return (
      <div className="page-shell">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-64 rounded-lg bg-muted" />
          <div className="h-16 w-full rounded-lg bg-muted" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <AnimatedSection>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="chip inline-flex rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
              Marketplace
            </span>
            <h1 className="mt-3 text-4xl font-black tracking-normal text-foreground sm:text-5xl">Servicios digitales</h1>
            <p className="mt-2 text-muted-fg">
              {filteredServices.length} servicios encontrados
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary px-4 py-2 text-sm"
          >
            <SlidersHorizontal className={`h-4 w-4 transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`} strokeWidth={1.8} />
            {showFilters ? "Ocultar filtros" : "Más filtros"}
          </button>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={100}>
        <div className="neo-card mb-4 rounded-lg p-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-fg" strokeWidth={1.7} />
              <input
                type="text"
                placeholder="Buscar servicios..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-future w-full rounded-lg py-3 pl-10 pr-4 text-sm placeholder:text-muted-fg"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-future rounded-lg px-4 py-3 text-sm"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.icon} {cat.name}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-future rounded-lg px-4 py-3 text-sm"
            >
              <option value="">Ordenar por</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="rating">Mejor calificados</option>
              <option value="sales">Más vendidos</option>
            </select>
          </div>
        </div>
      </AnimatedSection>

      <div className={`overflow-hidden transition-all duration-300 ${showFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="neo-card mb-6 flex flex-wrap gap-3 rounded-lg p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-fg">Precio</span>
            <input
              type="number"
              placeholder="Mín"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="input-future w-24 rounded-lg px-3 py-2 text-sm placeholder:text-muted-fg"
            />
            <span className="text-muted-fg">-</span>
            <input
              type="number"
              placeholder="Máx"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="input-future w-24 rounded-lg px-3 py-2 text-sm placeholder:text-muted-fg"
            />
          </div>

          <div className="hidden h-8 w-px self-center bg-card-border sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-fg">Calificación</span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="input-future rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Cualquiera</option>
              <option value="4.5">4.5+ estrellas</option>
              <option value="4">4+ estrellas</option>
              <option value="3.5">3.5+ estrellas</option>
            </select>
          </div>

          {(priceMin || priceMax || ratingFilter || search || selectedCategory || sortBy) && (
            <button onClick={clearFilters} className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-300">
              <XCircle className="h-4 w-4" strokeWidth={1.8} />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="neo-card rounded-lg py-20 text-center animate-fade-in">
          <SearchX className="mx-auto mb-4 h-12 w-12 text-muted-fg" strokeWidth={1.5} />
          <h3 className="mb-2 text-lg font-bold text-foreground">No se encontraron servicios</h3>
          <p className="text-muted-fg">Intenta con otros términos de búsqueda o filtros.</p>
          <button onClick={clearFilters} className="mt-5 text-sm font-semibold text-violet-600 underline transition-colors hover:text-violet-700 dark:text-violet-300">
            Limpiar todos los filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
