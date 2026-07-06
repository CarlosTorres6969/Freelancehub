"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/contexts/ToastContext"
import { transitionOrder } from "@/actions/orders"
import { canTransitionOrder, type OrderRole, type OrderStatus } from "@/lib/validation"
import type { Order } from "@/types"

interface OrderActionsProps {
  order: Order
  role: OrderRole
}

const ACTION_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  in_progress: "Aceptar pedido",
  delivered: "Marcar como entregado",
  completed: "Aprobar y completar",
  cancelled: "Cancelar",
  disputed: "Abrir disputa",
}

const ACTION_STYLES: Partial<Record<OrderStatus, string>> = {
  completed: "btn-primary",
  in_progress: "btn-primary",
  delivered: "btn-primary",
  cancelled: "btn-secondary",
  disputed: "btn-secondary",
}

export default function OrderActions({ order, role }: OrderActionsProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [busy, setBusy] = useState(false)
  const [prompt, setPrompt] = useState<null | "delivered" | "disputed">(null)
  const [note, setNote] = useState("")

  const targets = (["in_progress", "delivered", "completed", "cancelled", "disputed"] as OrderStatus[])
    .filter((to) => canTransitionOrder(role, order.status, to))

  async function run(to: OrderStatus, extra?: { deliveryNote?: string; disputeReason?: string }) {
    setBusy(true)
    try {
      await transitionOrder(order.id, to, extra)
      addToast("Orden actualizada", "success")
      setPrompt(null)
      setNote("")
      router.refresh()
    } catch (err) {
      addToast(err instanceof Error ? err.message : "No se pudo actualizar", "error")
    } finally {
      setBusy(false)
    }
  }

  function handleClick(to: OrderStatus) {
    if (to === "delivered" || to === "disputed") {
      setPrompt(to)
      return
    }
    run(to)
  }

  if (targets.length === 0) return null

  if (prompt) {
    const isDelivery = prompt === "delivered"
    return (
      <div className="space-y-2">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder={isDelivery ? "Nota de entrega (opcional): enlaces, instrucciones..." : "Motivo de la disputa (requerido)"}
          className="input-future w-full rounded-lg px-3 py-2 text-sm placeholder:text-muted-fg"
        />
        <div className="flex gap-2">
          <button
            disabled={busy}
            onClick={() => run(prompt, isDelivery ? { deliveryNote: note } : { disputeReason: note })}
            className="btn-primary px-4 py-2 text-xs disabled:opacity-50"
          >
            {isDelivery ? "Confirmar entrega" : "Enviar disputa"}
          </button>
          <button disabled={busy} onClick={() => { setPrompt(null); setNote("") }} className="btn-secondary px-4 py-2 text-xs">
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {targets.map((to) => (
        <button
          key={to}
          disabled={busy}
          onClick={() => handleClick(to)}
          className={`${ACTION_STYLES[to] ?? "btn-secondary"} px-4 py-2 text-xs disabled:opacity-50`}
        >
          {ACTION_LABELS[to]}
        </button>
      ))}
    </div>
  )
}
