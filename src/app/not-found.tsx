import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6 animate-bounce">🚀</div>
        <h1 className="text-6xl font-bold text-foreground dark:text-zinc-100 mb-2">404</h1>
        <p className="text-xl text-muted-fg dark:text-zinc-400 mb-2">¡Ups! Esta página despegó sin ti</p>
        <p className="text-muted-fg dark:text-zinc-500 mb-8">
          Parece que la página que buscas no existe o se fue al espacio exterior.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="btn-3d inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background dark:bg-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
          >
            <span>←</span> Volver al Inicio
          </Link>
          <Link
            href="/marketplace"
            className="btn-3d inline-flex items-center justify-center gap-2 px-6 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl font-medium text-foreground dark:text-zinc-300 hover:bg-muted/50 dark:hover:bg-zinc-800 transition-all"
          >
            Explorar Servicios →
          </Link>
        </div>
      </div>
    </div>
  )
}
