"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, CircleDollarSign, Layers3, PackageCheck, Zap } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import AnimatedSection from "@/components/AnimatedSection"
import { IncomeChart, ProjectsChart, CategoryChart } from "@/components/Charts"
import type { Order, Service, Category } from "@/types"

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
  in_progress: "bg-cyan-500/12 text-cyan-600 dark:text-cyan-300",
  pending: "bg-amber-500/14 text-amber-700 dark:text-amber-300",
  cancelled: "bg-rose-500/12 text-rose-600 dark:text-rose-300",
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
      <div className="page-shell">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-64 rounded-lg bg-muted" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-lg bg-muted" />
            ))}
          </div>
          <div className="h-80 rounded-lg bg-muted" />
        </div>
      </div>
    )
  }

  const totalEarnings = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0)
  const completedOrders = orders.filter((o) => o.status === "completed").length
  const activeOrders = orders.filter((o) => o.status === "in_progress").length

  const cards = [
    { icon: CircleDollarSign, label: "Ganancias Totales", value: `L ${totalEarnings.toLocaleString()}`, sub: "Órdenes completadas", accent: "from-violet-500 to-fuchsia-500" },
    { icon: CheckCircle2, label: "Completados", value: completedOrders, sub: "Pedidos finalizados", accent: "from-emerald-400 to-teal-500" },
    { icon: Zap, label: "Activos", value: activeOrders, sub: "En progreso", accent: "from-cyan-400 to-blue-500" },
    { icon: Layers3, label: "Servicios", value: myServices.length, sub: "Publicados", accent: "from-amber-400 to-rose-500" },
  ]

  return (
    <div className="page-shell">
      <AnimatedSection>
        <div className="mb-8">
          <span className="chip inline-flex rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
            Centro de control
          </span>
          <h1 className="mt-3 text-4xl font-black tracking-normal text-foreground sm:text-5xl">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-muted-fg">
            {profile ? `Bienvenido de vuelta, ${profile.name}.` : "Bienvenido de vuelta."} Aquí tienes un resumen de tu actividad.
          </p>
        </div>
      </AnimatedSection>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <AnimatedSection key={card.label} delay={i * 100}>
              <div className="neo-card group rounded-lg p-5 transition-transform duration-300 hover:-translate-y-1">
                <div className="mb-3 flex items-center gap-3">
                  <div className={`grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br ${card.accent} text-white shadow-lg shadow-violet-500/15 transition-transform duration-300 group-hover:scale-105`}>
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <span className="text-sm font-bold text-muted-fg">{card.label}</span>
                </div>
                <div className="text-2xl font-black text-foreground">{card.value}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-muted-fg">{card.sub}</div>
              </div>
            </AnimatedSection>
          )
        })}
      </div>

      <div className="mb-6 flex w-fit gap-1 rounded-lg border border-card-border bg-card-bg p-1 shadow-sm">
        {[
          { id: "overview", label: "Resumen" },
          { id: "orders", label: "Órdenes" },
          { id: "services", label: "Mis Servicios" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-md px-4 py-2 text-sm font-bold transition-colors ${
              activeTab === tab.id
                ? "bg-foreground text-background"
                : "text-muted-fg hover:bg-accent hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <AnimatedSection key="overview">
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <IncomeChart orders={orders} />
            <ProjectsChart orders={orders} />
          </div>
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <CategoryChart categories={categories} orders={orders} />
            <div className="neo-card rounded-lg p-6 lg:col-span-2">
              <h2 className="mb-4 font-bold text-foreground">Resumen de Categorías</h2>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="group flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="transition-transform group-hover:scale-110">{cat.icon}</span>
                      <span className="text-sm text-muted-fg transition-colors group-hover:text-foreground">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-colors"
                          style={{ width: `${Math.min((cat.services_count / Math.max(...categories.map(c => c.services_count), 1)) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-sm font-bold text-foreground">{cat.services_count}</span>
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
          <div className="neo-card overflow-hidden rounded-lg">
            <div className="border-b border-card-border p-6">
              <h2 className="font-bold text-foreground">
                {orders.length > 0 ? "Órdenes recientes" : "No tienes órdenes aún"}
              </h2>
            </div>
            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-card-border text-muted-fg">
                      <th className="px-6 py-3 text-left font-bold">Servicio</th>
                      <th className="px-6 py-3 text-left font-bold">Monto</th>
                      <th className="px-6 py-3 text-left font-bold">Estado</th>
                      <th className="px-6 py-3 text-left font-bold">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-card-border transition-colors hover:bg-accent/60">
                        <td className="px-6 py-4 text-muted-fg">{order.service?.title ?? "Servicio"}</td>
                        <td className="px-6 py-4 font-bold text-foreground">L {order.total.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[order.status] ?? ""}`}>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {myServices.map((service) => (
                <div key={service.id} className="neo-card rounded-lg p-5">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <span className="chip rounded-lg px-2 py-1 text-xs font-bold">
                      {service.category?.name}
                    </span>
                    <span className="text-sm font-black text-foreground">L {service.price.toLocaleString()}</span>
                  </div>
                  <h3 className="mb-1 font-bold text-foreground">{service.title}</h3>
                  <p className="mb-3 line-clamp-2 text-sm text-muted-fg">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-fg">
                      <PackageCheck className="h-4 w-4 text-cyan-500" strokeWidth={1.7} />
                      {service.rating} ({service.reviews_count})
                    </div>
                    <span className="text-xs text-muted-fg">{service.sales} vendidos</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="neo-card rounded-lg p-12 text-center text-muted-fg">No has publicado servicios aún.</div>
          )}
        </AnimatedSection>
      )}
    </div>
  )
}
