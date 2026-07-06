"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { BadgeCheck, Clock3, Wrench } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { createOrder } from "@/actions/orders"
import { getCommissionRate } from "@/actions/admin"
import type { Service } from "@/types"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [service, setService] = useState<Service | null>(null)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [loading, setLoading] = useState(true)
  const [commissionRate, setCommissionRate] = useState(0.05)
  const supabase = createClient()

  const serviceId = searchParams.get("serviceId")

  useEffect(() => {
    if (!serviceId) { setLoading(false); return }
    Promise.all([
      supabase
        .from("services")
        .select("*, freelancer:profiles!services_freelancer_id_fkey(*), category:categories(*)")
        .eq("id", serviceId)
        .single(),
      getCommissionRate(),
    ]).then(([{ data }, rate]) => {
      setService(data)
      setCommissionRate(rate)
      setLoading(false)
    })
  }, [serviceId, supabase])

  async function handleConfirm() {
    if (!user || !service) return
    setStep(2)
    const formData = new FormData()
    formData.set("serviceId", service.id)
    try {
      await createOrder(formData)
      setTimeout(() => setStep(3), 1500)
    } catch {
      setStep(1)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded-xl" />
          <div className="h-64 bg-muted rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Servicio no encontrado</h1>
        <Link href="/marketplace" className="text-indigo-500 hover:underline">Volver al Marketplace</Link>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Inicia sesión para continuar</h1>
        <p className="text-muted-fg mb-6">Debes iniciar sesión para contratar un servicio.</p>
        <Link
          href="/?auth=login"
          className="btn-primary px-6 py-3"
        >
          Iniciar Sesión
        </Link>
      </div>
    )
  }

  const price = service.price
  const serviceFee = Math.round(price * commissionRate * 100) / 100
  const total = price + serviceFee

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/marketplace" className="inline-flex items-center gap-1 text-sm text-muted-fg hover:text-foreground transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al Marketplace
        </Link>
      </div>

      <h1 className="mb-8 text-4xl font-black text-foreground sm:text-5xl">Checkout</h1>

      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${step >= s ? "bg-foreground text-background" : "bg-muted text-muted-fg"}`}>
              {step > s ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : s}
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
          {/* Preview del servicio */}
          <div className="neo-card rounded-lg p-6">
            <h2 className="font-semibold text-foreground mb-4">Detalle del servicio</h2>
            <div className="flex items-start gap-4 pb-4 border-b border-card-border">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-2xl text-white shadow-lg shadow-violet-500/20">
                {service.category?.icon ?? <Wrench className="h-7 w-7" strokeWidth={1.8} />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground leading-tight">{service.title}</h3>
                <p className="text-sm text-muted-fg mt-0.5">por {service.freelancer?.name ?? "Freelancer"}</p>
                <p className="text-sm text-muted-fg mt-1 line-clamp-2">{service.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-fg">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    {service.rating} ({service.reviews_count} reseñas)
                  </span>
                  <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" strokeWidth={1.7} /> Entrega en {service.delivery_time}</span>
                  <span className="inline-flex items-center gap-1"><BadgeCheck className="h-3.5 w-3.5" strokeWidth={1.7} /> {service.sales} ventas</span>
                </div>
              </div>
              <span className="font-bold text-foreground text-lg shrink-0">L {price.toLocaleString()}</span>
            </div>

            <div className="pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-fg">
                <span>Subtotal</span>
                <span>L {price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-fg">
                <span>Tarifa de servicio ({Math.round(commissionRate * 100)}%)</span>
                <span>L {serviceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-foreground text-base pt-2 border-t border-card-border">
                <span>Total</span>
                <span>L {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="neo-card rounded-lg p-6">
            <h2 className="font-semibold text-foreground mb-4">Método de pago</h2>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-card-border p-3 transition-colors hover:border-violet-300">
                <input type="radio" name="payment" defaultChecked className="accent-indigo-500" />
                <div className="flex items-center gap-2">
                  <svg className="w-8 h-6" viewBox="0 0 50 32"><rect width="50" height="32" rx="4" fill="#1A1F71"/><text x="25" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">VISA</text></svg>
                  <span className="text-sm text-foreground">Visa **** 4242</span>
                </div>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-card-border p-3 transition-colors hover:border-violet-300">
                <input type="radio" name="payment" className="accent-indigo-500" />
                <div className="flex items-center gap-2">
                  <svg className="w-8 h-6" viewBox="0 0 50 32"><rect width="50" height="32" rx="4" fill="#EB001B"/><circle cx="17" cy="16" r="10" fill="#EB001B"/><circle cx="33" cy="16" r="10" fill="#F79E1B"/></svg>
                  <span className="text-sm text-foreground">Mastercard **** 8888</span>
                </div>
              </label>
            </div>
          </div>

          <button onClick={handleConfirm} className="btn-primary w-full py-3.5 text-lg">
            Confirmar y Pagar L {total.toLocaleString()}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="text-center py-20">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
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
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-lg bg-emerald-100">
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
              className="btn-primary px-6 py-3"
            >
              Ir al Dashboard
            </Link>
            <Link
              href="/marketplace"
              className="btn-secondary px-6 py-3"
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
      <div className="mx-auto max-w-3xl px-4 py-12">
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
