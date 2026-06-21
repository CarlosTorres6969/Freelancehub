"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import AuthModal from "./AuthModal"
import NotificationBell from "./NotificationBell"
import ThemeToggle from "./ThemeToggle"
import { useFavorites } from "@/contexts/FavoritesContext"

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { favorites } = useFavorites()
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "?"

  return (
    <>
      <nav className="border-b border-card-border bg-nav-bg backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <span className="font-bold text-xl text-foreground">FreelanceHub</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-muted-fg hover:text-foreground transition-colors">
                Inicio
              </Link>
              <Link href="/marketplace" className="text-sm font-medium text-muted-fg hover:text-foreground transition-colors">
                Marketplace
              </Link>
              <Link href="/how-it-works" className="text-sm font-medium text-muted-fg hover:text-foreground transition-colors">
                Cómo Funciona
              </Link>
              <Link href="/dashboard" className="text-sm font-medium text-muted-fg hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/messages" className="text-sm font-medium text-muted-fg hover:text-foreground transition-colors">
                Mensajes
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-1">
              <ThemeToggle />
              <Link
                href="/favorites"
                className="relative p-2 rounded-lg text-muted-fg hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Favoritos"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {favorites.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <NotificationBell />

              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    {initials}
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-card-border bg-card-bg shadow-xl overflow-hidden animate-scale-in">
                      <div className="p-3 border-b border-card-border">
                        <p className="text-sm font-medium text-foreground truncate">{profile?.name ?? user.email}</p>
                        <p className="text-xs text-muted-fg truncate">{user.email}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          href="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          Mi Perfil
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                          Dashboard
                        </Link>
                        <button
                          onClick={() => { signOut(); setProfileOpen(false) }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  Registrarse
                </button>
              )}
            </div>

            <button
              className="md:hidden p-2 text-muted-fg"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <Link href="/" className="block px-3 py-2 text-sm font-medium text-muted-fg hover:text-foreground" onClick={() => setMenuOpen(false)}>Inicio</Link>
              <Link href="/marketplace" className="block px-3 py-2 text-sm font-medium text-muted-fg hover:text-foreground" onClick={() => setMenuOpen(false)}>Marketplace</Link>
              <Link href="/how-it-works" className="block px-3 py-2 text-sm font-medium text-muted-fg hover:text-foreground" onClick={() => setMenuOpen(false)}>Cómo Funciona</Link>
              <Link href="/dashboard" className="block px-3 py-2 text-sm font-medium text-muted-fg hover:text-foreground" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link href="/messages" className="block px-3 py-2 text-sm font-medium text-muted-fg hover:text-foreground" onClick={() => setMenuOpen(false)}>Mensajes</Link>
              <Link href="/favorites" className="block px-3 py-2 text-sm font-medium text-muted-fg hover:text-foreground" onClick={() => setMenuOpen(false)}>Favoritos</Link>
              <Link href="/profile" className="block px-3 py-2 text-sm font-medium text-muted-fg hover:text-foreground" onClick={() => setMenuOpen(false)}>Perfil</Link>
              <Link href="/contact" className="block px-3 py-2 text-sm font-medium text-muted-fg hover:text-foreground" onClick={() => setMenuOpen(false)}>Contacto</Link>
              <hr className="border-card-border my-2" />
              {user ? (
                <button
                  onClick={() => { signOut(); setMenuOpen(false) }}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-red-600"
                >
                  Cerrar Sesión
                </button>
              ) : (
                <button
                  onClick={() => { setAuthOpen(true); setMenuOpen(false) }}
                  className="block w-full text-left px-3 py-2 text-sm font-medium bg-foreground text-background rounded-lg"
                >
                  Registrarse
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
