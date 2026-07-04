"use server"

import { createClient } from "@/lib/supabase/server"

export async function sendMessage(conversationId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content,
  })

  if (error) throw new Error(error.message)

  await supabase
    .from("conversations")
    .update({ last_message: content, last_message_time: new Date().toISOString() })
    .eq("id", conversationId)
}

export async function createConversation(participantId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const { data, error } = await supabase
    .from("conversations")
    .insert({ participant_ids: [user.id, participantId] })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}
