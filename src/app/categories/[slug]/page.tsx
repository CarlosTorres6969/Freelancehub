import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import ServiceCard from "@/components/ServiceCard"

export const revalidate = 60

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!category) notFound()

  const { data: categoryServices } = await supabase
    .from("services")
    .select("*, category:categories(*)")
    .eq("category_id", category.id)
    .eq("active", true)
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1 text-sm text-muted-fg hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al Marketplace
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-2">
        <span className="text-5xl">{category.icon}</span>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{category.name}</h1>
          <p className="text-muted-fg mt-1">{category.description}</p>
        </div>
      </div>

      <p className="text-sm text-muted-fg mb-8">
        {categoryServices?.length ?? 0} servicios disponibles en esta categoría
      </p>

      {!categoryServices || categoryServices.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No hay servicios aún</h3>
          <p className="text-muted-fg">Esta categoría no tiene servicios publicados actualmente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  )
}
