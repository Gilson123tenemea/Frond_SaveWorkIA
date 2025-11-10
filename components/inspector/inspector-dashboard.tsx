"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, FileText, AlertTriangle, Shield, LogOut, Settings, Users } from "lucide-react"
import { logout, getUser } from "@/lib/auth"
import { ReportsList } from "./reports-list"
import { InspectorStats } from "./inspector-stats"
import { WorkerAlertsList } from "./worker-alerts-list"
import { getZonesByInspector, getWorkerAlerts } from "@/lib/storage"
import { NotificationsPopover } from "./notifications-popover"

export function InspectorDashboard() {
  const user = getUser()
  const [activeTab, setActiveTab] = useState("overview")

  const assignedZones = user ? getZonesByInspector(user.id) : []
  const alerts = getWorkerAlerts()
  const unreadAlerts = alerts.filter((a) => a.status === "pending").length

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
                <p className="text-xs text-muted-foreground">Panel de Inspector</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NotificationsPopover unreadCount={unreadAlerts} />
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3 pl-3 border-l">
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">Inspector de Seguridad</p>
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
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="gap-2">
              <MapPin className="w-4 h-4" />
              Mi Zona
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="w-4 h-4" />
              Reportes
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Alertas
              {unreadAlerts > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unreadAlerts}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - My Zone */}
          <TabsContent value="overview" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Mi Zona Asignada</h2>
              <p className="text-muted-foreground">Información de la zona bajo tu supervisión</p>
            </div>

            <InspectorStats />

            <div className="grid gap-6 lg:grid-cols-2">
              {assignedZones.length > 0 ? (
                assignedZones.map((zone) => {
                  const zoneWorkers = alerts.filter((a) => a.zoneId === zone.id)
                  const totalWorkers = 15 // Mock data
                  const activeWorkers = 12 // Mock data

                  return (
                    <Card key={zone.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                              <MapPin className="w-6 h-6 text-success" />
                            </div>
                            <div>
                              <CardTitle>{zone.name}</CardTitle>
                              <CardDescription>{zone.company}</CardDescription>
                            </div>
                          </div>
                          <Badge variant={zone.status === "active" ? "default" : "secondary"}>
                            {zone.status === "active" ? "Activa" : "Inactiva"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Coordenadas</p>
                            <p className="text-sm font-medium">
                              {zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Cámaras</p>
                            <p className="text-sm font-medium">{zone.cameras} activas</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Trabajadores</span>
                            </div>
                            <span className="text-2xl font-bold">{totalWorkers}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Activos ahora</span>
                              <span className="font-medium text-success">{activeWorkers}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Incumplimientos hoy</span>
                              <span className="font-medium text-destructive">{zoneWorkers.length}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <Card className="lg:col-span-2">
                  <CardContent className="py-12 text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No tienes zonas asignadas actualmente</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <ReportsList />
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <WorkerAlertsList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
