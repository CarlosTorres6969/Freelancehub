"use server"

import { createClient } from "@/lib/supabase/server"

export async function createOrder(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const serviceId = formData.get("serviceId") as string
  const price = parseFloat(formData.get("price") as string)
  const freelancerId = formData.get("freelancerId") as string
  const serviceFee = Math.round(price * 0.05 * 100) / 100
  const total = price + serviceFee

  const { error } = await supabase.from("orders").insert({
    service_id: serviceId,
    buyer_id: user.id,
    freelancer_id: freelancerId,
    price,
    service_fee: serviceFee,
    total,
    status: "pending",
  })

  if (error) throw new Error(error.message)
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .or(`buyer_id.eq.${user.id},freelancer_id.eq.${user.id}`)

  if (error) throw new Error(error.message)
}
