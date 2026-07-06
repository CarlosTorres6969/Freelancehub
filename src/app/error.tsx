"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RotateCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="page-shell flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-rose-500/12 text-rose-500">
        <AlertTriangle className="h-8 w-8" strokeWidth={1.7} />
      </div>
      <h1 className="mb-2 text-3xl font-black text-foreground">Algo salió mal</h1>
      <p className="mb-8 max-w-md text-muted-fg">
        Ocurrió un error inesperado. Puedes intentar de nuevo o volver al inicio.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={reset} className="btn-primary px-6 py-3 text-sm">
          <RotateCcw className="h-4 w-4" strokeWidth={1.9} />
          Intentar de nuevo
        </button>
        <Link href="/" className="btn-secondary px-6 py-3 text-sm">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
