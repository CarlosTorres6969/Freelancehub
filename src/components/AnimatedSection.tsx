"use client"

import { useEffect, useRef, useState } from "react"

type RevealType = "up" | "left" | "right" | "scale"

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  type?: RevealType
  delay?: number
  once?: boolean
}

export default function AnimatedSection({
  children,
  className = "",
  type = "up",
  delay = 0,
  once = true,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay) {
            setTimeout(() => setVisible(true), delay)
          } else {
            setVisible(true)
          }
          if (once) observer.unobserve(el)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.05, rootMargin: "30px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, once])

  const revealClass =
    type === "up" ? "reveal" :
    type === "left" ? "reveal-left" :
    type === "right" ? "reveal-right" :
    "reveal-scale"

  return (
    <div
      ref={ref}
      className={`${revealClass} ${visible ? "visible" : ""} ${className}`}
      style={{ transitionDelay: delay ? `${delay}ms` : "0ms", willChange: visible ? "transform, opacity" : "auto" }}
    >
      {children}
    </div>
  )
}
