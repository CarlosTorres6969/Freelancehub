import type { MetadataRoute } from "next"
import { getPool } from "@/lib/db"
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
    const pool = await getPool()
    const [servicesResult,categoriesResult,freelancersResult] = await Promise.all([
      pool.request().query(`SELECT TOP(1000) id,created_at FROM dbo.services WHERE active=1`),
      pool.request().query(`SELECT slug FROM dbo.categories`),
      pool.request().query(`SELECT TOP(1000) id FROM dbo.profiles WHERE role='freelancer'`),
    ])
    const services=servicesResult.recordset,categories=categoriesResult.recordset,freelancers=freelancersResult.recordset

    const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
      url: `${SITE_URL}/services/${s.id}`,
      lastModified: s.created_at ? new Date(s.created_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }))

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${SITE_URL}/categories/${c.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }))

    const freelancerRoutes: MetadataRoute.Sitemap = freelancers.map((f) => ({
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
