"use client"

import { LazyMotion, domAnimation } from "motion/react"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { NotificationProvider } from "@/contexts/NotificationContext"
import { FavoritesProvider } from "@/contexts/FavoritesContext"
import { ToastProvider } from "@/contexts/ToastContext"
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // strict: obliga a usar <m.*> (bundle reducido) en vez de <motion.*> (bundle completo)
    <LazyMotion features={domAnimation} strict>
      <ThemeProvider>
        <NotificationProvider>
          <FavoritesProvider>
            <ToastProvider>
              <RecentlyViewedProvider>
                {children}
              </RecentlyViewedProvider>
            </ToastProvider>
          </FavoritesProvider>
        </NotificationProvider>
      </ThemeProvider>
    </LazyMotion>
  )
}
