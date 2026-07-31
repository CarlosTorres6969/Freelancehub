"use server"

import { createClient } from "@/lib/supabase/server"

export async function updateProfile(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "No autenticado" }

    const updates: Record<string, unknown> = {}

    const fields = ["name", "title", "description", "bio", "location", "hourly_rate"]
    for (const field of fields) {
      const value = formData.get(field)
      if (value) updates[field] = value
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

    if (error) return { error: error.message }
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error desconocido" }
  }
}
