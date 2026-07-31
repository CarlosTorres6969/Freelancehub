"use client"

import { useRef, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"
import PasswordConfirmModal from "@/components/PasswordConfirmModal"

export default function TitleDocumentUpload() {
  const { user, profile, refreshProfile } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [reauthError, setReauthError] = useState("")

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
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
    setPendingFile(file)
  }

  function cancelUpload() {
    setPendingFile(null)
    setReauthError("")
    if (inputRef.current) inputRef.current.value = ""
  }

  async function confirmUpload(password: string) {
    if (!pendingFile) return
    setUploading(true)
    setReauthError("")

    const data=new FormData();data.set("file",pendingFile);data.set("password",password);const response=await fetch("/api/me/title-document",{method:"POST",body:data})
    if (!response.ok) {
      const result=await response.json()
      setReauthError(result.error||"No se pudo subir")
      setUploading(false)
      return
    }

    await refreshProfile()
    setUploading(false)
    setPendingFile(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative w-40 h-28 rounded-lg overflow-hidden cursor-pointer group border border-card-border bg-card-bg"
        onClick={() => inputRef.current?.click()}
      >
        {profile?.title_document_url ? (
          <Image src={profile.title_document_url} alt="Título profesional" fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-fg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        )}
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

      <div className="flex items-center gap-3">
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50"
        >
          {uploading ? "Subiendo..." : profile?.title_document_url ? "Cambiar foto" : "Subir foto del título"}
        </button>
        {profile?.title_document_url && (
          <a href={profile.title_document_url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
            Ver documento completo
          </a>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-muted-fg">JPG, PNG o WebP · Máx. 2MB · Sube una foto legible de tu título o diploma</p>

      <PasswordConfirmModal
        isOpen={!!pendingFile}
        loading={uploading}
        error={reauthError}
        title="Confirma tu contraseña"
        description="Por seguridad, ingresa tu contraseña para actualizar tu documento de título."
        onConfirm={confirmUpload}
        onCancel={cancelUpload}
      />
    </div>
  )
}
