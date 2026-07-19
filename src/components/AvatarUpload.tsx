"use client"

import { useRef, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"

export default function AvatarUpload() {
  const { user, profile, refreshProfile } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const initials = profile?.name
    ? profile.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "?"

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (file.size > 2 * 1024 * 1024) {
      setError("El archivo debe ser menor a 2MB")
      return
    }
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes")
      return
    }

    setError("")
    setUploading(true)

    const data=new FormData();data.set("file",file);const response=await fetch("/api/me/avatar",{method:"POST",body:data})
    if (!response.ok) {
      const result=await response.json();setError(result.error||"No se pudo subir")
      setUploading(false)
      return
    }

    await refreshProfile()
    setUploading(false)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer group"
        onClick={() => inputRef.current?.click()}
      >
        {profile?.avatar_url ? (
          <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
            {initials}
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {uploading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </div>
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50"
      >
        {uploading ? "Subiendo..." : "Cambiar foto"}
      </button>

      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-muted-fg">JPG, PNG o WebP · Máx. 2MB</p>
    </div>
  )
}
