"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Camera, AlertTriangle } from "lucide-react"
import { ZoneManagementDialog } from "@/components/shared/zone-management-dialog"

export default function ZonesPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Zonas</h1>
            <p className="text-muted-foreground">Configuración y monitoreo de áreas de trabajo</p>
          </div>
          <ZoneManagementDialog />
        </div>

        {/* Zones Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ALL_ZONES.map((zone) => (
            <Card key={zone.id} className={`${zone.alerts > 0 ? "border-destructive" : "border-border"}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        zone.riskLevel === "high"
                          ? "bg-destructive/10"
                          : zone.riskLevel === "medium"
                            ? "bg-yellow-500/10"
                            : "bg-success/10"
                      }`}
                    >
                      <MapPin
                        className={`w-5 h-5 ${
                          zone.riskLevel === "high"
                            ? "text-destructive"
                            : zone.riskLevel === "medium"
                              ? "text-yellow-600"
                              : "text-success"
                        }`}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-base">{zone.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{zone.description}</p>
                    </div>
                  </div>
                  {zone.alerts > 0 && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {zone.alerts}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">Trabajadores</span>
                    </div>
                    <p className="text-lg font-semibold">{zone.workers}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Camera className="w-4 h-4" />
                      <span className="text-xs">Cámaras</span>
                    </div>
                    <p className="text-lg font-semibold">{zone.cameras}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Nivel de Riesgo</span>
                    <Badge
                      variant={
                        zone.riskLevel === "high" ? "destructive" : zone.riskLevel === "medium" ? "outline" : "default"
                      }
                    >
                      {zone.riskLevel === "high" ? "Alto" : zone.riskLevel === "medium" ? "Medio" : "Bajo"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Supervisor</span>
                    <span className="font-medium">{zone.supervisor}</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

const ALL_ZONES = [
  {
    id: 1,
    name: "Zona A",
    description: "Almacén Principal",
    workers: 8,
    cameras: 3,
    alerts: 0,
    riskLevel: "low" as const,
    supervisor: "María G.",
  },
  {
    id: 2,
    name: "Zona B",
    description: "Línea de Producción",
    workers: 12,
    cameras: 4,
    alerts: 2,
    riskLevel: "high" as const,
    supervisor: "Carlos R.",
  },
  {
    id: 3,
    name: "Zona C",
    description: "Área de Montaje",
    workers: 6,
    cameras: 2,
    alerts: 0,
    riskLevel: "medium" as const,
    supervisor: "Ana M.",
  },
  {
    id: 4,
    name: "Zona D",
    description: "Zona Exterior",
    workers: 4,
    cameras: 2,
    alerts: 1,
    riskLevel: "medium" as const,
    supervisor: "Juan P.",
  },
  {
    id: 5,
    name: "Zona E",
    description: "Área Restringida",
    workers: 1,
    cameras: 2,
    alerts: 1,
    riskLevel: "high" as const,
    supervisor: "Pedro L.",
  },
  {
    id: 6,
    name: "Zona F",
    description: "Oficinas",
    workers: 5,
    cameras: 1,
    alerts: 0,
    riskLevel: "low" as const,
    supervisor: "Luis M.",
  },
]
