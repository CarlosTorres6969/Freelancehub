"use server"

import { createClient } from "@/lib/supabase/server"

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") throw new Error("Acceso denegado")
  return supabase
}

export async function getAdminStats() {
  const supabase = await requireAdmin()

  const [
    { count: totalUsers },
    { count: totalFreelancers },
    { count: totalServices },
    { count: totalOrders },
    { data: ordersData },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "freelancer"),
    supabase.from("services").select("*", { count: "exact", head: true }).eq("active", true),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total, service_fee, status, created_at"),
    supabase.from("orders")
      .select("*, service:services(title), buyer:profiles!orders_buyer_id_fkey(name), freelancer:profiles!orders_freelancer_id_fkey(name)")
      .order("created_at", { ascending: false })
      .limit(10),
  ])

  const completedOrders = ordersData?.filter(o => o.status === "completed") ?? []
  const totalRevenue = completedOrders.reduce((s, o) => s + o.total, 0)
  const totalFees = completedOrders.reduce((s, o) => s + o.service_fee, 0)

  return {
    totalUsers: totalUsers ?? 0,
    totalFreelancers: totalFreelancers ?? 0,
    totalServices: totalServices ?? 0,
    totalOrders: totalOrders ?? 0,
    totalRevenue,
    totalFees,
    recentOrders: recentOrders ?? [],
    ordersData: ordersData ?? [],
  }
}

export async function getAdminUsers() {
  const supabase = await requireAdmin()
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
  return data ?? []
}

export async function getAdminServices() {
  const supabase = await requireAdmin()
  const { data } = await supabase
    .from("services")
    .select("*, category:categories(name), freelancer:profiles!services_freelancer_id_fkey(name, email)")
    .order("created_at", { ascending: false })
  return data ?? []
}

export async function updateUserRole(userId: string, role: "client" | "freelancer" | "admin") {
  const supabase = await requireAdmin()
  const { error } = await supabase
    .from("profiles").update({ role }).eq("id", userId)
  if (error) throw new Error(error.message)
}

export async function toggleServiceActive(serviceId: string, active: boolean) {
  const supabase = await requireAdmin()
  const { error } = await supabase
    .from("services").update({ active }).eq("id", serviceId)
  if (error) throw new Error(error.message)
}

export async function getCommissionRate(): Promise<number> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("platform_settings")
    .select("value")
    .eq("key", "commission_rate")
    .single()
  return data ? parseFloat(data.value) : 0.05
}

export async function updateCommissionRate(rate: number) {
  const supabase = await requireAdmin()
  if (rate < 0 || rate > 0.5) throw new Error("La comisión debe estar entre 0% y 50%")
  const { error } = await supabase
    .from("platform_settings")
    .update({ value: rate.toString(), updated_at: new Date().toISOString() })
    .eq("key", "commission_rate")
  if (error) throw new Error(error.message)
}
