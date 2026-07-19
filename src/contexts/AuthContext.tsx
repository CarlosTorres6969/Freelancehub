"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import type { Profile } from "@/types"
export interface AuthUser { id: string; email: string }

interface AuthContextType {
  user: AuthUser | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const loadSession = useCallback(async () => {
    const response = await fetch("/api/auth/session", { cache: "no-store" })
    const data = response.ok ? await response.json() : { user: null, profile: null }
    setUser(data.user)
    setProfile(data.profile)
  }, [])

  useEffect(() => {
    loadSession().finally(() => setLoading(false))
  }, [loadSession])

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    setProfile(null)
  }

  async function refreshProfile() {
    if (user) await loadSession()
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
