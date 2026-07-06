"use server"

import { createClient } from "@/lib/supabase/server"

export async function sendMessage(conversationId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const trimmed = content.trim()
  if (!trimmed) throw new Error("El mensaje no puede estar vacío")
  if (trimmed.length > 5000) throw new Error("El mensaje es demasiado largo")

  // Solo los participantes de la conversación pueden escribir en ella.
  const { data: conversation } = await supabase
    .from("conversations")
    .select("participant_ids")
    .eq("id", conversationId)
    .single()

  if (!conversation?.participant_ids?.includes(user.id)) {
    throw new Error("Acceso denegado")
  }

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content: trimmed,
  })

  if (error) throw new Error(error.message)

  await supabase
    .from("conversations")
    .update({ last_message: trimmed, last_message_time: new Date().toISOString() })
    .eq("id", conversationId)
}

export async function createConversation(participantId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  if (!participantId || participantId === user.id) {
    throw new Error("Participante inválido")
  }

  // Reutiliza la conversación existente en vez de crear duplicados.
  const { data: existing } = await supabase
    .from("conversations")
    .select("*")
    .contains("participant_ids", [user.id, participantId])
    .limit(1)
    .maybeSingle()

  if (existing) return existing

  const { data, error } = await supabase
    .from("conversations")
    .insert({ participant_ids: [user.id, participantId] })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}
