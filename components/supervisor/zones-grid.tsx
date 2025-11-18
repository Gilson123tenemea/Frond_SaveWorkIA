"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Camera, UserCheck, Settings } from "lucide-react"
import { ZoneDetailsDialog } from "./zone-details-dialog"
import { ZoneWorkersDialog } from "./zone-workers-dialog"

import { listarZonasDetallesPorSupervisor } from "@/servicios/trabajador_zona"
import { getUser } from "@/lib/auth"

export function ZonesGrid() {
  const [zones, setZones] = useState<any[]>([])
  const [selectedZone, setSelectedZone] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [workersOpen, setWorkersOpen] = useState(false)

  // ================================
  // 🔥 CARGAR ZONAS DEL BACKEND
  // ================================
  useEffect(() => {
    const user = getUser()
    const idSupervisor = user?.id_supervisor

    if (!idSupervisor) return

    listarZonasDetallesPorSupervisor(idSupervisor)
      .then((data) => {
        const formatted = data.map((item: any) => ({
          id: item.zona.id,
          name: item.zona.nombre,
          latitude: parseFloat(item.zona.latitud),
          longitude: parseFloat(item.zona.longitud),
          cameras: item.total_camaras,
          workers: item.total_trabajadores,

          inspector: {
            name: `${item.inspector?.nombre || "Sin"} ${item.inspector?.apellido || "Inspector"}`,
            email: item.inspector?.cedula || "N/A"
          },

          alerts: 0, // Puedes mejorar luego
          status:
            item.total_camaras === 0 && item.total_trabajadores === 0
              ? "safe"
              : item.total_camaras <= 1
              ? "warning"
              : "alert"
        }))

        setZones(formatted)
      })
      .catch((err) => console.error("Error cargando zonas:", err))
  }, [])

  const handleViewDetails = (zone: any) => {
    setSelectedZone(zone)
    setDetailsOpen(true)
  }

  const handleManageWorkers = (zone: any) => {
    setSelectedZone(zone)
    setWorkersOpen(true)
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Zonas de Trabajo</CardTitle>
                <CardDescription>Gestiona las zonas de tu empresa</CardDescription>
              </div>
              <Badge variant="outline">{zones.length} zonas</Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {zones.map((zone) => (
                <Card
                  key={zone.id}
                  className={`relative overflow-hidden hover:shadow-lg transition-all ${
                    zone.status === "alert"
                      ? "border-destructive/50 bg-destructive/5"
                      : zone.status === "warning"
                      ? "border-yellow-500/50 bg-yellow-500/10"
                      : "border-border"
                  }`}
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 ${
                      zone.status === "alert"
                        ? "bg-destructive"
                        : zone.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-success"
                    }`}
                  />

                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-xl ${
                          zone.status === "alert"
                            ? "bg-destructive/20 text-destructive"
                            : zone.status === "warning"
                            ? "bg-yellow-500/20 text-yellow-600"
                            : "bg-success/20 text-success"
                        }`}
                      >
                        <MapPin className="w-5 h-5" />
                      </div>

                      <div>
                        <h3 className="font-semibold">{zone.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="p-3 rounded-lg bg-muted/50 border">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Inspector</span>
                      </div>
                      <p className="font-medium text-sm">{zone.inspector.name}</p>
                      <p className="text-xs text-muted-foreground">{zone.inspector.email}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg border">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <p className="text-2xl font-bold">{zone.workers}</p>
                      </div>
                      <div className="p-3 rounded-lg border">
                        <Camera className="w-4 h-4 text-muted-foreground" />
                        <p className="text-2xl font-bold">{zone.cameras}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => handleManageWorkers(zone)}>
                        <Settings className="w-4 h-4 mr-1" />
                        Configurar
                      </Button>

                      <Button onClick={() => handleViewDetails(zone)}>
                        Ver detalles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <ZoneDetailsDialog open={detailsOpen} onClose={() => setDetailsOpen(false)} zone={selectedZone} />
      <ZoneWorkersDialog open={workersOpen} onClose={() => setWorkersOpen(false)} zone={selectedZone} />
    </>
  )
}
