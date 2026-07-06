"use client"

// global-error reemplaza el layout raíz cuando el propio layout falla,
// por eso debe renderizar sus propios <html> y <body>.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "Inter, Segoe UI, Arial, sans-serif", display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", margin: 0, background: "#080710", color: "#fbf7ff" }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>Error crítico</h1>
          <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>La aplicación encontró un problema grave.</p>
          <button
            onClick={reset}
            style={{ padding: "0.75rem 1.5rem", borderRadius: "0.5rem", border: "none", background: "linear-gradient(115deg,#4c2fd6,#e14884,#08b6d6)", color: "white", fontWeight: 700, cursor: "pointer" }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  )
}
