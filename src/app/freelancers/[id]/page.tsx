import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import ServiceCard from "@/components/ServiceCard"

export const revalidate = 60

export default async function FreelancerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: freelancer } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single()

  if (!freelancer) notFound()

  const { data: freelancerServices } = await supabase
    .from("services")
    .select("*, category:categories(*)")
    .eq("freelancer_id", id)
    .eq("active", true)
    .order("created_at", { ascending: false })

  const initials = freelancer.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

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

      <div className="bg-card-bg rounded-2xl border border-card-border p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-muted-fg shrink-0 overflow-hidden">
            {freelancer.avatar_url ? (
              <img src={freelancer.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{freelancer.name}</h1>
                <p className="text-muted-fg">{freelancer.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-fg">{freelancer.location}</span>
                  {freelancer.verified && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verificado
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="text-xl font-bold text-foreground">{freelancer.rating}</div>
                  <div className="text-muted-fg">Calificación</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-foreground">{freelancer.reviews_count}</div>
                  <div className="text-muted-fg">Reseñas</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-foreground">{freelancer.completed_projects}</div>
                  <div className="text-muted-fg">Proyectos</div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-muted-fg leading-relaxed">{freelancer.bio}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {freelancer.skills.map((skill: string) => (
                <span key={skill} className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-fg">
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-fg">
              {freelancer.hourly_rate && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  L {freelancer.hourly_rate.toLocaleString()}/hora
                </div>
              )}
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {freelancer.location}
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Miembro desde {new Date(freelancer.created_at).getFullYear()}
              </div>
              {freelancer.languages.map((lang: string) => (
                <span key={lang} className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-6">
        Servicios de {freelancer.name}
      </h2>

      {!freelancerServices || freelancerServices.length === 0 ? (
        <p className="text-muted-fg">Este freelancer no tiene servicios publicados actualmente.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancerServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  )
}
