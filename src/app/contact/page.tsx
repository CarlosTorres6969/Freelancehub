"use client"

import { useState } from "react"
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react"
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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <AnimatedSection>
        <span className="chip inline-flex rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
          Soporte humano
        </span>
        <h1 className="mt-3 mb-2 text-4xl font-black text-foreground">Contáctanos</h1>
        <p className="text-muted-fg mb-8 leading-7">
          ¿Tienes preguntas, sugerencias o necesitas ayuda? Estamos aquí para ti.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnimatedSection className="md:col-span-2">
          <form onSubmit={handleSubmit} className="neo-card space-y-4 rounded-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-fg mb-1">Nombre *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-future w-full rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-fg mb-1">Correo *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-future w-full rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-fg mb-1">Asunto</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="input-future w-full rounded-lg px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-fg mb-1">Mensaje *</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input-future w-full resize-none rounded-lg px-4 py-2.5 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50"
            >
              {sending ? "Enviando..." : <><Send className="h-4 w-4" strokeWidth={1.8} /> Enviar Mensaje</>}
            </button>
          </form>
        </AnimatedSection>

        <AnimatedSection>
          <div className="neo-card space-y-6 rounded-lg p-6">
            <div>
              <h3 className="mb-1 flex items-center gap-2 font-bold text-foreground"><MapPin className="h-4 w-4 text-cyan-500" strokeWidth={1.8} /> Ubicación</h3>
              <p className="text-sm text-muted-fg">Tegucigalpa, Honduras<br />Centroamérica</p>
            </div>
            <div>
              <h3 className="mb-1 flex items-center gap-2 font-bold text-foreground"><Mail className="h-4 w-4 text-cyan-500" strokeWidth={1.8} /> Correo</h3>
              <p className="text-sm text-muted-fg">contacto@freelancehub.com</p>
            </div>
            <div>
              <h3 className="mb-1 flex items-center gap-2 font-bold text-foreground"><Phone className="h-4 w-4 text-cyan-500" strokeWidth={1.8} /> Teléfono</h3>
              <p className="text-sm text-muted-fg">+504 2200-0000</p>
            </div>
            <div>
              <h3 className="mb-1 flex items-center gap-2 font-bold text-foreground"><Clock className="h-4 w-4 text-cyan-500" strokeWidth={1.8} /> Horario</h3>
              <p className="text-sm text-muted-fg">Lun - Vie: 8:00 AM - 6:00 PM</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
