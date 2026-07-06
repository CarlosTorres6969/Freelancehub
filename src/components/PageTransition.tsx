"use client"

import { useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { m, useReducedMotion } from "motion/react"

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const
const CURTAIN_EASE = [0.83, 0, 0.17, 1] as const

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const contentRef = useRef<HTMLDivElement>(null)
  const [firstPath] = useState(pathname)
  const [navigated, setNavigated] = useState(false)
  const reducedMotion = useReducedMotion()

  if (!navigated && pathname !== firstPath) setNavigated(true)

  // Primera carga: sin animación — el HTML del servidor debe ser visible de
  // inmediato (LCP). Solo se anima en navegaciones del lado del cliente.
  if ((!navigated && pathname === firstPath) || reducedMotion) {
    return <div key={pathname}>{children}</div>
  }

  return (
    <div key={pathname}>
      <m.div
        ref={contentRef}
        initial={{ opacity: 0, y: 26, scale: 0.99, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.5, delay: 0.12, ease: REVEAL_EASE }}
        onAnimationComplete={() => {
          // Un transform/filter activo convierte este div en containing block
          // y rompería los modales position:fixed dentro de las páginas.
          const el = contentRef.current
          if (el) {
            el.style.transform = "none"
            el.style.filter = "none"
          }
        }}
      >
        {children}
      </m.div>

      {/* Cortina de barrido: capa de marca + capa de fondo con leve retraso */}
      <m.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80]"
        style={{
          transformOrigin: "50% 0%",
          background: "linear-gradient(115deg, var(--primary-strong), var(--primary), var(--cyan))",
        }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.4, ease: CURTAIN_EASE }}
      />
      <m.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[79] bg-background"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        style={{ transformOrigin: "50% 0%" }}
        transition={{ duration: 0.4, delay: 0.08, ease: CURTAIN_EASE }}
      />
    </div>
  )
}
