import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Chatbot from "@/components/Chatbot"
import { Providers } from "./providers"
import { AuthProvider } from "@/contexts/AuthContext"

export const metadata: Metadata = {
  title: "FreelanceHub - Conectando Talento Centroamericano",
  description:
    "La plataforma líder para conectar talento freelance con proyectos innovadores en Centroamérica.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans transition-colors duration-200">
        <AuthProvider>
          <Providers>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Chatbot />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}
