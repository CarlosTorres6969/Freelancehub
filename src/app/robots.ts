import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Rutas privadas o sin valor para indexación.
      disallow: ["/dashboard", "/admin", "/checkout", "/messages", "/favorites", "/profile"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
