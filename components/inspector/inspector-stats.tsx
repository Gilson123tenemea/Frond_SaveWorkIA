"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { obtenerDashboardInspector } from "@/servicios/dashboardInspector"

interface InspectorStatsProps {
  inspectorId: number | null

}
interface DashboardData {
  zonas_asignadas: number
  trabajadores: number
  alertas_hoy: number
  alertas_mes: number
  incumplimientos_alta: number
  camaras_totales: number
  camaras_activas: number
}
export function InspectorStats({ inspectorId }: InspectorStatsProps) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!inspectorId) {
      setLoading(false)
      return
    }
    async function cargarDashboard() {
      try {
        setLoading(true)
        setError(null)
        // TypeScript sabe que aquí inspectorId no es null por el if de arriba
        const res = await obtenerDashboardInspector(inspectorId!)
        setData(res as DashboardData)
      } catch (error) {
        console.error("❌ Error dashboard inspector:", error)
        setError("No se pudo cargar el dashboard")
      } finally {
        setLoading(false)
      }
    }

    cargarDashboard()
  }, [inspectorId])
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="py-10 text-center text-muted-foreground">
              Cargando...
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-4">
        <Card>
          <CardContent className="py-10 text-center text-destructive">
            {error}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Alertas Hoy */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Alertas Hoy</CardTitle>
          <AlertTriangle className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.alertas_hoy}</div>
        </CardContent>
      </Card>

      {/* Total Alertas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Alertas</CardTitle>
          <ClipboardCheck className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.alertas_mes}</div>
          <p className="text-xs text-muted-foreground mt-1">Este mes</p>
        </CardContent>
      </Card>

      {/* Trabajadores */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Trabajadores</CardTitle>
          <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.trabajadores}</div>
          <p className="text-xs text-muted-foreground mt-1">
            En {data.zonas_asignadas}{" "}
            {data.zonas_asignadas === 1 ? "zona" : "zonas"}
          </p>
        </CardContent>
      </Card>

      {/* Incumplimientos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Incumplimientos</CardTitle>
          <XCircle className="w-4 h-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {data.incumplimientos_alta}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Alta prioridad
          </p>
        </CardContent>
      </Card>
    </div>
  )
}