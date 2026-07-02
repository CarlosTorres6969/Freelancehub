"use client"

import { useTheme } from "@/contexts/ThemeContext"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      onClick={toggleTheme}
      className="group relative inline-flex h-10 w-20 items-center rounded-full border border-card-border bg-card-bg/80 p-1 text-muted-fg shadow-sm backdrop-blur transition-colors hover:text-foreground"
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
    >
      <span className={`absolute top-1 h-8 w-8 rounded-full bg-foreground shadow-lg transition-transform duration-300 ${isDark ? "translate-x-10" : "translate-x-0"}`} />
      <span className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isDark ? "text-muted-fg" : "text-background"}`}>
        <Sun className="h-4 w-4" strokeWidth={1.8} />
      </span>
      <span className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isDark ? "text-background" : "text-muted-fg"}`}>
        <Moon className="h-4 w-4" strokeWidth={1.8} />
      </span>
    </button>
  )
}
