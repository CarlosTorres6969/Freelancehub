export interface Review {
  id: string
  serviceId: string
  userName: string
  userAvatar: string
  rating: number
  date: string
  content: string
}

export const reviews: Review[] = [
  { id: "r1", serviceId: "s1", userName: "Ricardo Paz", userAvatar: "RP", rating: 5, date: "2026-06-10", content: "Excelente trabajo. La landing page superó mis expectativas. Rápida y profesional." },
  { id: "r2", serviceId: "s1", userName: "Marta López", userAvatar: "ML", rating: 5, date: "2026-06-05", content: "Muy profesional, entendió exactamente lo que necesitaba. Recomendada." },
  { id: "r3", serviceId: "s1", userName: "Luis Fernández", userAvatar: "LF", rating: 4, date: "2026-05-28", content: "Buen trabajo, aunque hubo algunos ajustes menores que tomaron tiempo extra." },
  { id: "r4", serviceId: "s2", userName: "Andrea Mejía", userAvatar: "AM", rating: 5, date: "2026-06-12", content: "El diseño de nuestra app quedó hermoso. Muy intuitivo y moderno." },
  { id: "r5", serviceId: "s2", userName: "Pablo Gutiérrez", userAvatar: "PG", rating: 4, date: "2026-06-08", content: "Buen diseño, entregó a tiempo lo acordado. Volvería a contratar." },
  { id: "r6", serviceId: "s3", userName: "Sofía Rivera", userAvatar: "SR", rating: 5, date: "2026-06-01", content: "Nuestro tráfico orgánico creció un 80% en 3 meses. Increíble resultado." },
  { id: "r7", serviceId: "s3", userName: "Marco Antonio Solís", userAvatar: "MS", rating: 5, date: "2026-05-20", content: "Estrategia SEO muy completa. Reportes claros y comunicación constante." },
  { id: "r8", serviceId: "s4", userName: "TechStart HN", userAvatar: "TH", rating: 4, date: "2026-06-15", content: "La app quedó funcional y bien diseñada. Algunos bugs menores que se corrigieron rápido." },
  { id: "r9", serviceId: "s4", userName: "Inversiones GT", userAvatar: "IG", rating: 5, date: "2026-06-02", content: "Muy contentos con el resultado. La app está en producción y funcionando perfectamente." },
  { id: "r10", serviceId: "s5", userName: "Elena Vargas", userAvatar: "EV", rating: 5, date: "2026-06-18", content: "El copy para nuestra landing page aumentó las conversiones un 35%. Muy recomendada." },
  { id: "r11", serviceId: "s5", userName: "Carlos Rivera", userAvatar: "CR", rating: 5, date: "2026-06-10", content: "Rápida, profesional y con mucho talento. El texto quedó perfecto para nuestra marca." },
  { id: "r12", serviceId: "s6", userName: "Agencia Crea+", userAvatar: "AC", rating: 5, date: "2026-06-14", content: "El video promocional quedó espectacular. Muy creativo y profesional." },
  { id: "r13", serviceId: "s6", userName: "Marca HN", userAvatar: "MH", rating: 4, date: "2026-06-07", content: "Buena calidad de animación. Entregó en el tiempo prometido." },
  { id: "r14", serviceId: "s7", userName: "DataCorp SV", userAvatar: "DS", rating: 5, date: "2026-06-11", content: "Dashboard muy completo y fácil de usar. La integración con nuestra API fue perfecta." },
  { id: "r15", serviceId: "s8", userName: "Nueva Marca CR", userAvatar: "NC", rating: 5, date: "2026-06-09", content: "El branding completo quedó increíble. Recibimos muchos cumplidos." },
  { id: "r16", serviceId: "s9", userName: "Grupo Nova", userAvatar: "GN", rating: 4, date: "2026-06-16", content: "La gestión de redes ha mejorado notablemente. Buenos resultados en el primer mes." },
  { id: "r17", serviceId: "s10", userName: "TechDocs HN", userAvatar: "TD", rating: 5, date: "2026-06-13", content: "Traducción precisa y entregada antes del plazo. Muy profesional." },
  { id: "r18", serviceId: "s11", userName: "FinTech SV", userAvatar: "FS", rating: 5, date: "2026-06-06", content: "API robusta y bien documentada. El equipo de desarrollo quedó impresionado." },
  { id: "r19", serviceId: "s12", userName: "Canal GT", userAvatar: "CG", rating: 4, date: "2026-06-04", content: "Buena edición, el video quedó profesional. Mejoraría los tiempos de respuesta." },
  { id: "r20", serviceId: "s12", userName: "YouTuber HN", userAvatar: "YH", rating: 5, date: "2026-05-30", content: "Mi canal creció gracias a la calidad de edición. Muy recomendado." },
]

export function getReviewsByService(serviceId: string): Review[] {
  return reviews.filter((r) => r.serviceId === serviceId)
}
