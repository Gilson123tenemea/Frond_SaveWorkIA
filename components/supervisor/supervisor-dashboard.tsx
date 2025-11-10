"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  Camera,
  MapPin,
  AlertTriangle,
  Shield,
  LogOut,
  Settings,
  HardHat,
  Eye,
  Building2,
  UserCheck,
  UserCog,
  Map,
} from "lucide-react"
import { logout, getUser } from "@/lib/auth"
import { WorkersTable } from "./workers-table"
import { ZonesGrid } from "./zones-grid"
import { LiveDetections } from "./live-detections"
import { SupervisorStats } from "./supervisor-stats"
import { InspectorsTable } from "./inspectors-table"
import { ZoneAssignmentsTable } from "./zone-assignments-table"
import { getCompanies, getUsers } from "@/lib/storage"
import { ZonesMapViewer } from "@/components/maps/zones-map-viewer"

export function SupervisorDashboard() {
  const user = getUser()
  const [activeTab, setActiveTab] = useState("overview")
  const [supervisorCompany, setSupervisorCompany] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<number | null>(null)

  useEffect(() => {
    const users = getUsers()
    const currentUser = users.find((u) => u.email === user?.email)
    if (currentUser?.companyId) {
      const companies = getCompanies()
      const company = companies.find((c) => c.id === currentUser.companyId)
      setSupervisorCompany(company?.name || null)
      setCompanyId(currentUser.companyId)
    }
  }, [user])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SaveWorkIA</h1>
                <p className="text-xs text-muted-foreground">Panel de Supervisor</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3 pl-3 border-l">
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">Supervisor</p>
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

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="gap-2">
              <Eye className="w-4 h-4" />
              Monitoreo
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <Map className="w-4 h-4" />
              Mapa
            </TabsTrigger>
            <TabsTrigger value="inspectors" className="gap-2">
              <UserCheck className="w-4 h-4" />
              Inspectores
            </TabsTrigger>
            <TabsTrigger value="assignments" className="gap-2">
              <UserCog className="w-4 h-4" />
              Asignaciones
            </TabsTrigger>
            <TabsTrigger value="workers" className="gap-2">
              <Users className="w-4 h-4" />
              Trabajadores
            </TabsTrigger>
            <TabsTrigger value="zones" className="gap-2">
              <MapPin className="w-4 h-4" />
              Zonas
            </TabsTrigger>
            <TabsTrigger value="detections" className="gap-2">
              <Camera className="w-4 h-4" />
              Detecciones IA
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {supervisorCompany && (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Empresa Asignada</CardTitle>
                      <p className="text-2xl font-bold text-primary mt-1">{supervisorCompany}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}

            <SupervisorStats />

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Trabajadores en Turno
                  </CardTitle>
                  <CardDescription>Personal activo actualmente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ACTIVE_WORKERS.map((worker) => (
                      <div key={worker.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{worker.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {worker.zone}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={worker.status === "safe" ? "default" : "destructive"}>
                            {worker.status === "safe" ? "Seguro" : "Alerta"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Alertas Recientes
                  </CardTitle>
                  <CardDescription>Últimas detecciones de riesgo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {RECENT_ALERTS.map((alert) => (
                      <div key={alert.id} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <div
                              className={`p-1.5 rounded-full mt-0.5 ${
                                alert.severity === "high" ? "bg-destructive/10" : "bg-yellow-500/10"
                              }`}
                            >
                              <HardHat
                                className={`w-3.5 h-3.5 ${
                                  alert.severity === "high" ? "text-destructive" : "text-yellow-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{alert.message}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{alert.worker}</p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">{alert.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {alert.zone}
                          </div>
                          <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Vista de Cámaras en Vivo
                </CardTitle>
                <CardDescription>Monitoreo en tiempo real de zonas críticas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {CAMERA_FEEDS.map((camera) => (
                    <div key={camera.id} className="relative group">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={`/.jpg?height=200&width=350&query=${camera.location}`}
                          alt={camera.location}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium text-sm">{camera.name}</p>
                              <p className="text-white/80 text-xs">{camera.location}</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                              <span className="text-white text-xs">En vivo</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Ver Completo
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Mapa de Zonas
                </CardTitle>
                <CardDescription>
                  Visualiza todas las zonas de la empresa con indicadores de incumplimientos diarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                {companyId ? (
                  <ZonesMapViewer companyId={companyId} />
                ) : (
                  <div className="w-full h-[500px] bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">No hay empresa asignada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inspectors">
            <InspectorsTable />
          </TabsContent>

          <TabsContent value="assignments">
            <ZoneAssignmentsTable />
          </TabsContent>

          <TabsContent value="workers">
            <WorkersTable />
          </TabsContent>

          <TabsContent value="zones">
            <ZonesGrid />
          </TabsContent>

          <TabsContent value="detections">
            <LiveDetections />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

const ACTIVE_WORKERS = [
  { id: 1, name: "Pedro García", zone: "Zona A - Almacén", status: "safe" as const },
  { id: 2, name: "Luis Mendoza", zone: "Zona B - Producción", status: "alert" as const },
  { id: 3, name: "Ana Torres", zone: "Zona C - Montaje", status: "safe" as const },
  { id: 4, name: "Carlos Ruiz", zone: "Zona A - Almacén", status: "safe" as const },
]

const RECENT_ALERTS = [
  {
    id: 1,
    severity: "high" as const,
    message: "Casco de seguridad no detectado",
    worker: "Luis Mendoza",
    zone: "Zona B - Producción",
    time: "Hace 3 min",
  },
  {
    id: 2,
    severity: "medium" as const,
    message: "Chaleco reflectante no detectado",
    worker: "Marco Silva",
    zone: "Zona D - Exterior",
    time: "Hace 12 min",
  },
  {
    id: 3,
    severity: "high" as const,
    message: "Ingreso a zona restringida",
    worker: "Roberto Díaz",
    zone: "Zona E - Área Restringida",
    time: "Hace 18 min",
  },
]

const CAMERA_FEEDS = [
  { id: 1, name: "CAM-A01", location: "Almacén Principal" },
  { id: 2, name: "CAM-B03", location: "Línea de Producción" },
  { id: 3, name: "CAM-C02", location: "Zona de Montaje" },
  { id: 4, name: "CAM-D01", location: "Área Exterior" },
  { id: 5, name: "CAM-E01", location: "Zona Restringida" },
  { id: 6, name: "CAM-A02", location: "Zona de Carga" },
]
