import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

const XAI_API_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "llama-3.3-70b-versatile"

// ─── Tipos internos ───────────────────────────────────────────────────────────

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

// ─── Consultas de contexto (read-only) ───────────────────────────────────────

async function buildContext(message: string, userId: string | null) {
  const supabase = await createClient()
  const lowerMsg = message.toLowerCase()
  const contextParts: string[] = []

  // Detectar intención: datos de otro usuario → bloqueado en system prompt,
  // pero tampoco consultamos nada de otros usuarios aquí.

  // ── Categorías ──────────────────────────────────────────────────────────────
  if (
    lowerMsg.includes("categor") ||
    lowerMsg.includes("tipo") ||
    lowerMsg.includes("área") ||
    lowerMsg.includes("area") ||
    lowerMsg.includes("qué hay") ||
    lowerMsg.includes("que hay")
  ) {
    const { data } = await supabase
      .from("categories")
      .select("name, description, services_count")
      .order("name")

    if (data?.length) {
      contextParts.push(
        "CATEGORÍAS DISPONIBLES:\n" +
          data
            .map(c => `- ${c.name}: ${c.description} (${c.services_count} servicios)`)
            .join("\n")
      )
    }
  }

  // ── Servicios más vendidos ───────────────────────────────────────────────────
  if (
    lowerMsg.includes("vendido") ||
    lowerMsg.includes("popular") ||
    lowerMsg.includes("top") ||
    lowerMsg.includes("mejor") ||
    lowerMsg.includes("recomend")
  ) {
    const { data } = await supabase
      .from("services")
      .select("title, price, rating, sales, delivery_time, category:categories(name)")
      .eq("active", true)
      .order("sales", { ascending: false })
      .limit(5)

    if (data?.length) {
      contextParts.push(
        "SERVICIOS MÁS VENDIDOS:\n" +
          data
            .map(
              s =>
                `- "${s.title}" | Precio: L${s.price} | Rating: ${s.rating}⭐ | Ventas: ${s.sales} | Entrega: ${s.delivery_time} | Categoría: ${(s.category as { name: string } | null)?.name ?? "N/A"}`
            )
            .join("\n")
      )
    }
  }

  // ── Servicio más barato ──────────────────────────────────────────────────────
  if (
    lowerMsg.includes("barat") ||
    lowerMsg.includes("econom") ||
    lowerMsg.includes("precio bajo") ||
    lowerMsg.includes("menos")
  ) {
    const { data } = await supabase
      .from("services")
      .select("title, price, rating, delivery_time, category:categories(name)")
      .eq("active", true)
      .order("price", { ascending: true })
      .limit(5)

    if (data?.length) {
      contextParts.push(
        "SERVICIOS MÁS BARATOS:\n" +
          data
            .map(
              s =>
                `- "${s.title}" | Precio: L${s.price} | Rating: ${s.rating}⭐ | Entrega: ${s.delivery_time} | Categoría: ${(s.category as { name: string } | null)?.name ?? "N/A"}`
            )
            .join("\n")
      )
    }
  }

  // ── Búsqueda de servicios por término ────────────────────────────────────────
  const searchTerms = [
    "diseño", "web", "logo", "video", "marketing", "seo", "redacción",
    "programación", "programacion", "app", "animación", "animacion",
    "fotograf", "música", "musica", "traducción", "traduccion",
  ]
  const matchedTerm = searchTerms.find(term => lowerMsg.includes(term))

  if (matchedTerm || lowerMsg.includes("servicio") || lowerMsg.includes("curso")) {
    const term = matchedTerm ?? ""
    const { data } = await supabase
      .from("services")
      .select("title, price, rating, sales, delivery_time, category:categories(name), tags")
      .eq("active", true)
      .or(
        term
          ? `title.ilike.%${term}%,description.ilike.%${term}%`
          : "active.eq.true"
      )
      .order("rating", { ascending: false })
      .limit(8)

    if (data?.length) {
      contextParts.push(
        `SERVICIOS ENCONTRADOS${term ? ` (relacionados con "${term}")` : ""}:\n` +
          data
            .map(
              s =>
                `- "${s.title}" | L${s.price} | ${s.rating}⭐ | Entrega: ${s.delivery_time} | Categoría: ${(s.category as { name: string } | null)?.name ?? "N/A"}`
            )
            .join("\n")
      )
    }
  }

  // ── Historial del usuario autenticado ────────────────────────────────────────
  if (
    userId &&
    (lowerMsg.includes("pedido") ||
      lowerMsg.includes("orden") ||
      lowerMsg.includes("compra") ||
      lowerMsg.includes("historial") ||
      lowerMsg.includes("encargué") ||
      lowerMsg.includes("encargu"))
  ) {
    const { data } = await supabase
      .from("orders")
      .select("status, price, total, created_at, service:services(title)")
      .eq("buyer_id", userId)
      .order("created_at", { ascending: false })
      .limit(10)

    if (data?.length) {
      contextParts.push(
        "HISTORIAL DE PEDIDOS DEL USUARIO:\n" +
          data
            .map(o => {
              const service = o.service as { title: string } | null
              const date = new Date(o.created_at).toLocaleDateString("es-HN")
              return `- "${service?.title ?? "Servicio eliminado"}" | Estado: ${o.status} | Total: L${o.total} | Fecha: ${date}`
            })
            .join("\n")
      )
    } else {
      contextParts.push("HISTORIAL DE PEDIDOS DEL USUARIO: Sin pedidos registrados.")
    }
  }

  // ── Favoritos del usuario autenticado ────────────────────────────────────────
  if (
    userId &&
    (lowerMsg.includes("favorito") ||
      lowerMsg.includes("guardado") ||
      lowerMsg.includes("wishl"))
  ) {
    const { data } = await supabase
      .from("favorites")
      .select("service:services(title, price, rating)")
      .eq("user_id", userId)
      .limit(10)

    if (data?.length) {
      contextParts.push(
        "FAVORITOS GUARDADOS DEL USUARIO:\n" +
          data
            .map(f => {
              const s = f.service as { title: string; price: number; rating: number } | null
              return s ? `- "${s.title}" | L${s.price} | ${s.rating}⭐` : null
            })
            .filter(Boolean)
            .join("\n")
      )
    } else {
      contextParts.push("FAVORITOS DEL USUARIO: No tiene servicios guardados.")
    }
  }

  return contextParts.join("\n\n")
}

// ─── System prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(context: string, isAuthenticated: boolean): string {
  return `Eres el asistente virtual de FreelanceHub, una plataforma de servicios freelance en Honduras. Tu nombre es "Asistente FH".

REGLAS ESTRICTAS QUE NUNCA PUEDES ROMPER:
1. SOLO puedes consultar información — nunca modifiques precios, perfiles, órdenes ni nada.
2. NUNCA reveles datos privados de otros usuarios (sus pedidos, mensajes, perfil privado, email, etc.).
3. Si te preguntan sobre otro usuario específico, responde: "No tengo acceso a datos privados de otros usuarios. Solo puedo ver información pública de los servicios."
4. No inventes datos. Si no tienes información, dilo claramente.
5. No hagas suposiciones sobre identidad de usuarios.
6. Responde siempre en español, de forma amable y concisa.
7. Los precios están en Lempiras hondureños (L o LPS).
${isAuthenticated ? "8. El usuario está autenticado. Puedes referirte a su historial y favoritos si los datos están en el contexto." : "8. El usuario NO está autenticado. No tienes acceso a ningún dato personal."}

LO QUE PUEDES AYUDAR:
- Explicar cómo funciona la plataforma
- Mostrar servicios disponibles, categorías, precios
- Indicar los servicios más vendidos o más baratos
- Responder sobre el historial de pedidos del usuario autenticado
- Orientar sobre cómo contratar o publicar un servicio

${context ? `DATOS ACTUALES DE LA PLATAFORMA:\n${context}` : "No hay datos de contexto adicionales para esta pregunta."}`
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, history = [], userId = null } = body as {
      message: string
      history: ChatMessage[]
      userId: string | null
    }

    if (!message?.trim()) {
      return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "API key no configurada" }, { status: 500 })
    }

    // Construir contexto con datos reales de Supabase
    const context = await buildContext(message, userId)
    const systemPrompt = buildSystemPrompt(context, !!userId)

    // Limitar historial a los últimos 10 turnos para no exceder tokens
    const recentHistory = history.slice(-10)

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...recentHistory,
      { role: "user", content: message },
    ]

    const response = await fetch(XAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 512,
        temperature: 0.4,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error("xAI API error:", err)
      return NextResponse.json({ error: "Error al contactar el agente" }, { status: 502 })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content ?? "No pude generar una respuesta."

    return NextResponse.json({ reply })
  } catch (err) {
    console.error("Chat route error:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
