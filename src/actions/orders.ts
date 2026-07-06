"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import {
  canTransitionOrder,
  computeServiceFee,
  isOrderStatus,
  type OrderRole,
  type OrderStatus,
} from "@/lib/validation"

type ServerClient = Awaited<ReturnType<typeof createClient>>

async function fetchCommissionRate(supabase: ServerClient): Promise<number> {
  const { data } = await supabase
    .from("platform_settings")
    .select("value")
    .eq("key", "commission_rate")
    .single()
  return data ? parseFloat(data.value) : 0.05
}

export async function createOrder(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const serviceId = formData.get("serviceId") as string
  if (!serviceId) throw new Error("Servicio inválido")
  const requirements = ((formData.get("requirements") as string) ?? "").trim().slice(0, 5000)

  // El precio y el freelancer se leen de la base de datos — nunca del cliente,
  // para que no puedan manipularse desde el navegador.
  const { data: service } = await supabase
    .from("services")
    .select("id, price, freelancer_id, active")
    .eq("id", serviceId)
    .single()

  if (!service || !service.active) throw new Error("Servicio no disponible")
  if (service.freelancer_id === user.id) throw new Error("No puedes contratar tu propio servicio")

  const commissionRate = await fetchCommissionRate(supabase)
  const price = service.price
  const serviceFee = computeServiceFee(price, commissionRate)
  const total = price + serviceFee

  const { error } = await supabase.from("orders").insert({
    service_id: service.id,
    buyer_id: user.id,
    freelancer_id: service.freelancer_id,
    price,
    service_fee: serviceFee,
    total,
    status: "pending",
    requirements: requirements || null,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/dashboard")
}

// Determina el rol del usuario respecto a una orden concreta.
function resolveOrderRole(
  order: { buyer_id: string; freelancer_id: string },
  userId: string,
  isAdmin: boolean
): OrderRole | null {
  if (order.buyer_id === userId) return "buyer"
  if (order.freelancer_id === userId) return "freelancer"
  if (isAdmin) return "admin"
  return null
}

/**
 * Avanza una orden a un nuevo estado validando que el rol del usuario tenga
 * permitida esa transición. Las reglas viven en @/lib/validation.
 */
export async function transitionOrder(
  orderId: string,
  to: string,
  extra?: { deliveryNote?: string; disputeReason?: string }
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  if (!isOrderStatus(to)) throw new Error("Estado inválido")

  const { data: order } = await supabase
    .from("orders")
    .select("id, buyer_id, freelancer_id, status")
    .eq("id", orderId)
    .single()

  if (!order) throw new Error("Orden no encontrada")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  const isAdmin = profile?.role === "admin"

  const role = resolveOrderRole(order, user.id, isAdmin)
  if (!role) throw new Error("Acceso denegado")

  const from = order.status as OrderStatus
  if (!canTransitionOrder(role, from, to)) {
    throw new Error("No puedes realizar esa acción sobre la orden")
  }

  const patch: Record<string, unknown> = { status: to, updated_at: new Date().toISOString() }

  if (to === "delivered") {
    patch.delivery_note = (extra?.deliveryNote ?? "").trim().slice(0, 5000) || null
    patch.delivered_at = new Date().toISOString()
  }
  if (to === "disputed") {
    const reason = (extra?.disputeReason ?? "").trim()
    if (!reason) throw new Error("Describe el motivo de la disputa")
    patch.dispute_reason = reason.slice(0, 2000)
  }

  const { error } = await supabase.from("orders").update(patch).eq("id", orderId)
  if (error) throw new Error(error.message)

  revalidatePath("/dashboard")
}
