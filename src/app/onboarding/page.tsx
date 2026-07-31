"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  async function handleSelectRole(role: "client" | "freelancer") {
    setLoading(true)
    setError("")

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/")
      return
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", user.id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Bienvenido a FreelanceHub</h1>
          <p className="text-muted-fg">¿Qué tipo de cuenta deseas tener?</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSelectRole("client")}
            disabled={loading}
            className="group relative bg-card-bg border-2 border-card-border rounded-2xl p-8 text-center hover:border-indigo-400 hover:shadow-lg transition-all disabled:opacity-50"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Cliente</h2>
            <p className="text-sm text-muted-fg">Quiero contratar freelancers y publicar proyectos</p>
          </button>

          <button
            onClick={() => handleSelectRole("freelancer")}
            disabled={loading}
            className="group relative bg-card-bg border-2 border-card-border rounded-2xl p-8 text-center hover:border-indigo-400 hover:shadow-lg transition-all disabled:opacity-50"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Freelancer</h2>
            <p className="text-sm text-muted-fg">Quiero ofrecer mis servicios y trabajar como freelancer</p>
          </button>
        </div>
      </div>
    </div>
  )
}
