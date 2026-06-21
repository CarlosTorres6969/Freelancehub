export interface Testimonial {
  id: string
  name: string
  role: string
  avatar: string
  content: string
  rating: number
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Ricardo Paz",
    role: "Founder, TechStart HN",
    avatar: "RP",
    content: "FreelanceHub me permitió encontrar al desarrollador perfecto para mi startup. El proceso fue rápido y la calidad del trabajo excepcional. En menos de una semana teníamos nuestra landing page funcionando.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Sofía Rivera",
    role: "CMO, Grupo Nova",
    avatar: "SR",
    content: "Los profesionales de marketing en FreelanceHub transformaron nuestra estrategia digital. Resultados visibles desde el primer mes con un aumento del 60% en tráfico orgánico.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Mario Andrade",
    role: "CEO, BuildCorp",
    avatar: "MA",
    content: "Como contratista de proyectos de construcción, necesitaba diseños 3D de calidad. Encontré talento increíble aquí. Definitivamente la plataforma de referencia en Centroamérica.",
    rating: 4,
  },
  {
    id: "t4",
    name: "Gabriela Torres",
    role: "Directora de Marketing, EcoShop",
    avatar: "GT",
    content: "La calidad de los freelancers en FreelanceHub es impresionante. Contratamos a una diseñadora gráfica para nuestro branding y el resultado superó todas las expectativas.",
    rating: 5,
  },
  {
    id: "t5",
    name: "Fernando Castillo",
    role: "CTO, FinTech CR",
    avatar: "FC",
    content: "Necesitábamos una API compleja para nuestro producto financiero. El desarrollador que encontramos aquí no solo cumplió los requisitos, sino que sugirió mejoras que optimizaron todo el sistema.",
    rating: 5,
  },
  {
    id: "t6",
    name: "Andrea Mejía",
    role: "Fundadora, Agencia Crea+",
    avatar: "AM",
    content: "Como agencia, usamos FreelanceHub para escalar nuestro equipo según la demanda. Es una herramienta indispensable para nuestro crecimiento.",
    rating: 4,
  },
]
