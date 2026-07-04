import Link from "next/link"
import { ArrowLeft, ArrowRight, Rocket } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="neo-card max-w-md rounded-lg p-8 text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-white shadow-lg shadow-violet-500/20">
          <Rocket className="h-10 w-10" strokeWidth={1.6} />
        </div>
        <h1 className="mb-2 text-6xl font-black text-foreground">404</h1>
        <p className="mb-2 text-xl font-bold text-foreground">Esta página despegó sin ti</p>
        <p className="mb-8 text-muted-fg">
          Parece que la página que buscas no existe o cambió de ruta.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary px-6 py-3">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.9} />
            Inicio
          </Link>
          <Link href="/marketplace" className="btn-secondary px-6 py-3">
            Marketplace
            <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
          </Link>
        </div>
      </div>
    </div>
  )
}
