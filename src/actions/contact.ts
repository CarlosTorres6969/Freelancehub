"use server"

import { createClient } from "@/lib/supabase/server"

export async function submitContact(formData: FormData) {
  const supabase = await createClient()
  const name = ((formData.get("name") as string) ?? "").trim()
  const email = ((formData.get("email") as string) ?? "").trim()
  const subject = ((formData.get("subject") as string) ?? "").trim()
  const message = ((formData.get("message") as string) ?? "").trim()

  if (!name || !email || !message) throw new Error("Completa los campos requeridos")
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Correo electrónico inválido")
  if (name.length > 200 || subject.length > 300 || message.length > 5000) {
    throw new Error("El contenido excede el tamaño permitido")
  }

  const { error } = await supabase.from("contact_messages").insert({
    name, email, subject, message,
  })

  if (error) throw new Error(error.message)
}
