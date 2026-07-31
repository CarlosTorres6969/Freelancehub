"use server"

import { createClient } from "@/lib/supabase/server"

export async function sendMessage(conversationId: string, content: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "No autenticado" }

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
    })

    if (error) return { error: error.message }

    await supabase
      .from("conversations")
      .update({ last_message: content, last_message_time: new Date().toISOString() })
      .eq("id", conversationId)

    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error desconocido" }
  }
}

export async function createConversation(participantId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "No autenticado" }

    const { data, error } = await supabase
      .from("conversations")
      .insert({ participant_ids: [user.id, participantId] })
      .select()
      .single()

    if (error) return { error: error.message }
    return { data }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error desconocido" }
  }
}
