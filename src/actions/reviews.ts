"use server"

import { createClient } from "@/lib/supabase/server"

export async function addReview(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const serviceId = formData.get("serviceId") as string
  const rating = parseInt(formData.get("rating") as string)
  const content = formData.get("content") as string

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single()

  const { error } = await supabase.from("reviews").insert({
    service_id: serviceId,
    user_id: user.id,
    user_name: profile?.name ?? "Usuario",
    user_avatar: profile?.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() ?? "??",
    rating,
    content,
  })

  if (error) throw new Error(error.message)

  const { data: stats } = await supabase
    .from("reviews")
    .select("rating")
    .eq("service_id", serviceId)

  if (stats) {
    const avg = stats.reduce((a: number, r: { rating: number }) => a + r.rating, 0) / stats.length
    await supabase
      .from("services")
      .update({ rating: Math.round(avg * 100) / 100, reviews_count: stats.length })
      .eq("id", serviceId)
  }
}
