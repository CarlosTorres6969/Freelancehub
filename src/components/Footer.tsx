import Link from "next/link"
import { Briefcase, Globe2, MessageCircle, Rocket } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-card-border bg-card-bg/70">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/20 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-white shadow-lg shadow-violet-500/20">
                <Rocket className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <span className="text-lg font-black tracking-tight text-foreground">FreelanceHub</span>
            </div>
            <p className="text-sm leading-7 text-muted-fg">
              La plataforma líder para conectar talento freelance con proyectos innovadores en Centroamérica.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-bold text-foreground">Explorar</h3>
            <ul className="space-y-2 text-sm text-muted-fg">
              <li><Link href="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link></li>
              <li><Link href="/marketplace?category=desarrollo-web" className="hover:text-foreground transition-colors">Desarrollo Web</Link></li>
              <li><Link href="/marketplace?category=diseno-grafico" className="hover:text-foreground transition-colors">Diseño Gráfico</Link></li>
              <li><Link href="/marketplace?category=marketing-digital" className="hover:text-foreground transition-colors">Marketing Digital</Link></li>
              <li><Link href="/how-it-works" className="hover:text-foreground transition-colors">Cómo Funciona</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-bold text-foreground">Para Freelancers</h3>
            <ul className="space-y-2 text-sm text-muted-fg">
              <li><Link href="/how-it-works" className="hover:text-foreground transition-colors">Cómo funciona</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link href="/profile" className="hover:text-foreground transition-colors">Mi Perfil</Link></li>
              <li><Link href="/messages" className="hover:text-foreground transition-colors">Mensajes</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-bold text-foreground">Compañía</h3>
            <ul className="space-y-2 text-sm text-muted-fg">
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contacto</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Términos y condiciones</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacidad</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-card-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-fg">
            &copy; {new Date().getFullYear()} FreelanceHub. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2">
            <a href="#" className="rounded-lg p-2 text-muted-fg transition-colors hover:bg-accent hover:text-foreground" aria-label="Facebook">
              <Globe2 className="h-5 w-5" strokeWidth={1.7} />
            </a>
            <a href="#" className="rounded-lg p-2 text-muted-fg transition-colors hover:bg-accent hover:text-foreground" aria-label="Twitter">
              <MessageCircle className="h-5 w-5" strokeWidth={1.7} />
            </a>
            <a href="#" className="rounded-lg p-2 text-muted-fg transition-colors hover:bg-accent hover:text-foreground" aria-label="LinkedIn">
              <Briefcase className="h-5 w-5" strokeWidth={1.7} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
