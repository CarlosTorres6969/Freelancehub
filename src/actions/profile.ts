"use server"

import { createClient } from "@/lib/supabase/server"

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const updates: Record<string, unknown> = {}

  const fields = ["name", "title", "description", "bio", "location"]
  for (const field of fields) {
    const value = formData.get(field)
    if (value) updates[field] = value
  }

  const hourlyRate = formData.get("hourly_rate")
  if (hourlyRate) {
    const rate = parseFloat(hourlyRate as string)
    if (Number.isNaN(rate) || rate < 0 || rate > 100000) throw new Error("Tarifa por hora inválida")
    updates.hourly_rate = rate
  }

  const skills = formData.get("skills")
  if (skills) {
    updates.skills = (skills as string).split(",").map((s) => s.trim())
  }

  const languages = formData.get("languages")
  if (languages) {
    updates.languages = (languages as string).split(",").map((s) => s.trim())
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)

  if (error) throw new Error(error.message)
}
