import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CheckCircle2, Clock, MessageSquare, ShoppingBag, Star, Tag } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import {
  getDemoRelatedServices,
  getDemoReviewsByService,
  getDemoServiceById,
} from "@/lib/demo-data"
import ServiceCard from "@/components/ServiceCard"
import ImageGallery from "@/components/ImageGallery"
import ReviewForm from "@/components/ReviewForm"
import TrackRecentlyViewed from "@/components/TrackRecentlyViewed"
import RecentlyViewed from "@/components/RecentlyViewed"
import AddToFavorites from "@/components/AddToFavorites"
import type { Review, Service } from "@/types"

export const revalidate = 60

const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let service: Service | null = getDemoServiceById(id)
  let serviceReviews: Review[] = service ? getDemoReviewsByService(id) : []
  let relatedServices: Service[] = service ? getDemoRelatedServices(service) : []

  if (hasSupabaseConfig) {
    const supabase = await createClient()

    const { data } = await supabase
      .from("services")
      .select("*, category:categories(*), freelancer:profiles!services_freelancer_id_fkey(*)")
      .eq("id", id)
      .maybeSingle()

    if (data) {
      service = data as Service

      const [{ data: reviews }, { data: related }] = await Promise.all([
        supabase
          .from("reviews")
          .select("*")
          .eq("service_id", id)
          .order("created_at", { ascending: false }),
        supabase
          .from("services")
          .select("*, category:categories(*)")
          .eq("category_id", service.category_id)
          .neq("id", service.id)
          .eq("active", true)
          .limit(3),
      ])

      serviceReviews = (reviews ?? []) as Review[]
      relatedServices = (related ?? []) as Service[]
    }
  }

  if (!service) notFound()

  const freelancer = service.freelancer
  const freelancerInitials = freelancer?.name
    ? freelancer.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "FH"

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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section className="rounded-lg border border-card-border bg-card-bg/80 p-6 backdrop-blur-xl">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                {service.category?.slug && (
                  <Link
                    href={`/categories/${service.category.slug}`}
                    className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-muted-fg transition-colors hover:text-foreground"
                  >
                    {service.category.name}
                  </Link>
                )}
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-warning text-warning" strokeWidth={1.5} />
                  <span className="font-bold text-foreground">{service.rating}</span>
                  <span className="text-muted-fg">({service.reviews_count} reseñas)</span>
                </div>
              </div>

              <h1 className="text-3xl font-black leading-tight tracking-normal text-foreground sm:text-5xl">
                {service.title}
              </h1>
              <p className="mt-5 text-base leading-8 text-muted-fg sm:text-lg">
                {service.long_description || service.description}
              </p>
            </section>

            <ImageGallery images={service.images} />

            {freelancer && (
              <Link
                href={`/freelancers/${freelancer.id}`}
                className="group block rounded-lg border border-card-border bg-card-bg/80 p-6 backdrop-blur-xl transition-colors hover:border-primary/40"
              >
                <h2 className="mb-4 text-lg font-black text-foreground">Sobre el freelancer</h2>
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-rose-400 text-lg font-black text-white shadow-lg shadow-black/10">
                    {freelancer.avatar_url ? (
                      <Image src={freelancer.avatar_url} alt="" width={56} height={56} className="h-full w-full object-cover" />
                    ) : (
                      freelancerInitials
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-foreground transition-colors group-hover:text-primary">
                      {freelancer.name}
                      <span className="ml-2 inline-flex rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                        Ver perfil
                      </span>
                    </div>
                    <div className="text-sm text-muted-fg">{freelancer.title}</div>
                    <div className="text-sm text-muted-fg">{freelancer.location}</div>
                  </div>
                </div>
                <p className="mb-4 text-sm leading-7 text-muted-fg">{freelancer.description}</p>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-lg bg-accent p-3">
                    <span className="block font-black text-foreground">{freelancer.rating}</span>
                    <span className="text-muted-fg">Calificación</span>
                  </div>
                  <div className="rounded-lg bg-accent p-3">
                    <span className="block font-black text-foreground">{freelancer.reviews_count}</span>
                    <span className="text-muted-fg">Reseñas</span>
                  </div>
                  <div className="rounded-lg bg-accent p-3">
                    <span className="block font-black text-foreground">{freelancer.completed_projects}</span>
                    <span className="text-muted-fg">Proyectos</span>
                  </div>
                </div>
              </Link>
            )}

            <section className="rounded-lg border border-card-border bg-card-bg/80 p-6 backdrop-blur-xl">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-black text-foreground">
                <Tag className="h-5 w-5 text-primary" strokeWidth={1.8} />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-muted-fg">
                    #{tag}
                  </span>
                ))}
              </div>
            </section>

            {serviceReviews.length > 0 && (
              <section>
                <h2 className="mb-5 text-2xl font-black text-foreground">
                  Reseñas ({serviceReviews.length})
                </h2>
                <div className="space-y-4">
                  {serviceReviews.map((review) => (
                    <div key={review.id} className="rounded-lg border border-card-border bg-card-bg/80 p-5 backdrop-blur-xl">
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-sm font-bold text-foreground">
                            {review.user_avatar}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-foreground">{review.user_name}</div>
                            <div className="text-xs text-muted-fg">
                              {new Date(review.created_at).toLocaleDateString("es-HN")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-warning text-warning" : "text-muted-fg/30"}`}
                              strokeWidth={1.5}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm leading-7 text-muted-fg">“{review.content}”</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <ReviewForm serviceId={id} />
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border border-card-border bg-card-bg/90 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
              <div className="mb-1 text-3xl font-black text-foreground">
                L {service.price.toLocaleString()}
                <span className="ml-1 text-sm font-bold uppercase tracking-[0.12em] text-muted-fg">HNL</span>
              </div>
              <div className="mb-6 text-sm text-muted-fg">Precio fijo</div>

              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-fg">
                  <Clock className="h-5 w-5 text-secondary" strokeWidth={1.8} />
                  Entrega en {service.delivery_time}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-fg">
                  <ShoppingBag className="h-5 w-5 text-primary" strokeWidth={1.8} />
                  {service.sales} vendidos
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-fg">
                  <CheckCircle2 className="h-5 w-5 text-success" strokeWidth={1.8} />
                  {service.reviews_count} reseñas positivas
                </div>
              </div>

              <AddToFavorites serviceId={service.id} />

              <Link
                href={`/checkout?serviceId=${service.id}&freelancerId=${service.freelancer_id}`}
                className="mb-3 block w-full rounded-lg bg-foreground py-3 text-center text-sm font-bold text-background transition-transform hover:scale-[1.01]"
              >
                Contratar servicio
              </Link>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-card-border py-3 text-sm font-bold text-muted-fg transition-colors hover:bg-accent hover:text-foreground">
                <MessageSquare className="h-4 w-4" strokeWidth={1.8} />
                Enviar mensaje
              </button>
            </div>
          </aside>
        </div>

        <RecentlyViewed />

        {relatedServices.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-black text-foreground">Servicios relacionados</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((item) => (
                <ServiceCard key={item.id} service={item} />
              ))}
            </div>
          </section>
        )}

        <TrackRecentlyViewed serviceId={id} title={service.title} category={service.category?.name ?? ""} price={service.price} />
      </div>
    </div>
  )
}
