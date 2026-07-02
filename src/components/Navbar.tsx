"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Rocket,
  Search,
  User,
  X,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useFavorites } from "@/contexts/FavoritesContext"
import AuthModal from "./AuthModal"
import NotificationBell from "./NotificationBell"
import ThemeToggle from "./ThemeToggle"

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/how-it-works", label: "Cómo funciona" },
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
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link href="/" className="group flex items-center gap-3" onClick={() => setMenuOpen(false)}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-white shadow-lg shadow-violet-500/20 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
                <Rocket className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <span className="leading-tight">
                <span className="block text-base font-bold tracking-normal text-foreground">FreelanceHub</span>
                <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-muted-fg">Talent OS</span>
              </span>
            </Link>

            <div className="hidden items-center gap-1 rounded-full border border-card-border bg-card-bg/60 p-1 backdrop-blur md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-muted-fg transition-colors hover:bg-accent hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <ThemeToggle />
              <Link
                href="/favorites"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-card-bg/80 text-muted-fg backdrop-blur transition-colors hover:text-foreground"
                aria-label="Favoritos"
                title="Favoritos"
              >
                <Heart className="h-5 w-5" strokeWidth={1.8} />
                {favorites.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <NotificationBell />

              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-violet-500 to-rose-400 text-xs font-bold text-white shadow-lg shadow-violet-500/20 transition-transform hover:scale-105"
                    aria-label="Abrir perfil"
                  >
                    {initials}
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-card-border bg-card-bg shadow-2xl shadow-black/10 backdrop-blur-xl animate-scale-in">
                      <div className="border-b border-card-border p-4">
                        <p className="truncate text-sm font-semibold text-foreground">{profile?.name ?? user.email}</p>
                        <p className="truncate text-xs text-muted-fg">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                        >
                          <User className="h-4 w-4" strokeWidth={1.8} />
                          Mi perfil
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                        >
                          <LayoutDashboard className="h-4 w-4" strokeWidth={1.8} />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => { signOut(); setProfileOpen(false) }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-danger transition-colors hover:bg-danger/10"
                        >
                          <LogOut className="h-4 w-4" strokeWidth={1.8} />
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-black/10 transition-transform hover:scale-[1.02]"
                >
                  <User className="h-4 w-4" strokeWidth={1.8} />
                  Entrar
                </button>
              )}
            </div>

            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-card-bg/80 text-muted-fg backdrop-blur transition-colors hover:text-foreground md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden">
              <div className="mb-4 rounded-2xl border border-card-border bg-card-bg/90 p-3 shadow-2xl shadow-black/10 backdrop-blur-xl animate-fade-in">
                <div className="mb-3 flex items-center justify-between gap-3 border-b border-card-border pb-3">
                  <ThemeToggle />
                  <div className="flex items-center gap-2">
                    <Link
                      href="/favorites"
                      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-muted-fg"
                      onClick={() => setMenuOpen(false)}
                      aria-label="Favoritos"
                    >
                      <Heart className="h-5 w-5" strokeWidth={1.8} />
                      {favorites.length > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                          {favorites.length}
                        </span>
                      )}
                    </Link>
                    <NotificationBell />
                  </div>
                </div>

                <div className="grid gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-fg transition-colors hover:bg-accent hover:text-foreground"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.href === "/marketplace" ? <Search className="h-4 w-4" /> :
                        link.href === "/dashboard" ? <LayoutDashboard className="h-4 w-4" /> :
                        link.href === "/messages" ? <MessageSquare className="h-4 w-4" /> :
                        <Rocket className="h-4 w-4" />}
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/contact"
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-fg transition-colors hover:bg-accent hover:text-foreground"
                    onClick={() => setMenuOpen(false)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Contacto
                  </Link>
                </div>

                <div className="mt-3 border-t border-card-border pt-3">
                  {user ? (
                    <button
                      onClick={() => { signOut(); setMenuOpen(false) }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  ) : (
                    <button
                      onClick={() => { setAuthOpen(true); setMenuOpen(false) }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background"
                    >
                      <User className="h-4 w-4" />
                      Entrar a FreelanceHub
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
