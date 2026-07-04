import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ServiceCard from "@/components/ServiceCard"
import ImageGallery from "@/components/ImageGallery"
import ReviewForm from "@/components/ReviewForm"
import TrackRecentlyViewed from "@/components/TrackRecentlyViewed"
import RecentlyViewed from "@/components/RecentlyViewed"
import AddToFavorites from "@/components/AddToFavorites"

export const revalidate = 60

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: service } = await supabase
    .from("services")
    .select("*, category:categories(*), freelancer:profiles!services_freelancer_id_fkey(*)")
    .eq("id", id)
    .single()

  if (!service) notFound()

  const { data: serviceReviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("service_id", id)
    .order("created_at", { ascending: false })

  const { data: relatedServices } = await supabase
    .from("services")
    .select("*, category:categories(*)")
    .eq("category_id", service.category_id)
    .neq("id", service.id)
    .eq("active", true)
    .limit(3)

  return (
    <div className="page-shell">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Link
                href={`/categories/${service.category?.slug}`}
                className="chip rounded-lg px-2.5 py-1 text-xs font-bold transition-colors hover:text-foreground"
              >
                {service.category?.name}
              </Link>
              <div className="flex items-center gap-1 text-sm">
                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium text-foreground">{service.rating}</span>
                <span className="text-muted-fg">({service.reviews_count} reseñas)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{service.title}</h1>
            <p className="text-lg text-muted-fg leading-relaxed">{service.long_description}</p>
          </div>

          <ImageGallery images={service.images} />

          {service.freelancer && (
            <Link
              href={`/freelancers/${service.freelancer.id}`}
              className="neo-card block rounded-lg p-6 transition-transform duration-300 hover:-translate-y-1 group"
            >
              <h2 className="font-semibold text-foreground mb-4">Sobre el freelancer</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-lg font-bold text-white shadow-lg shadow-violet-500/20">
                  {service.freelancer.avatar_url ? (
                    <img src={service.freelancer.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    service.freelancer.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {service.freelancer.name}
                    <span className="inline-flex ml-2 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full font-normal">
                      Ver perfil →
                    </span>
                  </div>
                  <div className="text-sm text-muted-fg">{service.freelancer.title}</div>
                  <div className="text-sm text-muted-fg">{service.freelancer.location}</div>
                </div>
              </div>
              <p className="text-sm text-muted-fg mb-4">{service.freelancer.description}</p>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-semibold text-foreground">{service.freelancer.rating}</span>
                  <span className="text-muted-fg"> Calificación</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground">{service.freelancer.reviews_count}</span>
                  <span className="text-muted-fg"> Reseñas</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground">{service.freelancer.completed_projects}</span>
                  <span className="text-muted-fg"> Proyectos</span>
                </div>
              </div>
            </Link>
          )}

          <div>
            <h2 className="font-semibold text-foreground mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="chip rounded-lg px-3 py-1.5 text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {serviceReviews && serviceReviews.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6">
                Reseñas ({serviceReviews.length})
              </h2>
              <div className="space-y-4">
                {serviceReviews.map((review) => (
                  <div key={review.id} className="neo-card rounded-lg p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-fg">
                          {review.user_avatar}
                        </div>
                        <div>
                          <div className="font-medium text-foreground text-sm">{review.user_name}</div>
                          <div className="text-xs text-muted-fg">
                            {new Date(review.created_at).toLocaleDateString("es-HN")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "text-amber-400" : "text-zinc-200 dark:text-zinc-600"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-fg leading-relaxed">&ldquo;{review.content}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ReviewForm serviceId={id} />
        </div>

        <div className="lg:col-span-1">
          <div className="neo-card sticky top-24 rounded-lg p-6">
            <div className="text-3xl font-bold text-foreground mb-1">
              L {service.price.toLocaleString()}
              <span className="text-base font-normal text-muted-fg"> HNL</span>
            </div>
            <div className="text-sm text-muted-fg mb-6">Precio fijo</div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-fg">
                <svg className="w-5 h-5 text-muted-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Entrega en {service.delivery_time}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-fg">
                <svg className="w-5 h-5 text-muted-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11m16-11v11" />
                </svg>
                {service.sales} vendidos
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-fg">
                <svg className="w-5 h-5 text-muted-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {service.reviews_count} reseñas positivas
              </div>
            </div>

            <AddToFavorites serviceId={service.id} />

            <Link
              href={`/checkout?serviceId=${service.id}&freelancerId=${service.freelancer_id}`}
              className="btn-primary mb-3 w-full py-3 text-center"
            >
              Contratar Servicio
            </Link>
            <button className="btn-secondary w-full py-3 text-sm">
              Enviar Mensaje
            </button>
          </div>
        </div>
      </div>

      <RecentlyViewed />

      {relatedServices && relatedServices.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-black text-foreground mb-6">Servicios relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedServices.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      )}

      <TrackRecentlyViewed serviceId={id} title={service.title} category={service.category?.name ?? ""} price={service.price} />
    </div>
  )
}
