"use client"

import { useEffect, useState, useTransition } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import AnimatedSection from "@/components/AnimatedSection"
import {
  getAdminStats, getAdminUsers, getAdminServices,
  updateUserRole, toggleServiceActive, updateCommissionRate, getCommissionRate,
} from "@/actions/admin"
import type { Profile, Service } from "@/types"

type AdminStats = Awaited<ReturnType<typeof getAdminStats>>

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  freelancer: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  client: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
}

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export default function AdminPage() {
  const { profile, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<Profile[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [commission, setCommission] = useState<number>(0.05)
  const [commissionInput, setCommissionInput] = useState("5")
  const [dataLoading, setDataLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && profile?.role !== "admin") router.replace("/dashboard")
  }, [loading, profile, router])

  useEffect(() => {
    if (profile?.role !== "admin") return
    async function load() {
      const [s, u, sv, cr] = await Promise.all([
        getAdminStats(), getAdminUsers(), getAdminServices(), getCommissionRate(),
      ])
      setStats(s)
      setUsers(u as Profile[])
      setServices(sv as unknown as Service[])
      setCommission(cr)
      setCommissionInput(String(Math.round(cr * 100)))
      setDataLoading(false)
    }
    load()
  }, [profile])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleRoleChange(userId: string, role: "client" | "freelancer" | "admin") {
    startTransition(async () => {
      await updateUserRole(userId, role)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
      showToast("Rol actualizado")
    })
  }

  function handleToggleService(serviceId: string, active: boolean) {
    startTransition(async () => {
      await toggleServiceActive(serviceId, !active)
      setServices(prev => prev.map(s => s.id === serviceId ? { ...s, active: !active } : s))
      showToast(active ? "Servicio desactivado" : "Servicio activado")
    })
  }

  function handleSaveCommission() {
    const rate = parseFloat(commissionInput) / 100
    if (isNaN(rate) || rate < 0 || rate > 0.5) {
      showToast("Valor inválido (0–50%)")
      return
    }
    startTransition(async () => {
      await updateCommissionRate(rate)
      setCommission(rate)
      showToast(`Comisión actualizada a ${commissionInput}%`)
    })
  }

  if (loading || dataLoading) {
    return (
      <div className="page-shell">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-48 rounded-lg bg-muted" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 rounded-lg bg-muted" />)}
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "overview", label: "Resumen" },
    { id: "users", label: "Usuarios" },
    { id: "services", label: "Servicios" },
    { id: "settings", label: "Configuración" },
  ]

  return (
    <div className="page-shell">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-foreground px-5 py-3 text-sm text-background shadow-xl animate-fade-in">
          {toast}
        </div>
      )}

      <AnimatedSection>
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-lg shadow-violet-500/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground">Panel de Administración</h1>
            <p className="text-sm text-muted-fg">Gestión de la plataforma FreelanceHub</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Usuarios", value: stats?.totalUsers ?? 0, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
          { label: "Freelancers", value: stats?.totalFreelancers ?? 0, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
          { label: "Servicios", value: stats?.totalServices ?? 0, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Órdenes", value: stats?.totalOrders ?? 0, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Ingresos", value: `L ${(stats?.totalRevenue ?? 0).toLocaleString()}`, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Comisiones", value: `L ${(stats?.totalFees ?? 0).toLocaleString()}`, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20" },
        ].map((s, i) => (
          <AnimatedSection key={i} delay={i * 60}>
            <div className="neo-card rounded-lg p-4">
              <div className={`text-xs font-medium ${s.color} mb-1`}>{s.label}</div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex w-fit gap-1 overflow-x-auto rounded-lg border border-card-border bg-card-bg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id ? "bg-foreground text-background shadow-sm" : "text-muted-fg hover:bg-accent hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <AnimatedSection>
          <div className="neo-card overflow-hidden rounded-lg">
            <div className="p-6 border-b border-card-border">
              <h2 className="font-semibold text-foreground">Órdenes Recientes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-card-border text-muted-fg">
                    <th className="text-left px-6 py-3 font-medium">Servicio</th>
                    <th className="text-left px-6 py-3 font-medium">Comprador</th>
                    <th className="text-left px-6 py-3 font-medium">Freelancer</th>
                    <th className="text-left px-6 py-3 font-medium">Total</th>
                    <th className="text-left px-6 py-3 font-medium">Comisión</th>
                    <th className="text-left px-6 py-3 font-medium">Estado</th>
                    <th className="text-left px-6 py-3 font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recentOrders ?? []).map((order: Record<string, unknown>) => (
                    <tr key={order.id as string} className="border-b border-card-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-muted-fg">{(order.service as Record<string, unknown>)?.title as string ?? "—"}</td>
                      <td className="px-6 py-4 text-muted-fg">{(order.buyer as Record<string, unknown>)?.name as string ?? "—"}</td>
                      <td className="px-6 py-4 text-muted-fg">{(order.freelancer as Record<string, unknown>)?.name as string ?? "—"}</td>
                      <td className="px-6 py-4 font-medium text-foreground">L {(order.total as number).toLocaleString()}</td>
                      <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-medium">L {(order.service_fee as number).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[order.status as string] ?? ""}`}>
                          {order.status as string}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-fg">{new Date(order.created_at as string).toLocaleDateString("es-HN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Users */}
      {activeTab === "users" && (
        <AnimatedSection>
          <div className="neo-card overflow-hidden rounded-lg">
            <div className="p-6 border-b border-card-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Usuarios ({users.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-card-border text-muted-fg">
                    <th className="text-left px-6 py-3 font-medium">Nombre</th>
                    <th className="text-left px-6 py-3 font-medium">Email</th>
                    <th className="text-left px-6 py-3 font-medium">Rol</th>
                    <th className="text-left px-6 py-3 font-medium">Verificado</th>
                    <th className="text-left px-6 py-3 font-medium">Registro</th>
                    <th className="text-left px-6 py-3 font-medium">Cambiar Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-card-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                      <td className="px-6 py-4 text-muted-fg">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleColors[user.role]}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.verified
                          ? <span className="text-xs text-emerald-600 dark:text-emerald-400">✓ Verificado</span>
                          : <span className="text-xs text-muted-fg">—</span>}
                      </td>
                      <td className="px-6 py-4 text-muted-fg">{new Date(user.created_at).toLocaleDateString("es-HN")}</td>
                      <td className="px-6 py-4">
                        <select
                          defaultValue={user.role}
                          disabled={isPending}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as "client" | "freelancer" | "admin")}
                          className="input-future rounded-lg px-2 py-1 text-xs"
                        >
                          <option value="client">client</option>
                          <option value="freelancer">freelancer</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Services */}
      {activeTab === "services" && (
        <AnimatedSection>
          <div className="neo-card overflow-hidden rounded-lg">
            <div className="p-6 border-b border-card-border">
              <h2 className="font-semibold text-foreground">Servicios ({services.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-card-border text-muted-fg">
                    <th className="text-left px-6 py-3 font-medium">Título</th>
                    <th className="text-left px-6 py-3 font-medium">Freelancer</th>
                    <th className="text-left px-6 py-3 font-medium">Categoría</th>
                    <th className="text-left px-6 py-3 font-medium">Precio</th>
                    <th className="text-left px-6 py-3 font-medium">Rating</th>
                    <th className="text-left px-6 py-3 font-medium">Estado</th>
                    <th className="text-left px-6 py-3 font-medium">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service: Service & { freelancer?: { name: string } }) => (
                    <tr key={service.id} className="border-b border-card-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground max-w-xs truncate">{service.title}</td>
                      <td className="px-6 py-4 text-muted-fg">{service.freelancer?.name ?? "—"}</td>
                      <td className="px-6 py-4 text-muted-fg">{service.category?.name ?? "—"}</td>
                      <td className="px-6 py-4 text-foreground">L {service.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-amber-500">★ {service.rating}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${service.active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                          {service.active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          disabled={isPending}
                          onClick={() => handleToggleService(service.id, service.active)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${service.active ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400"}`}
                        >
                          {service.active ? "Desactivar" : "Activar"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Settings */}
      {activeTab === "settings" && (
        <AnimatedSection>
          <div className="max-w-lg space-y-6">
            <div className="neo-card rounded-lg p-6">
              <h2 className="font-semibold text-foreground mb-1">Comisión de la Plataforma</h2>
              <p className="text-sm text-muted-fg mb-5">
                Porcentaje que FreelanceHub retiene por cada orden completada. Actualmente: <span className="font-semibold text-foreground">{Math.round(commission * 100)}%</span>
              </p>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    value={commissionInput}
                    onChange={(e) => setCommissionInput(e.target.value)}
                    className="input-future w-full rounded-lg px-4 py-2.5 pr-8 text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-fg text-sm">%</span>
                </div>
                <button
                  onClick={handleSaveCommission}
                  disabled={isPending}
                  className="btn-primary px-5 py-2.5 text-sm disabled:opacity-50"
                >
                  {isPending ? "Guardando..." : "Guardar"}
                </button>
              </div>
              <p className="text-xs text-muted-fg mt-3">
                Ejemplo con {commissionInput}%: un servicio de L 1,000 cobra L {Math.round(1000 * (parseFloat(commissionInput) || 0) / 100)} de comisión, el cliente paga L {1000 + Math.round(1000 * (parseFloat(commissionInput) || 0) / 100)}.
              </p>
            </div>
          </div>
        </AnimatedSection>
      )}
    </div>
  )
}
