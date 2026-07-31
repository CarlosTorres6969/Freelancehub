"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import AnimatedSection from "@/components/AnimatedSection"
import { useToast } from "@/contexts/ToastContext"
import type { Order, Favorite, Service } from "@/types"

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  accepted: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

const statusLabels: Record<string, string> = {
  completed: "Completado",
  in_progress: "En progreso",
  accepted: "Aceptado",
  pending: "Pendiente",
  cancelled: "Cancelado",
}

export default function ClientDashboard() {
  const { user, profile } = useAuth()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [orders, setOrders] = useState<Order[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!user || profile?.role !== "client") { setLoading(false); return }
    const load = async () => {
      const [ordersRes, favRes] = await Promise.all([
        supabase
          .from("orders")
          .select("*, service:services(*)")
          .eq("buyer_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("favorites")
          .select("*, service:services(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ])
      if (ordersRes.data) setOrders(ordersRes.data)
      if (favRes.data) setFavorites(favRes.data)
      setLoading(false)
    }
    load()
  }, [user, profile?.role])

  async function handleCancelOrder(orderId: string) {
    if (!confirm("¿Cancelar esta orden?")) return
    const { error } = await supabase.from("orders").update({ status: "cancelled" }).eq("id", orderId)
    if (error) { addToast("Error al cancelar orden", "error"); return }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "cancelled" } as Order : o))
    addToast("Orden cancelada", "success")
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-64 bg-muted rounded-xl" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-muted rounded-2xl" />
            ))}
          </div>
          <div className="h-80 bg-muted rounded-2xl" />
        </div>
      </div>
    )
  }

  const totalSpent = useMemo(() => orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0), [orders])
  const completedOrders = useMemo(() => orders.filter((o) => o.status === "completed").length, [orders])
  const pendingOrders = useMemo(() => orders.filter((o) => o.status === "pending").length, [orders])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <AnimatedSection>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Dashboard Cliente</h1>
          <p className="mt-2 text-muted-fg">Bienvenido de vuelta, {profile?.name}. Sigue tus órdenes y descubre nuevos servicios.</p>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400", label: "Total Gastado", value: `L ${totalSpent.toLocaleString()}`, sub: "Órdenes completadas",
            svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
          { icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", label: "Completadas", value: completedOrders, sub: "Órdenes finalizadas",
            svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
          { icon: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400", label: "Pendientes", value: pendingOrders, sub: "Esperando confirmación",
            svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
          { icon: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400", label: "Favoritos", value: favorites.length, sub: "Servicios guardados",
            svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /> },
        ].map((card, i) => (
          <AnimatedSection key={i} delay={i * 100}>
            <div className="group p-5 rounded-2xl border border-card-border bg-card-bg hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${card.icon} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{card.svg}</svg>
                </div>
                <span className="text-sm font-medium text-muted-fg">{card.label}</span>
              </div>
              <div className="text-2xl font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{card.value}</div>
              <div className="text-xs text-muted-fg mt-1">{card.sub}</div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <div className="flex gap-1 mb-6 bg-muted p-1 rounded-xl w-fit">
        {[
          { id: "orders", label: "Mis Órdenes" },
          { id: "favorites", label: "Favoritos" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? "bg-card-bg text-foreground shadow-sm"
                : "text-muted-fg hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "orders" && (
        <AnimatedSection key="orders">
          <div className="rounded-2xl border border-card-border bg-card-bg overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-card-border">
              <h2 className="font-semibold text-foreground">
                {orders.length > 0 ? "Órdenes Realizadas" : "No has realizado órdenes aún"}
              </h2>
            </div>
            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-card-border text-muted-fg">
                      <th className="text-left px-6 py-3 font-medium">Servicio</th>
                      <th className="text-left px-6 py-3 font-medium">Monto</th>
                      <th className="text-left px-6 py-3 font-medium">Estado</th>
                      <th className="text-left px-6 py-3 font-medium">Fecha</th>
                      <th className="text-left px-6 py-3 font-medium">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-card-border hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-muted-fg">{order.service?.title ?? "Servicio"}</td>
                        <td className="px-6 py-4 text-foreground">L {order.total.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[order.status] ?? ""}`}>
                            {statusLabels[order.status] ?? order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-fg">
                          {new Date(order.created_at).toLocaleDateString("es-HN")}
                        </td>
                        <td className="px-6 py-4">
                          {order.status === "pending" || order.status === "accepted" || order.status === "in_progress" ? (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="text-xs px-2.5 py-1 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:opacity-80 font-medium"
                            >
                              Cancelar
                            </button>
                          ) : (
                            <span className="text-xs text-muted-fg">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-muted-fg">
                Explora el marketplace y contrata tu primer servicio.
              </div>
            )}
          </div>
        </AnimatedSection>
      )}

      {activeTab === "favorites" && (
        <AnimatedSection key="favorites">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((fav) => (
                <Link
                  key={fav.id}
                  href={`/services/${fav.service_id}`}
                  className="p-5 rounded-2xl border border-card-border bg-card-bg hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-fg">
                      {fav.service?.category?.name ?? "Servicio"}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      L {fav.service?.price?.toLocaleString() ?? "—"}
                    </span>
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{fav.service?.title ?? "Servicio"}</h3>
                  <p className="text-sm text-muted-fg line-clamp-2">{fav.service?.description}</p>
                  {fav.service?.rating != null && (
                    <div className="flex items-center gap-1 mt-3 text-sm text-muted-fg">
                      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {fav.service.rating}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-muted-fg">
              No tienes servicios favoritos aún.{" "}
              <Link href="/marketplace" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Explorar Marketplace
              </Link>
            </div>
          )}
        </AnimatedSection>
      )}
    </div>
  )
}
