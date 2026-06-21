export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  count: number
  description: string
}

export const categories: Category[] = [
  {
    id: "1", name: "Desarrollo Web", slug: "desarrollo-web", icon: "🌐", count: 24,
    description: "Sitios web, aplicaciones web, landing pages y plataformas personalizadas."
  },
  {
    id: "2", name: "Diseño Gráfico", slug: "diseno-grafico", icon: "🎨", count: 18,
    description: "Logotipos, branding, diseños para redes sociales y material impreso."
  },
  {
    id: "3", name: "Marketing Digital", slug: "marketing-digital", icon: "📊", count: 15,
    description: "SEO, redes sociales, email marketing y publicidad digital."
  },
  {
    id: "4", name: "Redacción y Traducción", slug: "redaccion-traduccion", icon: "✍️", count: 12,
    description: "Copywriting, traducción profesional, corrección de estilo y contenido."
  },
  {
    id: "5", name: "Video y Animación", slug: "video-animacion", icon: "🎬", count: 9,
    description: "Edición de video, animación 2D/3D, motion graphics y producción."
  },
  {
    id: "6", name: "Música y Audio", slug: "musica-audio", icon: "🎵", count: 7,
    description: "Producción musical, mezcla, masterización y diseño sonoro."
  },
  {
    id: "7", name: "Programación y Tech", slug: "programacion-tech", icon: "💻", count: 21,
    description: "APIs, automatización, ciencia de datos y consultoría tecnológica."
  },
  {
    id: "8", name: "Negocios", slug: "negocios", icon: "💼", count: 11,
    description: "Consultoría empresarial, planes de negocio y asesoría financiera."
  },
]
