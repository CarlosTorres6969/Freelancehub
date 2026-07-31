import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ServiceForm from "@/components/ServiceForm"

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: service } = await supabase.from("services").select("*").eq("id", id).single()
  if (!service) notFound()

  return <ServiceForm service={service} />
}
