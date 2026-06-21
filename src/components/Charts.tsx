"use client"

import { useMemo } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line, Bar, Doughnut } from "react-chartjs-2"
import type { Order, Category } from "@/types"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler)

ChartJS.defaults.color = "#a1a1aa"
ChartJS.defaults.borderColor = "rgba(0,0,0,0.06)"

function groupByMonth(items: { created_at: string }[], monthsBack: number) {
  const groups: Record<string, number> = {}
  const now = new Date()
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    groups[key] = 0
  }
  for (const item of items) {
    const d = new Date(item.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (key in groups) groups[key]++
  }
  return Object.values(groups)
}

function groupRevenueByMonth(orders: Order[], monthsBack: number) {
  const groups: Record<string, number> = {}
  const now = new Date()
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    groups[key] = 0
  }
  for (const o of orders) {
    if (o.status === "completed") {
      const d = new Date(o.created_at)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      if (key in groups) groups[key] += o.total
    }
  }
  return Object.values(groups)
}

const monthLabels = (monthsBack: number) => {
  const labels: string[] = []
  const now = new Date()
  const names = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    labels.push(names[d.getMonth()])
  }
  return labels
}

export function IncomeChart({ orders }: { orders: Order[] }) {
  const data = useMemo(() => ({
    labels: monthLabels(6),
    datasets: [
      {
        label: "Ingresos",
        data: groupRevenueByMonth(orders, 6),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#6366f1",
      },
    ],
  }), [orders])

  return (
    <div className="p-5 rounded-xl border border-card-border bg-card-bg">
      <h3 className="text-sm font-semibold text-foreground mb-4">Ingresos Mensuales</h3>
      <Line data={data} options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "rgba(0,0,0,0.06)" }, ticks: { callback: (v: string | number) => `L ${v}` } },
        },
      }} />
    </div>
  )
}

export function ProjectsChart({ orders }: { orders: Order[] }) {
  const data = useMemo(() => ({
    labels: monthLabels(6),
    datasets: [
      {
        label: "Proyectos",
        data: groupByMonth(orders, 6),
        backgroundColor: "rgba(99, 102, 241, 0.7)",
        borderRadius: 6,
      },
    ],
  }), [orders])

  return (
    <div className="p-5 rounded-xl border border-card-border bg-card-bg">
      <h3 className="text-sm font-semibold text-foreground mb-4">Proyectos por Mes</h3>
      <Bar data={data} options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "rgba(0,0,0,0.06)" } },
        },
      }} />
    </div>
  )
}

export function CategoryChart({ categories, orders }: { categories: Category[]; orders: Order[] }) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const o of orders) {
      const catName = (o.service as any)?.category?.name ?? "Otros"
      counts[catName] = (counts[catName] || 0) + 1
    }
    if (Object.keys(counts).length === 0) {
      categories.forEach((c) => { counts[c.name] = 0 })
    }
    return {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: ["#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#22d3ee", "#14b8a6", "#f97316", "#8b5cf6"],
          borderWidth: 0,
        },
      ],
    }
  }, [categories, orders])

  return (
    <div className="p-5 rounded-xl border border-card-border bg-card-bg">
      <h3 className="text-sm font-semibold text-foreground mb-4">Distribución por Categoría</h3>
      <div className="flex justify-center">
        <Doughnut data={data} options={{
          responsive: true,
          plugins: {
            legend: {
              position: "bottom" as const,
              labels: { boxWidth: 12, padding: 12, font: { size: 11 } },
            },
          },
          cutout: "65%",
        }} />
      </div>
    </div>
  )
}
