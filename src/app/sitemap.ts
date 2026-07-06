import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"
import { SITE_URL } from "@/lib/site"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/marketplace",
    "/how-it-works",
    "/contact",
    "/terms",
    "/privacy",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }))

  try {
    const supabase = await createClient()
    const [{ data: services }, { data: categories }, { data: freelancers }] = await Promise.all([
      supabase.from("services").select("id, created_at").eq("active", true).limit(1000),
      supabase.from("categories").select("slug"),
      supabase.from("profiles").select("id").eq("role", "freelancer").limit(1000),
    ])

    const serviceRoutes: MetadataRoute.Sitemap = (services ?? []).map((s) => ({
      url: `${SITE_URL}/services/${s.id}`,
      lastModified: s.created_at ? new Date(s.created_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }))

    const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
      url: `${SITE_URL}/categories/${c.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }))

    const freelancerRoutes: MetadataRoute.Sitemap = (freelancers ?? []).map((f) => ({
      url: `${SITE_URL}/freelancers/${f.id}`,
      changeFrequency: "weekly",
      priority: 0.5,
    }))

    return [...staticRoutes, ...serviceRoutes, ...categoryRoutes, ...freelancerRoutes]
  } catch {
    // Si la base de datos no está disponible al generar, al menos las rutas estáticas.
    return staticRoutes
  }
}
