import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, BadgeCheck, CalendarDays, Globe2, MapPin, Wallet } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getDemoProfileById, getDemoServicesByFreelancer } from "@/lib/demo-data"
import ServiceCard from "@/components/ServiceCard"
import type { Profile, Service } from "@/types"

export const revalidate = 60

const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function FreelancerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let freelancer: Profile | null = getDemoProfileById(id)
  let freelancerServices: Service[] = freelancer ? getDemoServicesByFreelancer(id) : []

  if (hasSupabaseConfig) {
    const supabase = await createClient()

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (data) {
      freelancer = data as Profile
      const { data: services } = await supabase
        .from("services")
        .select("*, category:categories(*)")
        .eq("freelancer_id", id)
        .eq("active", true)
        .order("created_at", { ascending: false })

      freelancerServices = (services ?? []) as Service[]
    }
  }

  if (!freelancer) notFound()

  const initials = freelancer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 surface-grid opacity-15 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 tech-line opacity-70" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-6">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 rounded-lg border border-card-border bg-card-bg/80 px-3 py-2 text-sm font-bold text-muted-fg backdrop-blur transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            Volver al Marketplace
          </Link>
        </div>

        <section className="mb-8 rounded-lg border border-card-border bg-card-bg/80 p-6 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-rose-400 text-3xl font-black text-white shadow-lg shadow-black/10">
              {freelancer.avatar_url ? (
                <Image src={freelancer.avatar_url} alt="" width={96} height={96} className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <h1 className="text-3xl font-black tracking-normal text-foreground sm:text-5xl">{freelancer.name}</h1>
                  <p className="mt-2 text-lg text-muted-fg">{freelancer.title}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-muted-fg">
                      <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                      {freelancer.location}
                    </span>
                    {freelancer.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                        <BadgeCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
                        Verificado
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="rounded-lg bg-accent p-3">
                    <div className="text-xl font-black text-foreground">{freelancer.rating}</div>
                    <div className="text-muted-fg">Calificación</div>
                  </div>
                  <div className="rounded-lg bg-accent p-3">
                    <div className="text-xl font-black text-foreground">{freelancer.reviews_count}</div>
                    <div className="text-muted-fg">Reseñas</div>
                  </div>
                  <div className="rounded-lg bg-accent p-3">
                    <div className="text-xl font-black text-foreground">{freelancer.completed_projects}</div>
                    <div className="text-muted-fg">Proyectos</div>
                  </div>
                </div>
              </div>

              <p className="mt-5 max-w-4xl text-sm leading-7 text-muted-fg sm:text-base">
                {freelancer.bio ?? freelancer.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {freelancer.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-muted-fg">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-medium text-muted-fg">
                {freelancer.hourly_rate && (
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-primary" strokeWidth={1.8} />
                    L {freelancer.hourly_rate.toLocaleString()}/hora
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-secondary" strokeWidth={1.8} />
                  Miembro desde {new Date(freelancer.created_at).getFullYear()}
                </div>
                {freelancer.languages.map((lang) => (
                  <span key={lang} className="flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-success" strokeWidth={1.8} />
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <h2 className="mb-6 text-2xl font-black text-foreground">
          Servicios de {freelancer.name}
        </h2>

        {freelancerServices.length === 0 ? (
          <div className="rounded-lg border border-card-border bg-card-bg/80 px-6 py-16 text-center backdrop-blur-xl">
            <p className="text-muted-fg">Este freelancer no tiene servicios publicados actualmente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {freelancerServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
