// Lógica de validación y reglas de negocio puras (sin dependencias de Supabase),
// para poder reutilizarlas en server actions y probarlas de forma aislada.

// ===================================================================
// ÓRDENES — máquina de estados
// ===================================================================
export const ORDER_STATUSES = [
  "pending",
  "in_progress",
  "delivered",
  "completed",
  "cancelled",
  "disputed",
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]
export type OrderRole = "buyer" | "freelancer" | "admin"

// Transiciones permitidas: desde un estado, qué rol puede llevarlo a qué estados.
export const ORDER_TRANSITIONS: Record<OrderStatus, Partial<Record<OrderRole, OrderStatus[]>>> = {
  pending: {
    freelancer: ["in_progress", "cancelled"],
    buyer: ["cancelled"],
  },
  in_progress: {
    freelancer: ["delivered"],
    buyer: ["disputed"],
  },
  delivered: {
    buyer: ["completed", "disputed"],
    freelancer: ["in_progress"],
  },
  disputed: {
    admin: ["completed", "cancelled"],
  },
  completed: {},
  cancelled: {},
}

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value)
}

// ¿Puede `role` mover una orden de `from` a `to`?
export function canTransitionOrder(role: OrderRole, from: OrderStatus, to: OrderStatus): boolean {
  if (from === to) return false
  const byRole = ORDER_TRANSITIONS[from]
  if (role === "admin") {
    // El admin resuelve disputas y puede aplicar cualquier transición documentada.
    const documented = Object.values(byRole).some((list) => list.includes(to))
    return documented || (from === "disputed" && (to === "completed" || to === "cancelled"))
  }
  return (byRole[role] ?? []).includes(to)
}

// ===================================================================
// PRECIOS
// ===================================================================
export function computeServiceFee(price: number, rate: number): number {
  return Math.round(price * rate * 100) / 100
}

// ===================================================================
// LISTAS SEPARADAS POR COMA (tags, skills, idiomas)
// ===================================================================
export function parseCommaList(raw: unknown, max = 20): string[] {
  if (typeof raw !== "string") return []
  return Array.from(
    new Set(
      raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    )
  ).slice(0, max)
}

// ===================================================================
// SERVICIOS
// ===================================================================
export interface ServiceInput {
  title: string
  description: string
  long_description: string
  category_id: string
  price: number
  delivery_time: string
  tags: string[]
  images: string[]
}

export function validateServiceInput(raw: Record<string, unknown>): ServiceInput {
  const title = String(raw.title ?? "").trim()
  const description = String(raw.description ?? "").trim()
  const long_description = String(raw.long_description ?? "").trim()
  const category_id = String(raw.category_id ?? "").trim()
  const delivery_time = String(raw.delivery_time ?? "").trim()
  const price = Number(raw.price)

  if (title.length < 5 || title.length > 100) {
    throw new Error("El título debe tener entre 5 y 100 caracteres")
  }
  if (description.length < 20 || description.length > 300) {
    throw new Error("La descripción corta debe tener entre 20 y 300 caracteres")
  }
  if (long_description.length < 50 || long_description.length > 5000) {
    throw new Error("La descripción detallada debe tener entre 50 y 5000 caracteres")
  }
  if (!category_id) {
    throw new Error("Selecciona una categoría")
  }
  if (!Number.isFinite(price) || price <= 0 || price > 1_000_000) {
    throw new Error("El precio debe ser mayor a 0 y menor a 1,000,000")
  }
  if (!delivery_time) {
    throw new Error("Indica el tiempo de entrega")
  }

  return {
    title,
    description,
    long_description,
    category_id,
    price: Math.round(price * 100) / 100,
    delivery_time,
    tags: parseCommaList(raw.tags),
    images: parseCommaList(raw.images, 8),
  }
}

// ===================================================================
// CONTACTO
// ===================================================================
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
