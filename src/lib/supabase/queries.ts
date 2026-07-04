import { createClient as createBrowserClient } from "./client"
import type { Category, Service, Review, Profile, Testimonial, Conversation, Message, Order, Favorite } from "@/types"

function client() {
  return createBrowserClient()
}

// =====================================================
// CATEGORIES
// =====================================================
export async function getCategories(): Promise<Category[]> {
  const { data } = await client()
    .from("categories")
    .select("*")
    .order("name")
  return data ?? []
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data } = await client()
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()
  return data
}

// =====================================================
// SERVICES
// =====================================================
export async function getServices(options?: {
  categorySlug?: string
  search?: string
  sortBy?: "price_asc" | "price_desc" | "rating" | "sales"
  minPrice?: number
  maxPrice?: number
  minRating?: number
}): Promise<Service[]> {
  let query = client()
    .from("services")
    .select("*, category:categories(*), freelancer:profiles!services_freelancer_id_fkey(*)")
    .eq("active", true)

  if (options?.categorySlug) {
    const cat = await getCategoryBySlug(options.categorySlug)
    if (cat) query = query.eq("category_id", cat.id)
  }

  if (options?.search) {
    const term = `%${options.search}%`
    query = query.or(`title.ilike.${term},description.ilike.${term},tags.cs.{${options.search}}`)
  }

  if (options?.minPrice !== undefined) {
    query = query.gte("price", options.minPrice)
  }

  if (options?.maxPrice !== undefined) {
    query = query.lte("price", options.maxPrice)
  }

  if (options?.minRating !== undefined) {
    query = query.gte("rating", options.minRating)
  }

  switch (options?.sortBy) {
    case "price_asc":
      query = query.order("price", { ascending: true })
      break
    case "price_desc":
      query = query.order("price", { ascending: false })
      break
    case "rating":
      query = query.order("rating", { ascending: false })
      break
    case "sales":
      query = query.order("sales", { ascending: false })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  const { data } = await query
  return data ?? []
}

export async function getServiceById(id: string): Promise<Service | null> {
  const { data } = await client()
    .from("services")
    .select("*, category:categories(*), freelancer:profiles!services_freelancer_id_fkey(*)")
    .eq("id", id)
    .single()
  return data
}

export async function getServicesByFreelancer(freelancerId: string): Promise<Service[]> {
  const { data } = await client()
    .from("services")
    .select("*, category:categories(*)")
    .eq("freelancer_id", freelancerId)
    .eq("active", true)
    .order("created_at", { ascending: false })
  return data ?? []
}

export async function getServicesByIds(ids: string[]): Promise<Service[]> {
  if (ids.length === 0) return []
  const { data } = await client()
    .from("services")
    .select("*, category:categories(*)")
    .in("id", ids)
  return data ?? []
}

// =====================================================
// REVIEWS
// =====================================================
export async function getReviewsByService(serviceId: string): Promise<Review[]> {
  const { data } = await client()
    .from("reviews")
    .select("*")
    .eq("service_id", serviceId)
    .order("created_at", { ascending: false })
  return data ?? []
}

// =====================================================
// PROFILES
// =====================================================
export async function getProfileById(id: string): Promise<Profile | null> {
  const { data } = await client()
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single()
  return data
}

export async function getFreelancers(): Promise<Profile[]> {
  const { data } = await client()
    .from("profiles")
    .select("*")
    .eq("role", "freelancer")
    .order("rating", { ascending: false })
  return data ?? []
}

// =====================================================
// TESTIMONIALS
// =====================================================
export async function getTestimonials(): Promise<Testimonial[]> {
  const { data } = await client()
    .from("testimonials")
    .select("*")
    .order("created_at")
  return data ?? []
}

// =====================================================
// CONVERSATIONS & MESSAGES
// =====================================================
export async function getConversations(userId: string): Promise<Conversation[]> {
  const { data } = await client()
    .from("conversations")
    .select("*")
    .contains("participant_ids", [userId])
    .order("last_message_time", { ascending: false, nullsFirst: false })
  return data ?? []
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data } = await client()
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
  return data ?? []
}

// =====================================================
// ORDERS
// =====================================================
export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const { data } = await client()
    .from("orders")
    .select("*, service:services(*)")
    .or(`buyer_id.eq.${userId},freelancer_id.eq.${userId}`)
    .order("created_at", { ascending: false })
  return data ?? []
}

// =====================================================
// FAVORITES
// =====================================================
export async function getFavorites(userId: string): Promise<Favorite[]> {
  const { data } = await client()
    .from("favorites")
    .select("*, service:services(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  return data ?? []
}

export async function isFavorite(userId: string, serviceId: string): Promise<boolean> {
  const { data } = await client()
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("service_id", serviceId)
    .maybeSingle()
  return data !== null
}
