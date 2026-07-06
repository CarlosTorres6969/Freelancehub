"use client"

import { m, useReducedMotion, type Variants } from "motion/react"

type RevealType = "up" | "left" | "right" | "scale"

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  type?: RevealType
  delay?: number
  once?: boolean
}

const variantsByType: Record<RevealType, Variants> = {
  up: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -28 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 28 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
}

export default function AnimatedSection({
  children,
  className = "",
  type = "up",
  delay = 0,
  once = true,
}: AnimatedSectionProps) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
      variants={variantsByType[type]}
      transition={{ duration: 0.55, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  )
}
