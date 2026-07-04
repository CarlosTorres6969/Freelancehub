"use client"

import { useEffect, useState, useRef } from "react"

function FloatingParticles3D() {
  const [mounted, setMounted] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)
  const particleRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    setMounted(true)
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        mouseRef.current = {
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
        }
        if (rafRef.current === null) {
          rafRef.current = requestAnimationFrame(() => {
            const mx = mouseRef.current.x
            const my = mouseRef.current.y
            particleRefs.current.forEach((el) => {
              if (!el) return
              const depth = parseFloat(el.dataset.depth || "0.3")
              const baseTx = parseFloat(el.dataset.baseTx || "0")
              const baseTy = parseFloat(el.dataset.baseTy || "0")
              el.style.transform = `translate3d(${baseTx + mx * depth * 30}px, ${baseTy + my * depth * 30}px, 0)`
            })
            rafRef.current = null
          })
        }
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  if (!mounted) return null

  const layers = [
    { count: 8, size: [20, 50], color: "bg-indigo-500/20", depth: 0.3 },
    { count: 6, size: [30, 70], color: "bg-purple-500/15", depth: 0.5 },
    { count: 4, size: [50, 100], color: "bg-emerald-500/10", depth: 0.7 },
    { count: 3, size: [80, 150], color: "bg-pink-500/8", depth: 0.9 },
  ]

  const allParticles = layers.flatMap((layer) =>
    Array.from({ length: layer.count }).map((_, i) => ({
      depth: layer.depth,
      top: 10 + Math.random() * 80,
      left: 10 + Math.random() * 80,
      size: layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]),
      color: layer.color,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 8,
    }))
  )

  return (
    <div ref={sectionRef} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: "1200px", willChange: "transform" }}>
      {allParticles.map((p, i) => (
        <div
          key={i}
          ref={(el) => { particleRefs.current[i] = el }}
          data-depth={p.depth}
          data-base-tx={0}
          data-base-ty={0}
          className={`absolute rounded-full ${p.color} blur-sm`}
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            willChange: "transform",
            transform: "translate3d(0, 0, 0)",
            animation: `float-3d ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default FloatingParticles3D
