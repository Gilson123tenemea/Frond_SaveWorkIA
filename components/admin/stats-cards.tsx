"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Camera, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { obtenerDashboardOverview } from "@/servicios/dashboard"

export function StatsCards() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    obtenerDashboardOverview().then(setStats)
  }, [])

  if (!stats) return <p>Cargando estadísticas...</p>

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

      {/* EMPRESAS */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Empresas</CardTitle>
          <Building2 className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_empresas}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-success">+3</span> este mes
          </p>
        </CardContent>
      </Card>

      {/* USUARIOS ACTIVOS */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
          <Users className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.usuarios_activos}</div>
        </CardContent>
      </Card>

      {/* CÁMARAS ACTIVAS */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Cámaras Activas</CardTitle>
          <Camera className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.camaras_activas}/{stats.camaras_totales}
          </div>
        </CardContent>
      </Card>

      {/* ALERTAS HOY */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Alertas Hoy</CardTitle>
          <AlertTriangle className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.alertas_hoy}</div>
        </CardContent>
      </Card>

    </div>
  )
}
