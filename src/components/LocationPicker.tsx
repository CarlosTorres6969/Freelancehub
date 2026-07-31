"use client"

import { useMemo } from "react"
import { HONDURAS_DEPARTMENTS } from "@/data/honduras"

interface LocationPickerProps {
  department: string
  municipality: string
  onChange: (next: { department: string; municipality: string }) => void
}

export default function LocationPicker({ department, municipality, onChange }: LocationPickerProps) {
  const municipalities = useMemo(
    () => HONDURAS_DEPARTMENTS.find((d) => d.name === department)?.municipalities ?? [],
    [department]
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="block text-xs text-muted-fg mb-1">Departamento</label>
        <select
          value={department}
          onChange={(e) => onChange({ department: e.target.value, municipality: "" })}
          className="input-future w-full rounded-lg px-4 py-2.5 text-sm"
        >
          <option value="">Selecciona un departamento</option>
          {HONDURAS_DEPARTMENTS.map((d) => (
            <option key={d.name} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs text-muted-fg mb-1">Municipio</label>
        <select
          value={municipality}
          onChange={(e) => onChange({ department, municipality: e.target.value })}
          disabled={!department}
          className="input-future w-full rounded-lg px-4 py-2.5 text-sm disabled:opacity-50"
        >
          <option value="">{department ? "Selecciona un municipio" : "Selecciona un departamento primero"}</option>
          {municipalities.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
