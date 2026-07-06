// URL pública del sitio, usada para metadata absoluta, sitemap y robots.
// Configúrala en producción con NEXT_PUBLIC_SITE_URL.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000"
