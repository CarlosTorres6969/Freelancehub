"use client"

import { useMemo, useRef, useState, useEffect } from "react"

interface TagAutocompleteProps {
  value: string[]
  onChange: (next: string[]) => void
  suggestions: string[]
  placeholder?: string
  max?: number
}

export default function TagAutocomplete({ value, onChange, suggestions, placeholder, max = 20 }: TagAutocompleteProps) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return suggestions.filter(
      (s) => s.toLowerCase().includes(q) && !value.some((v) => v.toLowerCase() === s.toLowerCase())
    ).slice(0, 8)
  }, [query, value, suggestions])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function addTag(tag: string) {
    const trimmed = tag.trim().slice(0, 100)
    if (!trimmed) return
    if (value.some((v) => v.toLowerCase() === trimmed.toLowerCase())) {
      setQuery("")
      return
    }
    if (value.length >= max) return
    onChange([...value, trimmed])
    setQuery("")
    setActiveIndex(-1)
  }

  function removeTag(tag: string) {
    onChange(value.filter((v) => v !== tag))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (activeIndex >= 0 && filtered[activeIndex]) {
        addTag(filtered[activeIndex])
      } else if (query.trim()) {
        addTag(query)
      }
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIndex(-1) }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="input-future w-full rounded-lg px-4 py-2.5 text-sm"
      />

      {open && filtered.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-card-border bg-card-bg shadow-lg overflow-hidden">
          {filtered.map((s, i) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => addTag(s)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                i === activeIndex ? "bg-indigo-50 dark:bg-indigo-900/20" : "hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {value.map((tag) => (
            <span key={tag} className="chip inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="text-muted-fg hover:text-foreground">
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
