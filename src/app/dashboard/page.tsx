"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import AnimatedSection from "@/components/AnimatedSection"
import { IncomeChart, ProjectsChart, CategoryChart } from "@/components/Charts"
import type { Order, Service, Category } from "@/types"

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

const statusLabels: Record<string, string> = {
  completed: "Completado",
  in_progress: "En progreso",
  pending: "Pendiente",
  cancelled: "Cancelado",
}

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [orders, setOrders] = useState<Order[]>([])
  const [myServices, setMyServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!user) { setLoading(false); return }
    const userId = user.id

    async function load() {
      const [ordersRes, servicesRes, categoriesRes] = await Promise.all([
        supabase
          .from("orders")
          .select("*, service:services(*)")
          .or(`buyer_id.eq.${userId},freelancer_id.eq.${userId}`)
          .order("created_at", { ascending: false }),
        supabase
          .from("services")
          .select("*, category:categories(*)")
          .eq("freelancer_id", userId)
          .eq("active", true)
          .order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name"),
      ])

      if (ordersRes.data) setOrders(ordersRes.data)
      if (servicesRes.data) setMyServices(servicesRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
      setLoading(false)
    }
    load()
  }, [user])

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

  const totalEarnings = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0)
  const completedOrders = orders.filter((o) => o.status === "completed").length
  const activeOrders = orders.filter((o) => o.status === "in_progress").length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <AnimatedSection>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-fg">
            {profile ? `Bienvenido de vuelta, ${profile.name}.` : "Bienvenido de vuelta."} Aquí tienes un resumen de tu actividad.
          </p>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400", label: "Ganancias Totales", value: `L ${totalEarnings.toLocaleString()}`, sub: "Órdenes completadas",
            svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
          { icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", label: "Completados", value: completedOrders, sub: "Pedidos finalizados",
            svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
          { icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", label: "Activos", value: activeOrders, sub: "En progreso",
            svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /> },
          { icon: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400", label: "Servicios", value: myServices.length, sub: "Publicados",
            svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
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
          { id: "overview", label: "Resumen" },
          { id: "orders", label: "Órdenes" },
          { id: "services", label: "Mis Servicios" },
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

          {activeTab === "overview" && (
        <AnimatedSection key="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <IncomeChart orders={orders} />
            <ProjectsChart orders={orders} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <CategoryChart categories={categories} orders={orders} />
            <div className="lg:col-span-2 p-6 rounded-xl border border-card-border bg-card-bg">
              <h2 className="font-semibold text-foreground mb-4">Resumen de Categorías</h2>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                      <span className="group-hover:scale-110 transition-transform">{cat.icon}</span>
                      <span className="text-sm text-muted-fg group-hover:text-foreground transition-colors">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-foreground rounded-full group-hover:bg-indigo-500 transition-colors"
                          style={{ width: `${Math.min((cat.services_count / 30) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground w-8 text-right">{cat.services_count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}

      {activeTab === "orders" && (
        <AnimatedSection key="orders">
          <div className="rounded-2xl border border-card-border bg-card-bg overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-card-border">
              <h2 className="font-semibold text-foreground">
                {orders.length > 0 ? "Órdenes Recientes" : "No tienes órdenes aún"}
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-muted-fg">No hay órdenes para mostrar.</div>
            )}
          </div>
        </AnimatedSection>
      )}

      {activeTab === "services" && (
        <AnimatedSection key="services">
          {myServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myServices.map((service) => (
                <div key={service.id} className="p-5 rounded-2xl border border-card-border bg-card-bg">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-fg">
                      {service.category?.name}
                    </span>
                    <span className="text-sm font-semibold text-foreground">L {service.price.toLocaleString()}</span>
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{service.title}</h3>
                  <p className="text-sm text-muted-fg mb-3 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-fg">
                      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {service.rating} ({service.reviews_count})
                    </div>
                    <span className="text-xs text-muted-fg">{service.sales} vendidos</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-muted-fg">No has publicado servicios aún.</div>
          )}
        </AnimatedSection>
      )}
    </div>
  )
}
