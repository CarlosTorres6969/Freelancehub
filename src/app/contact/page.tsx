"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import AnimatedSection from "@/components/AnimatedSection"
import { useToast } from "@/contexts/ToastContext"

export default function ContactPage() {
  const { addToast } = useToast()
  const supabase = createClient()
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      addToast("Completa todos los campos requeridos", "error")
      return
    }

    setSending(true)
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    })

    if (error) {
      addToast("Error al enviar el mensaje. Intenta de nuevo.", "error")
    } else {
      addToast("Mensaje enviado con éxito. Te responderemos pronto.", "success")
      setForm({ name: "", email: "", subject: "", message: "" })
    }
    setSending(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <AnimatedSection>
        <h1 className="text-3xl font-bold mb-2">Contáctanos</h1>
        <p className="text-muted-fg mb-8">
          ¿Tienes preguntas, sugerencias o necesitas ayuda? Estamos aquí para ti.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnimatedSection className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-xl border border-card-border bg-card-bg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-fg mb-1">Nombre *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-fg mb-1">Correo *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-fg mb-1">Asunto</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-fg mb-1">Mensaje *</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="btn-3d px-6 py-2.5 bg-foreground text-background rounded-xl text-sm font-medium hover:bg-zinc-800 transition-all disabled:opacity-50"
            >
              {sending ? "Enviando..." : "Enviar Mensaje"}
            </button>
          </form>
        </AnimatedSection>

        <AnimatedSection>
          <div className="space-y-6 p-6 rounded-xl border border-card-border bg-card-bg">
            <div>
              <h3 className="font-semibold text-foreground mb-1">📍 Ubicación</h3>
              <p className="text-sm text-muted-fg">Tegucigalpa, Honduras<br />Centroamérica</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">📧 Correo</h3>
              <p className="text-sm text-muted-fg">contacto@freelancehub.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">📞 Teléfono</h3>
              <p className="text-sm text-muted-fg">+504 2200-0000</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">🕐 Horario</h3>
              <p className="text-sm text-muted-fg">Lun - Vie: 8:00 AM - 6:00 PM</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
