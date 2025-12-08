"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Building2,
  Users,
  Camera,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Shield,
  LogOut,
  Settings,
  MapPin,
  Clock,
} from "lucide-react"
import { logout, getUser } from "@/lib/auth"
import { CompaniesTable } from "./companies-table"
import { SupervisoresTable } from "./users-table"
import { CamerasTable } from "./cameras-table"
import { StatsCards } from "./stats-cards"
import { initializeStorage } from "@/lib/storage"

import { obtenerDashboardOverview } from "@/servicios/dashboard"   // <-- IMPORTANTE

export function AdminDashboard() {
  const user = getUser()
  const [activeTab, setActiveTab] = useState("overview")

  const [overview, setOverview] = useState<any>(null)

  useEffect(() => {
    initializeStorage()

    // 🔥 Cargar datos reales del backend
    obtenerDashboardOverview().then((data) => {
      setOverview(data)
    })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SaveWorkIA</h1>
                <p className="text-xs text-muted-foreground">Panel de Administrador</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3 pl-3 border-l">
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">Administrador</p>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Vista General
            </TabsTrigger>
            <TabsTrigger value="companies" className="gap-2">
              <Building2 className="w-4 h-4" />
              Empresas
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="cameras" className="gap-2">
              <Camera className="w-4 h-4" />
              Cámaras
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <StatsCards />

            <div className="grid gap-6 md:grid-cols-2">
              {/* Recent Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Alertas Recientes
                  </CardTitle>
                  <CardDescription>Detecciones de los últimos 30 minutos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(overview?.alertas_recientes ?? []).length === 0 && (
                      <p className="text-sm text-muted-foreground">No hay alertas recientes.</p>
                    )}

                    {(overview?.alertas_recientes ?? []).map((alert: any) => (
                      <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div
                          className={`p-2 rounded-full ${alert.nivel === "high"
                              ? "bg-destructive/10"
                              : alert.nivel === "medium"
                                ? "bg-yellow-500/10"
                                : "bg-blue-500/10"
                            }`}
                        >
                          {alert.nivel === "high" ? (
                            <XCircle className="w-4 h-4 text-destructive" />
                          ) : alert.nivel === "medium" ? (
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-blue-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="font-medium text-sm">{alert.mensaje}</p>
                            <Badge variant="outline" className="shrink-0">
                              {alert.nivel}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {alert.empresa}   {/* <-- AHORA SÍ MUESTRA LA EMPRESA */}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {alert.tiempo}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    Estado del Sistema
                  </CardTitle>
                  <CardDescription>Estado de servicios y componentes</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {overview &&
                      Object.entries(overview.estado_sistema).map(([name, status]: any) => (
                        <div key={name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rounded-full ${status === "online"
                                  ? "bg-success animate-pulse"
                                  : status === "warning"
                                    ? "bg-yellow-500 animate-pulse"
                                    : "bg-destructive"
                                }`}
                            />
                            <div>
                              <p className="font-medium text-sm">{name}</p>
                              <p className="text-xs text-muted-foreground">Estado actual</p>
                            </div>
                          </div>

                          <Badge
                            variant={
                              status === "online"
                                ? "default"
                                : status === "warning"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {status}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies">
            <CompaniesTable />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <SupervisoresTable />
          </TabsContent>

          {/* Cameras Tab */}
          <TabsContent value="cameras">
            <CamerasTable />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
