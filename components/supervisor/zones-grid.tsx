"use client"

import { useState, useEffect } from "react"
// </CHANGE>
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Camera, AlertTriangle, Settings } from "lucide-react"
import { getZones, getUsers, getZoneWorkerStats, type Zone } from "@/lib/storage"
import { getUser } from "@/lib/auth"
import { ZoneDetailsDialog } from "./zone-details-dialog"
// </CHANGE>

export function ZonesGrid() {
  const currentUser = getUser()
  const [zones, setZones] = useState<Zone[]>([])
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    const users = getUsers()
    const supervisorUser = users.find((u) => u.email === currentUser?.email)
    if (supervisorUser?.companyId) {
      const allZones = getZones()
      const companyZones = allZones.filter((z) => z.companyId === supervisorUser.companyId)
      setZones(companyZones)
    }
  }, [currentUser])

  const getZoneStatus = (zoneId: number): "safe" | "alert" | "warning" => {
    const stats = getZoneWorkerStats()
    const zoneStat = stats.find((s) => s.zoneId === zoneId)
    if (zoneStat && zoneStat.nonCompliantWorkers > 3) return "alert"
    if (zoneStat && zoneStat.nonCompliantWorkers > 0) return "warning"
    return "safe"
  }

  const getZoneAlerts = (zoneId: number): number => {
    const stats = getZoneWorkerStats()
    const zoneStat = stats.find((s) => s.zoneId === zoneId)
    return zoneStat?.nonCompliantWorkers || 0
  }

  const getZoneWorkers = (zoneId: number): number => {
    const stats = getZoneWorkerStats()
    const zoneStat = stats.find((s) => s.zoneId === zoneId)
    return zoneStat?.totalWorkers || 0
  }

  const handleViewDetails = (zone: Zone) => {
    setSelectedZone(zone)
    setDetailsOpen(true)
  }
  // </CHANGE>

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Zonas de Trabajo</CardTitle>
                <CardDescription>Áreas asignadas para supervisión</CardDescription>
              </div>
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Configurar Zonas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {zones.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">No hay zonas registradas para tu empresa</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {zones.map((zone) => {
                  const status = getZoneStatus(zone.id)
                  const alerts = getZoneAlerts(zone.id)
                  const workers = getZoneWorkers(zone.id)

                  return (
                    <Card
                      key={zone.id}
                      className={`${
                        status === "alert"
                          ? "border-destructive"
                          : status === "warning"
                            ? "border-yellow-500"
                            : "border-border"
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-2 rounded-lg ${
                                status === "alert"
                                  ? "bg-destructive/10"
                                  : status === "warning"
                                    ? "bg-yellow-500/10"
                                    : "bg-success/10"
                              }`}
                            >
                              <MapPin
                                className={`w-4 h-4 ${
                                  status === "alert"
                                    ? "text-destructive"
                                    : status === "warning"
                                      ? "text-yellow-600"
                                      : "text-success"
                                }`}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">{zone.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)}
                              </p>
                            </div>
                          </div>
                          {alerts > 0 && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {alerts}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>Trabajadores</span>
                          </div>
                          <span className="font-semibold">{workers}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Camera className="w-4 h-4" />
                            <span>Cámaras</span>
                          </div>
                          <span className="font-semibold">{zone.cameras}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 bg-transparent"
                          onClick={() => handleViewDetails(zone)}
                        >
                          Ver Detalles
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
            {/* </CHANGE> */}
          </CardContent>
        </Card>
      </div>

      <ZoneDetailsDialog open={detailsOpen} onClose={() => setDetailsOpen(false)} zone={selectedZone} />
      {/* </CHANGE> */}
    </>
  )
}
