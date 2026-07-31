"use server"

import { createClient } from "@/lib/supabase/server"

export async function submitContact(formData: FormData) {
  try {
    const supabase = await createClient()
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    const { error } = await supabase.from("contact_messages").insert({
      name, email, subject, message,
    })

    if (error) return { error: error.message }
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error desconocido" }
  }
}
