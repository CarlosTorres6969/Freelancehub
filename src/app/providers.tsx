"use client"

import { ThemeProvider } from "@/contexts/ThemeContext"
import { NotificationProvider } from "@/contexts/NotificationContext"
import { FavoritesProvider } from "@/contexts/FavoritesContext"
import { ToastProvider } from "@/contexts/ToastContext"
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
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
  )
}
