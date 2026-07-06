"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { validateServiceInput } from "@/lib/validation"

type ServerClient = Awaited<ReturnType<typeof createClient>>

async function requirePublisher(): Promise<{ supabase: ServerClient; userId: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "freelancer" && profile?.role !== "admin") {
    throw new Error("Necesitas una cuenta de freelancer para publicar servicios")
  }

  return { supabase, userId: user.id }
}

function readForm(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    long_description: formData.get("long_description"),
    category_id: formData.get("category_id"),
    price: formData.get("price"),
    delivery_time: formData.get("delivery_time"),
    tags: formData.get("tags"),
    images: formData.get("images"),
  }
}

export async function createService(formData: FormData): Promise<string> {
  const { supabase, userId } = await requirePublisher()
  const values = validateServiceInput(readForm(formData))

  const { data, error } = await supabase
    .from("services")
    .insert({ ...values, freelancer_id: userId })
    .select("id")
    .single()

  if (error) throw new Error(error.message)

  revalidatePath("/marketplace")
  revalidatePath("/dashboard")
  return data.id
}

export async function updateService(serviceId: string, formData: FormData): Promise<void> {
  if (!serviceId) throw new Error("Servicio inválido")
  const { supabase, userId } = await requirePublisher()
  const values = validateServiceInput(readForm(formData))

  // El filtro por freelancer_id evita editar servicios ajenos aunque RLS ya lo impida.
  const { error } = await supabase
    .from("services")
    .update(values)
    .eq("id", serviceId)
    .eq("freelancer_id", userId)

  if (error) throw new Error(error.message)

  revalidatePath("/marketplace")
  revalidatePath("/dashboard")
  revalidatePath(`/services/${serviceId}`)
}

export async function setServiceActive(serviceId: string, active: boolean): Promise<void> {
  if (!serviceId) throw new Error("Servicio inválido")
  const { supabase, userId } = await requirePublisher()

  const { error } = await supabase
    .from("services")
    .update({ active })
    .eq("id", serviceId)
    .eq("freelancer_id", userId)

  if (error) throw new Error(error.message)

  revalidatePath("/marketplace")
  revalidatePath("/dashboard")
}
