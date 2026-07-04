"use client"

import { createContext, useContext, useState, useCallback } from "react"

export interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info" | "warning"
}

const ToastContext = createContext<{
  toasts: Toast[]
  addToast: (message: string, type?: Toast["type"]) => void
  removeToast: (id: string) => void
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message: string, type: Toast["type"] = "success") => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => removeToast(id), 3500)
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-in-up ${
              toast.type === "success"
                ? "bg-emerald-600 text-white"
                : toast.type === "error"
                ? "bg-red-600 text-white"
                : toast.type === "warning"
                ? "bg-amber-500 text-white"
                : "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
            }`}
          >
            <span>
              {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : toast.type === "warning" ? "⚠" : "ℹ"}
            </span>
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
