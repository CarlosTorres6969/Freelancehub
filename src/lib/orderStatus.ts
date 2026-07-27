export const statusStyles: Record<string, string> = {
  completed: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
  in_progress: "bg-cyan-500/12 text-cyan-600 dark:text-cyan-300",
  delivered: "bg-violet-500/12 text-violet-600 dark:text-violet-300",
  pending: "bg-amber-500/14 text-amber-700 dark:text-amber-300",
  cancelled: "bg-rose-500/12 text-rose-600 dark:text-rose-300",
  disputed: "bg-orange-500/14 text-orange-700 dark:text-orange-300",
}

export const statusLabels: Record<string, string> = {
  completed: "Completado",
  in_progress: "En progreso",
  delivered: "Entregado",
  pending: "Pendiente",
  cancelled: "Cancelado",
  disputed: "En disputa",
}
