import type { Category, Profile, Review, Service, Testimonial } from "@/types"

export const demoCategories: Category[] = [
  { id: "cat-web", name: "Desarrollo Web", slug: "desarrollo-web", icon: "code", description: "Sitios, plataformas y experiencias web de alto rendimiento.", services_count: 34, created_at: "2026-01-01T00:00:00.000Z" },
  { id: "cat-design", name: "Diseño Gráfico", slug: "diseno-grafico", icon: "palette", description: "Identidad visual, piezas digitales y dirección de arte.", services_count: 28, created_at: "2026-01-01T00:00:00.000Z" },
  { id: "cat-marketing", name: "Marketing Digital", slug: "marketing-digital", icon: "trending-up", description: "Campañas, contenido y estrategias de crecimiento.", services_count: 22, created_at: "2026-01-01T00:00:00.000Z" },
  { id: "cat-writing", name: "Redacción y Traducción", slug: "redaccion", icon: "pen", description: "Copywriting, contenido editorial y traducciones.", services_count: 18, created_at: "2026-01-01T00:00:00.000Z" },
  { id: "cat-video", name: "Video y Animación", slug: "video-animacion", icon: "video", description: "Edición, motion graphics y contenido audiovisual.", services_count: 16, created_at: "2026-01-01T00:00:00.000Z" },
  { id: "cat-audio", name: "Música y Audio", slug: "musica-audio", icon: "music", description: "Producción musical, voz y diseño sonoro.", services_count: 12, created_at: "2026-01-01T00:00:00.000Z" },
  { id: "cat-tech", name: "Programación y Tech", slug: "programacion-tech", icon: "terminal", description: "Automatización, integraciones, APIs y dashboards.", services_count: 31, created_at: "2026-01-01T00:00:00.000Z" },
  { id: "cat-consulting", name: "Consultoría", slug: "consultoria", icon: "briefcase", description: "Estrategia, operaciones y asesoría especializada.", services_count: 14, created_at: "2026-01-01T00:00:00.000Z" },
]

export const demoProfiles: Profile[] = [
  {
    id: "sofia-ux",
    email: "sofia@freelancehub.local",
    name: "Sofía Valdez",
    avatar_url: null,
    role: "freelancer",
    title: "Frontend Engineer",
    rating: 4.9,
    reviews_count: 38,
    completed_projects: 86,
    description: "Construyo interfaces rápidas, elegantes y fáciles de mantener para equipos digitales.",
    bio: "Especialista en Next.js, diseño de interfaces y sistemas visuales para productos SaaS. Trabajo con founders y equipos de producto que necesitan convertir ideas en pantallas listas para vender.",
    skills: ["Next.js", "TypeScript", "UX", "Motion UI"],
    hourly_rate: 850,
    location: "Tegucigalpa, Honduras",
    languages: ["Español", "Inglés"],
    verified: true,
    created_at: "2024-03-15T00:00:00.000Z",
  },
  {
    id: "marco-brand",
    email: "marco@freelancehub.local",
    name: "Marco Molina",
    avatar_url: null,
    role: "freelancer",
    title: "Brand Designer",
    rating: 4.8,
    reviews_count: 24,
    completed_projects: 52,
    description: "Diseño marcas digitales con sistemas visuales claros, memorables y listos para crecer.",
    bio: "Diseñador de identidad con experiencia en tecnología, educación y servicios profesionales. Entrego archivos editables, guías simples y piezas listas para lanzamiento.",
    skills: ["Branding", "Figma", "Dirección de arte", "Social media"],
    hourly_rate: 720,
    location: "San Salvador, El Salvador",
    languages: ["Español", "Inglés"],
    verified: true,
    created_at: "2023-09-02T00:00:00.000Z",
  },
  {
    id: "ana-growth",
    email: "ana@freelancehub.local",
    name: "Ana Lucía Paz",
    avatar_url: null,
    role: "freelancer",
    title: "Growth Strategist",
    rating: 4.7,
    reviews_count: 31,
    completed_projects: 64,
    description: "Ayudo a equipos a convertir campañas en sistemas de adquisición medibles.",
    bio: "Estratega de crecimiento con foco en pauta, contenido y analítica. Trabajo con marcas que quieren ordenar su mensaje, medir mejor y crecer con intención.",
    skills: ["Performance", "Copywriting", "Analytics", "Paid Media"],
    hourly_rate: 780,
    location: "Guatemala, Guatemala",
    languages: ["Español", "Inglés"],
    verified: true,
    created_at: "2024-01-20T00:00:00.000Z",
  },
  {
    id: "diego-ops",
    email: "diego@freelancehub.local",
    name: "Diego Castro",
    avatar_url: null,
    role: "freelancer",
    title: "Automation Engineer",
    rating: 5,
    reviews_count: 19,
    completed_projects: 33,
    description: "Automatizo procesos internos y creo dashboards que reducen trabajo manual.",
    bio: "Ingeniero de automatización enfocado en operaciones, APIs y paneles internos. Me gusta convertir procesos repetitivos en sistemas visibles y confiables.",
    skills: ["APIs", "Dashboards", "Automatización", "No-code"],
    hourly_rate: 950,
    location: "San Pedro Sula, Honduras",
    languages: ["Español", "Inglés"],
    verified: true,
    created_at: "2023-06-11T00:00:00.000Z",
  },
]

export const demoServices: Service[] = [
  {
    id: "svc-landing",
    title: "Landing page futurista para lanzamiento SaaS",
    description: "Landing responsive con animaciones, SEO base y estructura lista para conversión.",
    long_description: "Diseño e implementación de una landing page moderna para presentar tu producto, capturar leads y comunicar valor con una experiencia visual memorable. Incluye estructura responsive, secciones de conversión, microinteracciones, optimización base y entrega lista para publicar.",
    category_id: "cat-web",
    freelancer_id: "sofia-ux",
    price: 14500,
    delivery_time: "7 días",
    rating: 4.9,
    reviews_count: 38,
    sales: 71,
    images: [],
    tags: ["nextjs", "landing", "ui", "saas"],
    active: true,
    created_at: "2026-06-01T00:00:00.000Z",
    category: demoCategories[0],
    freelancer: demoProfiles[0],
  },
  {
    id: "svc-brand",
    title: "Identidad visual premium para marca digital",
    description: "Sistema visual con logo, paleta, tipografía, guía de uso y piezas sociales.",
    long_description: "Creación de identidad visual para marcas digitales que necesitan verse sólidas desde el primer contacto. Incluye dirección visual, logo principal, variaciones, paleta, tipografías sugeridas, mini guía de marca y piezas listas para redes.",
    category_id: "cat-design",
    freelancer_id: "marco-brand",
    price: 9800,
    delivery_time: "5 días",
    rating: 4.8,
    reviews_count: 24,
    sales: 52,
    images: [],
    tags: ["branding", "figma", "social", "logo"],
    active: true,
    created_at: "2026-05-24T00:00:00.000Z",
    category: demoCategories[1],
    freelancer: demoProfiles[1],
  },
  {
    id: "svc-growth",
    title: "Estrategia de crecimiento para campaña regional",
    description: "Plan de pauta, contenido y medición con calendario accionable para marketing.",
    long_description: "Plan de crecimiento para campañas regionales con enfoque en adquisición, mensaje y medición. Incluye análisis inicial, propuesta de canales, calendario de contenido, estructura de pauta y KPIs para que el equipo ejecute con claridad.",
    category_id: "cat-marketing",
    freelancer_id: "ana-growth",
    price: 11200,
    delivery_time: "6 días",
    rating: 4.7,
    reviews_count: 31,
    sales: 49,
    images: [],
    tags: ["marketing", "paid media", "contenido", "analytics"],
    active: true,
    created_at: "2026-05-16T00:00:00.000Z",
    category: demoCategories[2],
    freelancer: demoProfiles[2],
  },
  {
    id: "svc-automation",
    title: "Automatización de procesos con dashboard",
    description: "Integraciones, panel de métricas y flujos internos para reducir tareas manuales.",
    long_description: "Automatización de procesos internos con integraciones, formularios, alertas y un dashboard operativo para dar visibilidad al equipo. Ideal para ventas, soporte, operaciones o seguimiento de proyectos.",
    category_id: "cat-tech",
    freelancer_id: "diego-ops",
    price: 18900,
    delivery_time: "10 días",
    rating: 5,
    reviews_count: 19,
    sales: 33,
    images: [],
    tags: ["automatización", "dashboard", "apis", "operaciones"],
    active: true,
    created_at: "2026-05-08T00:00:00.000Z",
    category: demoCategories[6],
    freelancer: demoProfiles[3],
  },
]

export const demoReviews: Review[] = [
  {
    id: "review-landing-1",
    service_id: "svc-landing",
    user_id: "client-1",
    user_name: "María Fernanda",
    user_avatar: "MF",
    rating: 5,
    content: "La landing quedó lista para presentar a inversionistas y se siente muchísimo más premium que nuestra versión anterior.",
    created_at: "2026-06-18T00:00:00.000Z",
  },
  {
    id: "review-landing-2",
    service_id: "svc-landing",
    user_id: "client-2",
    user_name: "Carlos Rivera",
    user_avatar: "CR",
    rating: 5,
    content: "Excelente comunicación, entrega limpia y muy buen criterio visual.",
    created_at: "2026-06-12T00:00:00.000Z",
  },
]

export const demoTestimonials: Testimonial[] = [
  {
    id: "fallback-1",
    name: "María Fernanda",
    role: "Founder, Studio Nova",
    avatar: "MF",
    rating: 5,
    content: "Encontramos una diseñadora senior en horas y el proyecto avanzó con una claridad que no habíamos logrado en otras plataformas.",
    created_at: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "fallback-2",
    name: "Carlos Rivera",
    role: "Product Lead",
    avatar: "CR",
    rating: 5,
    content: "La experiencia se siente premium: perfiles claros, comunicación directa y una sensación de control durante todo el proceso.",
    created_at: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "fallback-3",
    name: "Ana Lucía",
    role: "Marketing Manager",
    avatar: "AL",
    rating: 5,
    content: "FreelanceHub nos ayudó a armar un equipo flexible para campaña, landing y contenido sin perder velocidad.",
    created_at: "2026-06-01T00:00:00.000Z",
  },
]

export function getDemoServiceById(id: string) {
  return demoServices.find((service) => service.id === id) ?? null
}

export function getDemoCategoryBySlug(slug: string) {
  return demoCategories.find((category) => category.slug === slug) ?? null
}

export function getDemoProfileById(id: string) {
  return demoProfiles.find((profile) => profile.id === id) ?? null
}

export function getDemoServicesByCategory(categoryId: string) {
  return demoServices.filter((service) => service.category_id === categoryId)
}

export function getDemoServicesByFreelancer(freelancerId: string) {
  return demoServices.filter((service) => service.freelancer_id === freelancerId)
}

export function getDemoRelatedServices(service: Service) {
  return demoServices
    .filter((item) => item.category_id === service.category_id && item.id !== service.id)
    .slice(0, 3)
}

export function getDemoReviewsByService(serviceId: string) {
  return demoReviews.filter((review) => review.service_id === serviceId)
}
