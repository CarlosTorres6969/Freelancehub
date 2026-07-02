import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Briefcase } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getDemoCategoryBySlug, getDemoServicesByCategory } from "@/lib/demo-data"
import ServiceCard from "@/components/ServiceCard"
import type { Category, Service } from "@/types"

export const revalidate = 60

const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let category: Category | null = getDemoCategoryBySlug(slug)
  let categoryServices: Service[] = category ? getDemoServicesByCategory(category.id) : []

  if (hasSupabaseConfig) {
    const supabase = await createClient()

    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()

    if (data) {
      category = data as Category
      const { data: services } = await supabase
        .from("services")
        .select("*, category:categories(*)")
        .eq("category_id", category.id)
        .eq("active", true)
        .order("created_at", { ascending: false })

      categoryServices = (services ?? []) as Service[]
    }
  }

  if (!category) notFound()

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 surface-grid opacity-15 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 tech-line opacity-70" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-6">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 rounded-lg border border-card-border bg-card-bg/80 px-3 py-2 text-sm font-bold text-muted-fg backdrop-blur transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            Volver al Marketplace
          </Link>
        </div>

        <section className="mb-8 rounded-lg border border-card-border bg-card-bg/80 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-rose-400 text-white shadow-lg shadow-black/10">
              <Briefcase className="h-7 w-7" strokeWidth={1.7} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-normal text-foreground sm:text-5xl">{category.name}</h1>
              <p className="mt-2 text-muted-fg">{category.description}</p>
            </div>
          </div>
          <p className="mt-5 text-sm font-semibold text-muted-fg">
            {categoryServices.length} servicios disponibles en esta categoría
          </p>
        </section>

        {categoryServices.length === 0 ? (
          <div className="rounded-lg border border-card-border bg-card-bg/80 px-6 py-20 text-center backdrop-blur-xl">
            <Briefcase className="mx-auto mb-4 h-10 w-10 text-muted-fg" strokeWidth={1.7} />
            <h3 className="mb-2 text-lg font-bold text-foreground">No hay servicios aún</h3>
            <p className="text-muted-fg">Esta categoría no tiene servicios publicados actualmente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
