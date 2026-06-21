"use client"

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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler)

const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"]

const lineData = {
  labels: months,
  datasets: [
    {
      label: "Ingresos 2026",
      data: [12000, 21000, 18000, 32000, 28000, 41000],
      borderColor: "#6366f1",
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "#6366f1",
    },
  ],
}

const lineOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#a1a1aa" } },
    y: { grid: { color: "rgba(0,0,0,0.06)" }, ticks: { color: "#a1a1aa", callback: (v: string | number) => `L ${v}` } },
  },
}

const barData = {
  labels: months,
  datasets: [
    {
      label: "Proyectos",
      data: [8, 12, 10, 15, 13, 18],
      backgroundColor: "rgba(99, 102, 241, 0.7)",
      borderRadius: 6,
    },
  ],
}

const barOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#a1a1aa" } },
    y: { grid: { color: "rgba(0,0,0,0.06)" }, ticks: { color: "#a1a1aa" } },
  },
}

const doughnutData = {
  labels: ["Desarrollo Web", "Diseño Gráfico", "Marketing", "Contenido", "Otros"],
  datasets: [
    {
      data: [35, 25, 20, 12, 8],
      backgroundColor: ["#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#22d3ee"],
      borderWidth: 0,
    },
  ],
}

const doughnutOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: { color: "#a1a1aa", boxWidth: 12, padding: 12, font: { size: 11 } },
    },
  },
  cutout: "65%",
}

export function IncomeChart() {
  return (
    <div className="p-5 rounded-xl border border-card-border bg-card-bg">
      <h3 className="text-sm font-semibold text-foreground mb-4">Ingresos Mensuales</h3>
      <Line data={lineData} options={lineOptions} />
    </div>
  )
}

export function ProjectsChart() {
  return (
    <div className="p-5 rounded-xl border border-card-border bg-card-bg">
      <h3 className="text-sm font-semibold text-foreground mb-4">Proyectos por Mes</h3>
      <Bar data={barData} options={barOptions} />
    </div>
  )
}

export function CategoryChart() {
  return (
    <div className="p-5 rounded-xl border border-card-border bg-card-bg">
      <h3 className="text-sm font-semibold text-foreground mb-4">Distribución por Categoría</h3>
      <div className="flex justify-center">
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
    </div>
  )
}
