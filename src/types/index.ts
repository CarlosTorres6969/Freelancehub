export type UserRole = "client" | "freelancer" | "admin"

export interface Profile {
  id: string
  email: string
  name: string
  avatar_url: string | null
  role: UserRole
  title: string | null
  rating: number
  reviews_count: number
  completed_projects: number
  description: string | null
  bio: string | null
  skills: string[]
  hourly_rate: number | null
  location: string | null
  languages: string[]
  verified: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  services_count: number
  created_at: string
}

export interface Service {
  id: string
  title: string
  description: string
  long_description: string
  category_id: string
  freelancer_id: string
  price: number
  delivery_time: string
  rating: number
  reviews_count: number
  sales: number
  images: string[]
  tags: string[]
  active: boolean
  created_at: string
  category?: Category
  freelancer?: Profile
}

export interface Review {
  id: string
  service_id: string
  user_id: string
  user_name: string
  user_avatar: string
  rating: number
  content: string
  created_at: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  avatar: string
  content: string
  rating: number
  created_at: string
}

export interface Conversation {
  id: string
  participant_ids: string[]
  last_message: string | null
  last_message_time: string | null
  created_at: string
  participant?: Profile
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
}

export interface Order {
  id: string
  service_id: string
  buyer_id: string
  freelancer_id: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  price: number
  service_fee: number
  total: number
  created_at: string
  updated_at: string
  service?: Service
}

export interface Favorite {
  id: string
  user_id: string
  service_id: string
  created_at: string
  service?: Service
}

export interface AppNotification {
  id: string
  user_id: string
  type: "order" | "message" | "review" | "system"
  title: string
  message: string
  read: boolean
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}
