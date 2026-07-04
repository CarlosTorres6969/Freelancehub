"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Rocket,
  ShieldCheck,
  User,
  X,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import AuthModal from "./AuthModal"
import NotificationBell from "./NotificationBell"
import ThemeToggle from "./ThemeToggle"
import { useFavorites } from "@/contexts/FavoritesContext"

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/how-it-works", label: "Cómo Funciona" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/messages", label: "Mensajes" },
]

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
      <nav className="sticky top-0 z-40 border-b border-card-border bg-nav-bg backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="group flex items-center gap-3" aria-label="FreelanceHub">
              <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/20 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-white shadow-lg shadow-violet-500/20">
                <Rocket className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.8} />
              </span>
              <span className="font-bold text-xl tracking-tight text-foreground">FreelanceHub</span>
            </Link>

            <div className="hidden md:flex items-center gap-1 rounded-lg border border-card-border bg-card-bg/70 p-1 shadow-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-fg transition-colors hover:bg-accent hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-1">
              <ThemeToggle />
              <Link
                href="/favorites"
                className="relative rounded-lg p-2 text-muted-fg transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Favoritos"
              >
                <Heart className="h-5 w-5" strokeWidth={1.8} />
                {favorites.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <NotificationBell />

              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-xs font-bold text-white shadow-lg shadow-violet-500/20 transition-transform hover:scale-105"
                    aria-label="Abrir menú de perfil"
                  >
                    {initials}
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-lg border border-card-border bg-card-bg shadow-xl animate-scale-in">
                      <div className="border-b border-card-border p-3">
                        <p className="truncate text-sm font-medium text-foreground">{profile?.name ?? user.email}</p>
                        <p className="truncate text-xs text-muted-fg">{user.email}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          href="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                        >
                          <User className="h-4 w-4" strokeWidth={1.8} />
                          Mi Perfil
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                        >
                          <LayoutDashboard className="h-4 w-4" strokeWidth={1.8} />
                          Dashboard
                        </Link>
                        {profile?.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-violet-600 transition-colors hover:bg-accent dark:text-violet-300"
                          >
                            <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
                            Admin
                          </Link>
                        )}
                        <button
                          onClick={() => { signOut(); setProfileOpen(false) }}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-500/10 dark:text-rose-300"
                        >
                          <LogOut className="h-4 w-4" strokeWidth={1.8} />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="btn-primary px-4 py-2 text-sm"
                >
                  Registrarse
                </button>
              )}
            </div>

            <button
              className="rounded-lg p-2 text-muted-fg transition-colors hover:bg-accent hover:text-foreground md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
            >
              {menuOpen ? <X className="h-6 w-6" strokeWidth={1.8} /> : <Menu className="h-6 w-6" strokeWidth={1.8} />}
            </button>
          </div>

          {menuOpen && (
            <div className="space-y-2 pb-4 md:hidden animate-fade-in">
              <div className="rounded-lg border border-card-border bg-card-bg p-2 shadow-lg">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-muted-fg hover:bg-accent hover:text-foreground"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/favorites" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-fg hover:bg-accent hover:text-foreground" onClick={() => setMenuOpen(false)}>Favoritos</Link>
                <Link href="/profile" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-fg hover:bg-accent hover:text-foreground" onClick={() => setMenuOpen(false)}>Perfil</Link>
                <Link href="/contact" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-fg hover:bg-accent hover:text-foreground" onClick={() => setMenuOpen(false)}>Contacto</Link>
              </div>

              {user ? (
                <button
                  onClick={() => { signOut(); setMenuOpen(false) }}
                  className="block w-full px-3 py-2 text-left text-sm font-medium text-rose-600 dark:text-rose-300"
                >
                  Cerrar Sesión
                </button>
              ) : (
                <button
                  onClick={() => { setAuthOpen(true); setMenuOpen(false) }}
                  className="btn-primary w-full px-3 py-2 text-sm"
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
