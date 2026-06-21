export interface Conversation {
  id: string
  userName: string
  userAvatar: string
  lastMessage: string
  lastTime: string
  unread: boolean
  online: boolean
}

export const conversations: Conversation[] = [
  { id: "c1", userName: "Ana García", userAvatar: "AG", lastMessage: "¡Hola! ¿Qué tal? El proyecto avanza muy bien.", lastTime: "Hace 5 min", unread: true, online: true },
  { id: "c2", userName: "Carlos Mendoza", userAvatar: "CM", lastMessage: "Te envié los diseños actualizados.", lastTime: "Hace 1 hora", unread: true, online: true },
  { id: "c3", userName: "María López", userAvatar: "ML", lastMessage: "Gracias por la oportunidad. Quedo atenta.", lastTime: "Hace 3 horas", unread: false, online: false },
  { id: "c4", userName: "Roberto Flores", userAvatar: "RF", lastMessage: "El video está listo para revisión.", lastTime: "Ayer", unread: false, online: false },
  { id: "c5", userName: "Laura Castillo", userAvatar: "LC", lastMessage: "¿Podemos agendar una llamada?", lastTime: "Ayer", unread: false, online: true },
]

export interface Message {
  id: string
  conversationId: string
  sender: "me" | "other"
  content: string
  time: string
}

export const messagesByConversation: Record<string, Message[]> = {
  c1: [
    { id: "m1", conversationId: "c1", sender: "other", content: "¡Hola! ¿Qué tal? El proyecto avanza muy bien.", time: "10:30 AM" },
    { id: "m2", conversationId: "c1", sender: "me", content: "¡Hola! Me alegra escuchar eso. ¿Cómo va el landing page?", time: "10:32 AM" },
    { id: "m3", conversationId: "c1", sender: "other", content: "Ya terminé la sección Hero y la de características. Estoy trabajando en el formulario de contacto.", time: "10:35 AM" },
    { id: "m4", conversationId: "c1", sender: "me", content: "Perfecto, ¿necesitas alguna referencia adicional?", time: "10:36 AM" },
    { id: "m5", conversationId: "c1", sender: "other", content: "No, creo que con lo que me diste es suficiente. Te envío un preview esta tarde.", time: "10:38 AM" },
  ],
  c2: [
    { id: "m6", conversationId: "c2", sender: "other", content: "Te envié los diseños actualizados.", time: "2:15 PM" },
    { id: "m7", conversationId: "c2", sender: "me", content: "Los reviso ahora mismo. ¿Hiciste cambios en la paleta de colores?", time: "2:20 PM" },
    { id: "m8", conversationId: "c2", sender: "other", content: "Sí, ajusté los tonos para mejor contraste. Quedó más profesional.", time: "2:22 PM" },
  ],
}
