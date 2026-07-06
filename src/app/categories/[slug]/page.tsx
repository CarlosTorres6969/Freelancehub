import { notFound } from "next/navigation"
import Link from "next/link"
import { FolderOpen } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import ServiceCard from "@/components/ServiceCard"
import type { Metadata } from "next"

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: category } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .single()

  if (!category) return { title: "Categoría no encontrada" }

  return {
    title: category.name,
    description: category.description?.slice(0, 160),
    openGraph: { title: category.name, description: category.description?.slice(0, 160), type: "website" },
  }
}

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
    <div className="page-shell">
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

      <div className="neo-card mb-6 flex items-center gap-4 rounded-lg p-6">
        <span className="grid h-16 w-16 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-3xl text-white shadow-lg shadow-violet-500/20">{category.icon}</span>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground">{category.name}</h1>
          <p className="text-muted-fg mt-1">{category.description}</p>
        </div>
      </div>

      <p className="text-sm text-muted-fg mb-8">
        {categoryServices?.length ?? 0} servicios disponibles en esta categoría
      </p>

      {!categoryServices || categoryServices.length === 0 ? (
        <div className="neo-card rounded-lg py-20 text-center">
          <FolderOpen className="mx-auto mb-4 h-12 w-12 text-muted-fg" strokeWidth={1.5} />
          <h3 className="text-lg font-bold text-foreground mb-2">No hay servicios aún</h3>
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
