import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Chatbot from "@/components/ChatbotLazy"
import PageTransition from "@/components/PageTransition"
import { Providers } from "./providers"
import { AuthProvider } from "@/contexts/AuthContext"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FreelanceHub - Conectando Talento Centroamericano",
    template: "%s | FreelanceHub",
  },
  description:
    "La plataforma líder para conectar talento freelance con proyectos innovadores en Centroamérica.",
  openGraph: {
    siteName: "FreelanceHub",
    type: "website",
    locale: "es_HN",
  },
  twitter: {
    card: "summary_large_image",
  },
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
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <Chatbot />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}
