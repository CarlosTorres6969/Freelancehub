"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, SlidersHorizontal, Sparkles, X } from "lucide-react"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { demoCategories, demoServices } from "@/lib/demo-data"
import ServiceCard from "@/components/ServiceCard"
import AnimatedSection from "@/components/AnimatedSection"
import type { Category, Service } from "@/types"

export default function MarketplacePage() {
  const [services, setServices] = useState<Service[]>(demoServices)
  const [categories, setCategories] = useState<Category[]>(demoCategories)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [ratingFilter, setRatingFilter] = useState("")
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    async function load() {
      const supabase = createClient()

      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          supabase.from("services").select("*, category:categories(*)").eq("active", true).order("created_at", { ascending: false }),
          supabase.from("categories").select("*").order("name"),
        ])
        if (servicesRes.data?.length) setServices(servicesRes.data)
        if (categoriesRes.data?.length) setCategories(categoriesRes.data)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const filteredServices = useMemo(() => {
    const result = services.filter((service) => {
      const q = search.toLowerCase()
      const matchesSearch = !q ||
        service.title.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q) ||
        service.tags.some((tag) => tag.toLowerCase().includes(q))

      const matchesCategory = !selectedCategory || service.category?.slug === selectedCategory
      const matchesMin = !priceMin || service.price >= Number(priceMin)
      const matchesMax = !priceMax || service.price <= Number(priceMax)
      const matchesRating = !ratingFilter || service.rating >= Number(ratingFilter)

      return matchesSearch && matchesCategory && matchesMin && matchesMax && matchesRating
    })

    switch (sortBy) {
      case "price-asc":
        return [...result].sort((a, b) => a.price - b.price)
      case "price-desc":
        return [...result].sort((a, b) => b.price - a.price)
      case "rating":
        return [...result].sort((a, b) => b.rating - a.rating)
      case "sales":
        return [...result].sort((a, b) => b.sales - a.sales)
      default:
        return result
    }
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
      <div className="relative min-h-screen overflow-hidden bg-background">
        <div className="absolute inset-0 surface-grid opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 w-72 rounded-lg bg-muted" />
            <div className="h-14 w-full rounded-lg bg-muted" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 rounded-lg bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 surface-grid opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent_68%)]" />
      <div className="absolute inset-x-0 top-0 tech-line opacity-70" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <AnimatedSection>
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">
                <Sparkles className="h-4 w-4" strokeWidth={1.8} />
                Marketplace
              </p>
              <h1 className="text-4xl font-black tracking-normal text-foreground sm:text-6xl">Talento listo para activar.</h1>
              <p className="mt-3 text-muted-fg">
                {filteredServices.length} servicios encontrados
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-card-border bg-card-bg/80 px-4 py-3 text-sm font-bold text-muted-fg backdrop-blur transition-colors hover:text-foreground"
            >
              <SlidersHorizontal className={`h-4 w-4 transition-transform ${showFilters ? "rotate-90" : ""}`} strokeWidth={1.8} />
              {showFilters ? "Ocultar filtros" : "Más filtros"}
            </button>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_220px_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-fg" strokeWidth={1.8} />
              <input
                type="text"
                placeholder="Buscar servicios..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-card-border bg-card-bg/80 py-3 pl-10 pr-4 text-sm text-foreground outline-none backdrop-blur transition-all placeholder:text-muted-fg focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-card-border bg-card-bg/80 px-4 py-3 text-sm text-foreground outline-none backdrop-blur transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-card-border bg-card-bg/80 px-4 py-3 text-sm text-foreground outline-none backdrop-blur transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Ordenar por</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="rating">Mejor calificados</option>
              <option value="sales">Más vendidos</option>
            </select>
          </div>
        </AnimatedSection>

        <div className={`overflow-hidden transition-all duration-300 ${showFilters ? "mb-8 max-h-72 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="flex flex-wrap gap-3 rounded-lg border border-card-border bg-card-bg/80 p-4 backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-muted-fg">Precio</span>
              <input
                type="number"
                placeholder="Mín"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-24 rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all placeholder:text-muted-fg focus:border-primary"
              />
              <span className="text-muted-fg">a</span>
              <input
                type="number"
                placeholder="Máx"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-24 rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all placeholder:text-muted-fg focus:border-primary"
              />
            </div>

            <div className="hidden h-8 w-px self-center bg-card-border sm:block" />

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-muted-fg">Calificación</span>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary"
              >
                <option value="">Cualquiera</option>
                <option value="4.5">4.5+ estrellas</option>
                <option value="4">4+ estrellas</option>
                <option value="3.5">3.5+ estrellas</option>
              </select>
            </div>

            {(search || selectedCategory || priceMin || priceMax || ratingFilter || sortBy) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-muted-fg transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="rounded-lg border border-card-border bg-card-bg/80 px-6 py-20 text-center backdrop-blur-xl animate-fade-in">
            <Search className="mx-auto mb-4 h-10 w-10 text-muted-fg" strokeWidth={1.7} />
            <h3 className="mb-2 text-lg font-bold text-foreground">No se encontraron servicios</h3>
            <p className="text-muted-fg">Intenta con otros términos de búsqueda o filtros.</p>
            <button onClick={clearFilters} className="mt-4 text-sm font-bold text-primary hover:text-secondary">
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
    </div>
  )
}
