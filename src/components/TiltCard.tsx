"use client"

import { useRef, useState, useCallback, useEffect } from "react"

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  tiltDegree?: number
  glare?: boolean
  scale?: number
  speed?: number
}

export default function TiltCard({
  children,
  className = "",
  tiltDegree = 8,
  glare = true,
  scale = 1.02,
  speed = 300,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const lastMouse = useRef({ x: 0, y: 0 })
  const [style, setStyle] = useState({})
  const [glareStyle, setGlareStyle] = useState<{ opacity: number; background?: string }>({ opacity: 0 })

  const applyTilt = useCallback(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const { x, y } = lastMouse.current
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const mx = x - rect.left
    const my = y - rect.top
    const rotateX = ((my - centerY) / centerY) * -tiltDegree
    const rotateY = ((mx - centerX) / centerX) * tiltDegree

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: `transform ${speed}ms ease-out`,
    })

    if (glare) {
      const glareX = (mx / rect.width) * 100
      const glareY = (my / rect.height) * 100
      setGlareStyle({
        opacity: 0.15,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.6), transparent 60%)`,
      })
    }
    rafRef.current = null
  }, [tiltDegree, scale, speed, glare])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return
      lastMouse.current = { x: e.clientX, y: e.clientY }
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(applyTilt)
      }
    },
    [applyTilt]
  )

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    setStyle({
      transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: `transform ${speed * 1.5}ms ease-out`,
    })
    setGlareStyle({ opacity: 0 })
  }, [speed])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ perspective: "1000px", transformStyle: "preserve-3d", willChange: "transform" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ ...style, transformStyle: "preserve-3d" }}>
        {children}
        {glare && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
            style={glareStyle}
          />
        )}
      </div>
    </div>
  )
}
