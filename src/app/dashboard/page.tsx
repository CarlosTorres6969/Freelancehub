"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function DashboardRedirect() {
  const { profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!profile) {
      router.replace("/?auth=login")
      return
    }
    if (profile.role === "freelancer") {
      router.replace("/dashboard/freelancer")
    } else {
      router.replace("/dashboard/client")
    }
  }, [profile, loading, router])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-64 bg-muted rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded-2xl" />
          ))}
        </div>
        <div className="h-80 bg-muted rounded-2xl" />
      </div>
    </div>
  )
}
