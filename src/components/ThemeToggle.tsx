"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === "light"

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg p-2 text-muted-fg transition-colors hover:bg-accent hover:text-foreground"
      aria-label={isLight ? "Activar modo oscuro" : "Activar modo claro"}
      title={isLight ? "Modo oscuro" : "Modo claro"}
    >
      {isLight ? <Moon className="h-5 w-5" strokeWidth={1.8} /> : <Sun className="h-5 w-5" strokeWidth={1.8} />}
    </button>
  )
}
