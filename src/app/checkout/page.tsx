"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { getDemoServiceById } from "@/lib/demo-data"
import { useAuth } from "@/contexts/AuthContext"
import type { Service } from "@/types"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const serviceId = searchParams.get("serviceId")
  const [service, setService] = useState<Service | null>(() => serviceId ? getDemoServiceById(serviceId) : null)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [loading, setLoading] = useState(isSupabaseConfigured && Boolean(serviceId))

  useEffect(() => {
    if (!serviceId) {
      queueMicrotask(() => setLoading(false))
      return
    }
    const demoService = getDemoServiceById(serviceId)
    if (!isSupabaseConfigured) {
      queueMicrotask(() => {
        setService(demoService)
        setLoading(false)
      })
      return
    }
    const supabase = createClient()
    supabase
      .from("services")
      .select("*, freelancer:profiles!services_freelancer_id_fkey(*)")
      .eq("id", serviceId)
      .maybeSingle()
      .then(({ data }) => {
        setService((data as Service | null) ?? demoService)
        setLoading(false)
      })
  }, [serviceId])

  async function handleConfirm() {
    if (!user || !service) return
    setStep(2)

    if (!isSupabaseConfigured) {
      setTimeout(() => setStep(3), 800)
      return
    }

    const price = service.price
    const serviceFee = Math.round(price * 0.05 * 100) / 100
    const total = price + serviceFee
    const supabase = createClient()

    const { error } = await supabase.from("orders").insert({
      service_id: service.id,
      buyer_id: user.id,
      freelancer_id: service.freelancer_id,
      price,
      service_fee: serviceFee,
      total,
      status: "pending",
    })

    if (!error) {
      setTimeout(() => setStep(3), 2000)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded-xl" />
          <div className="h-64 bg-muted rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Servicio no encontrado</h1>
        <Link href="/marketplace" className="text-indigo-500 hover:underline">Volver al Marketplace</Link>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Inicia sesión para continuar</h1>
        <p className="text-muted-fg mb-6">Debes iniciar sesión para contratar un servicio.</p>
        <Link
          href="/?auth=login"
          className="inline-flex items-center gap-2 bg-foreground text-background font-semibold px-6 py-3 rounded-xl"
        >
          Iniciar Sesión
        </Link>
      </div>
    )
  }

  const price = service.price
  const serviceFee = Math.round(price * 0.05 * 100) / 100
  const total = price + serviceFee

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1 text-sm text-muted-fg hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al Marketplace
        </Link>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">Checkout</h1>

      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                 step >= s ? "bg-foreground text-background" : "bg-muted text-muted-fg"
              }`}
            >
              {step > s ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                s
              )}
            </div>
            <span className={`text-sm ${step >= s ? "text-foreground font-medium" : "text-muted-fg"}`}>
              {s === 1 ? "Revisar" : s === 2 ? "Pagar" : "Confirmado"}
            </span>
            {s < 3 && <div className="w-8 h-px bg-card-border mx-1" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-card-border bg-card-bg">
            <h2 className="font-semibold text-foreground mb-4">Resumen del pedido</h2>
            <div className="flex items-start justify-between pb-4 border-b border-card-border">
              <div>
                <h3 className="font-medium text-foreground">{service.title}</h3>
                <p className="text-sm text-muted-fg">por {service.freelancer?.name ?? "Freelancer"}</p>
                <p className="text-sm text-muted-fg mt-1">Entrega en {service.delivery_time}</p>
              </div>
              <span className="font-semibold text-foreground">L {price.toLocaleString()}</span>
            </div>

            <div className="pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-fg">
                <span>Subtotal</span>
                <span>L {price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-fg">
                <span>Tarifa de servicio (5%)</span>
                <span>L {serviceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-foreground text-base pt-2 border-t border-card-border">
                <span>Total</span>
                <span>L {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-card-border bg-card-bg">
            <h2 className="font-semibold text-foreground mb-4">Método de pago</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-card-border hover:border-card-border cursor-pointer">
                <input type="radio" name="payment" defaultChecked className="accent-indigo-500" />
                <div className="flex items-center gap-2">
                  <svg className="w-8 h-6" viewBox="0 0 50 32"><rect width="50" height="32" rx="4" fill="#1A1F71"/><text x="25" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">VISA</text></svg>
                  <span className="text-sm text-foreground">Visa **** 4242</span>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-card-border hover:border-card-border cursor-pointer">
                <input type="radio" name="payment" className="accent-indigo-500" />
                <div className="flex items-center gap-2">
                  <svg className="w-8 h-6" viewBox="0 0 50 32"><rect width="50" height="32" rx="4" fill="#EB001B"/><circle cx="17" cy="16" r="10" fill="#EB001B"/><circle cx="33" cy="16" r="10" fill="#F79E1B"/></svg>
                  <span className="text-sm text-foreground">Mastercard **** 8888</span>
                </div>
              </label>
              <button className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-card-border hover:border-accent cursor-pointer w-full text-left">
                <svg className="w-5 h-5 text-muted-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm text-muted-fg">Agregar nuevo método de pago</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-foreground text-background font-semibold py-3.5 rounded-xl hover:opacity-90 transition-all text-lg"
          >
            Confirmar y Pagar L {total.toLocaleString()}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-8 h-8 text-muted-fg animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Procesando pago...</h2>
          <p className="text-muted-fg">Por favor espera mientras procesamos tu pago.</p>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">¡Pago confirmado!</h2>
          <p className="text-muted-fg mb-2">Tu pedido ha sido realizado exitosamente.</p>
          <p className="text-sm text-muted-fg mb-8">
            Recibirás una notificación cuando el freelancer comience a trabajar en tu proyecto.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-foreground text-background font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all"
            >
              Ir al Dashboard
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 border border-card-border text-foreground font-semibold px-6 py-3 rounded-xl hover:bg-muted/50 transition-colors"
            >
              Seguir Explorando
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded-xl" />
          <div className="h-64 bg-muted rounded-2xl" />
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
