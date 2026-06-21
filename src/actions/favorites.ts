"use server"

import { createClient } from "@/lib/supabase/server"

export async function toggleFavorite(serviceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const existing = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("service_id", serviceId)
    .maybeSingle()

  if (existing.data) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.data.id)
    if (error) throw new Error(error.message)
    return false
  } else {
    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: user.id, service_id: serviceId })
    if (error) throw new Error(error.message)
    return true
  }
}
