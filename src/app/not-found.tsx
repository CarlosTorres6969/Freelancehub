import Link from "next/link"
import { ArrowLeft, SearchX } from "lucide-react"

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 surface-grid opacity-15" />
      <div className="relative max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-lg bg-accent text-primary">
          <SearchX className="h-10 w-10" strokeWidth={1.7} />
        </div>
        <h1 className="mb-2 text-6xl font-black text-foreground">404</h1>
        <p className="mb-2 text-xl font-bold text-foreground">Esta página no está disponible</p>
        <p className="mb-8 text-muted-fg">
          El enlace puede haber cambiado o el recurso ya no existe.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-bold text-background transition-transform hover:scale-[1.02]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            Volver al inicio
          </Link>
          <Link
            href="/marketplace"
            className="inline-flex items-center justify-center rounded-lg border border-card-border bg-card-bg/80 px-6 py-3 text-sm font-bold text-foreground backdrop-blur transition-colors hover:bg-accent"
          >
            Explorar servicios
          </Link>
        </div>
      </div>
    </div>
  )
}
