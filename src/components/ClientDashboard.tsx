"use client"

import { useState } from "react"
import Link from "next/link"
import { CircleDollarSign, Clock, Heart, Receipt, ShoppingBag } from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"
import OrderActions from "@/components/OrderActions"
import { IncomeChart, ProjectsChart, CategoryChart } from "@/components/Charts"
import { useFavorites } from "@/contexts/FavoritesContext"
import { statusStyles, statusLabels } from "@/lib/orderStatus"
import type { Order, Category, Profile } from "@/types"

interface ClientDashboardProps {
  profile: Profile | null
  orders: Order[]
  categories: Category[]
}

export default function ClientDashboard({ profile, orders, categories }: ClientDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const { favorites } = useFavorites()

  const totalSpent = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0)
  const activeOrders = orders.filter((o) => o.status === "in_progress" || o.status === "pending").length
  const hiredServices = orders.length

  const cards = [
    { icon: CircleDollarSign, label: "Total Gastado", value: `L ${totalSpent.toLocaleString()}`, sub: "Servicios completados", accent: "from-violet-500 to-fuchsia-500" },
    { icon: ShoppingBag, label: "Servicios Contratados", value: hiredServices, sub: "Historial completo", accent: "from-cyan-400 to-blue-500" },
    { icon: Clock, label: "En Curso", value: activeOrders, sub: "Pendientes o en progreso", accent: "from-amber-400 to-rose-500" },
    { icon: Heart, label: "Favoritos", value: favorites.length, sub: "Servicios guardados", accent: "from-emerald-400 to-teal-500" },
  ]

  return (
    <div className="page-shell">
      <AnimatedSection>
        <div className="mb-8">
          <span className="chip inline-flex rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
            Centro de control
          </span>
          <h1 className="mt-3 text-4xl font-black tracking-normal text-foreground sm:text-5xl">Mi Dashboard</h1>
          <p className="mt-2 max-w-2xl text-muted-fg">
            {profile ? `Bienvenido de vuelta, ${profile.name}.` : "Bienvenido de vuelta."} Aquí tienes un resumen de tus contrataciones y pagos.
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
          { id: "services", label: "Servicios Contratados" },
          { id: "payments", label: "Pagos" },
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
            <IncomeChart orders={orders} title="Gasto Mensual" label="Gasto" />
            <ProjectsChart orders={orders} title="Servicios Contratados por Mes" label="Servicios" />
          </div>
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <CategoryChart categories={categories} orders={orders} />
            <div className="neo-card rounded-lg p-6 lg:col-span-2">
              <h2 className="mb-4 font-bold text-foreground">Explora más categorías</h2>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="group flex items-center justify-between rounded-md px-1 py-1 transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center gap-2">
                      <span className="transition-transform group-hover:scale-110">{cat.icon}</span>
                      <span className="text-sm text-muted-fg transition-colors group-hover:text-foreground">{cat.name}</span>
                    </div>
                    <span className="text-xs text-muted-fg">{cat.services_count} servicios</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}

      {activeTab === "services" && (
        <AnimatedSection key="services">
          {orders.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {orders.map((order) => (
                <div key={order.id} className="neo-card rounded-lg p-5">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[order.status] ?? ""}`}>
                      {statusLabels[order.status] ?? order.status}
                    </span>
                    <span className="text-sm font-black text-foreground">L {order.total.toLocaleString()}</span>
                  </div>
                  <h3 className="mb-1 font-bold text-foreground">{order.service?.title ?? "Servicio"}</h3>
                  <p className="mb-3 text-xs text-muted-fg">
                    Contratado el {new Date(order.created_at).toLocaleDateString("es-HN")}
                  </p>
                  {order.status === "delivered" && order.delivery_note && (
                    <p className="mb-3 text-xs text-violet-600 dark:text-violet-300">Entrega: {order.delivery_note}</p>
                  )}
                  {order.status === "disputed" && order.dispute_reason && (
                    <p className="mb-3 text-xs text-orange-600 dark:text-orange-300">Disputa: {order.dispute_reason}</p>
                  )}
                  <div className="border-t border-card-border pt-3">
                    <OrderActions order={order} role="buyer" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="neo-card rounded-lg p-12 text-center text-muted-fg">
              Aún no has contratado ningún servicio.{" "}
              <Link href="/marketplace" className="font-bold text-foreground hover:underline">
                Explora el marketplace
              </Link>
            </div>
          )}
        </AnimatedSection>
      )}

      {activeTab === "payments" && (
        <AnimatedSection key="payments">
          <div className="neo-card overflow-hidden rounded-lg">
            <div className="flex items-center justify-between border-b border-card-border p-6">
              <h2 className="flex items-center gap-2 font-bold text-foreground">
                <Receipt className="h-4 w-4 text-violet-500" strokeWidth={1.8} />
                {orders.length > 0 ? "Historial de pagos" : "No tienes pagos aún"}
              </h2>
              {orders.length > 0 && (
                <span className="text-sm text-muted-fg">
                  Total pagado: <span className="font-bold text-foreground">L {totalSpent.toLocaleString()}</span>
                </span>
              )}
            </div>
            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-card-border text-muted-fg">
                      <th className="px-6 py-3 text-left font-bold">Servicio</th>
                      <th className="px-6 py-3 text-left font-bold">Fecha</th>
                      <th className="px-6 py-3 text-left font-bold">Precio</th>
                      <th className="px-6 py-3 text-left font-bold">Comisión</th>
                      <th className="px-6 py-3 text-left font-bold">Total pagado</th>
                      <th className="px-6 py-3 text-left font-bold">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-card-border transition-colors hover:bg-accent/60">
                        <td className="px-6 py-4 font-medium text-foreground">{order.service?.title ?? "Servicio"}</td>
                        <td className="px-6 py-4 text-muted-fg">{new Date(order.created_at).toLocaleDateString("es-HN")}</td>
                        <td className="px-6 py-4 text-muted-fg">L {order.price.toLocaleString()}</td>
                        <td className="px-6 py-4 text-muted-fg">L {order.service_fee.toLocaleString()}</td>
                        <td className="px-6 py-4 font-bold text-foreground">L {order.total.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[order.status] ?? ""}`}>
                            {statusLabels[order.status] ?? order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-muted-fg">No hay pagos para mostrar.</div>
            )}
          </div>
        </AnimatedSection>
      )}
    </div>
  )
}
