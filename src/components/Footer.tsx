import Link from "next/link"
import { AtSign, Code2, Mail, Rocket } from "lucide-react"

const sections = [
  {
    title: "Explorar",
    links: [
      { href: "/marketplace", label: "Marketplace" },
      { href: "/marketplace?category=desarrollo-web", label: "Desarrollo Web" },
      { href: "/marketplace?category=diseno-grafico", label: "Diseño Gráfico" },
      { href: "/marketplace?category=marketing-digital", label: "Marketing Digital" },
      { href: "/how-it-works", label: "Cómo funciona" },
    ],
  },
  {
    title: "Freelancers",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/profile", label: "Mi perfil" },
      { href: "/messages", label: "Mensajes" },
      { href: "/favorites", label: "Favoritos" },
    ],
  },
  {
    title: "Compañía",
    links: [
      { href: "/contact", label: "Contacto" },
      { href: "/terms", label: "Términos" },
      { href: "/privacy", label: "Privacidad" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-card-border bg-muted/60">
      <div className="absolute inset-0 surface-grid opacity-25" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-white shadow-lg shadow-violet-500/20">
                <Rocket className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div>
                <span className="block text-lg font-black text-foreground">FreelanceHub</span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-fg">Talent OS</span>
              </div>
            </div>
            <p className="text-sm leading-7 text-muted-fg">
              La plataforma para conectar talento freelance de Centroamérica con proyectos digitales que necesitan moverse rápido.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-foreground">{section.title}</h3>
                <ul className="space-y-2 text-sm text-muted-fg">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="transition-colors hover:text-primary">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-card-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-fg">
            &copy; {new Date().getFullYear()} FreelanceHub. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2">
            {[
              { href: "mailto:hola@freelancehub.local", label: "Correo", icon: Mail },
              { href: "#", label: "Comunidad", icon: AtSign },
              { href: "#", label: "Código", icon: Code2 },
            ].map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-card-border bg-card-bg/70 text-muted-fg transition-colors hover:text-primary"
                  aria-label={item.label}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
