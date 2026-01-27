"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Building2,
  Users,
  Camera,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  LogOut,
  MapPin,
  Clock,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { logout, getUser } from "@/lib/auth"
import { CompaniesTable } from "./companies-table"
import { SupervisoresTable } from "./users-table"
import { CamerasTable } from "./cameras-table"
import { StatsCards } from "./stats-cards"
import { initializeStorage } from "@/lib/storage"
import { obtenerDashboardOverview } from "@/servicios/dashboard"

import logo from "@/components/imagenes/logo_web.png"


// ===============================
// 🕒 FUNCIÓN CORRECTA DE TIEMPO
// ===============================
function tiempoTranscurrido(fechaISO: string) {
  const ahora = new Date()
  const fecha = new Date(fechaISO)

  const diffMs = ahora.getTime() - fecha.getTime()
  const minutos = Math.floor(diffMs / 60000)
  const horas = Math.floor(minutos / 60)
  const dias = Math.floor(horas / 24)

  if (dias > 0) return `Hace ${dias} día${dias > 1 ? "s" : ""}`
  if (horas > 0) return `Hace ${horas} h`
  if (minutos > 0) return `Hace ${minutos} min`
  return "Hace unos segundos"
}


export function AdminDashboard() {
  const user = getUser()

  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [overview, setOverview] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    initializeStorage()

    obtenerDashboardOverview().then((data) => {
      setOverview(data)
    })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* ================= HEADER ================= */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
                <Image src={logo} alt="Logo" width={24} height={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">SaveWorkIA</h1>
                <p className="text-xs text-muted-foreground">
                  Panel de Administrador
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 pl-3 border-l">
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {mounted ? (user?.name || "Usuario") : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Administrador
                  </p>
                </div>

                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {mounted && user?.name
                      ? user.name.charAt(0).toUpperCase()
                      : "A"}
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

      {/* ================= MAIN ================= */}
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

          {/* ================= OVERVIEW ================= */}
          <TabsContent value="overview" className="space-y-6">
            <StatsCards />

            <div className="grid gap-6 md:grid-cols-2">
              {/* ALERTAS */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Alertas Recientes
                  </CardTitle>
                  <CardDescription>
                    Alertas generadas recientemente
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {(overview?.alertas_recientes ?? []).length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No hay alertas recientes.
                    </p>
                  )}

                  {(overview?.alertas_recientes ?? []).map((alert: any) => (
                    <div
                      key={alert.id}
                      className="flex gap-3 p-3 border rounded-lg mb-3"
                    >
                      <div className="p-2 rounded-full bg-destructive/10">
                        <XCircle className="w-4 h-4 text-destructive" />
                      </div>

                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {alert.mensaje}
                        </p>

                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alert.empresa}
                          </span>

                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {tiempoTranscurrido(alert.fecha)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* ESTADO SISTEMA */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    Estado del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {overview &&
                    Object.entries(overview.estado_sistema).map(
                      ([name, status]: any) => (
                        <div key={name} className="flex justify-between">
                          <p className="text-sm">{name}</p>
                          <Badge>{status}</Badge>
                        </div>
                      )
                    )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="companies">
            <CompaniesTable />
          </TabsContent>

          <TabsContent value="users">
            <SupervisoresTable />
          </TabsContent>

          <TabsContent value="cameras">
            <CamerasTable />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
