"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, MapPin, Settings } from "lucide-react"
import { CameraManagementDialog } from "@/components/shared/camera-management-dialog"
import { CameraViewerDialog } from "@/components/shared/camera-viewer-dialog"

export default function CamerasPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sistema de Cámaras</h1>
            <p className="text-muted-foreground">Monitoreo en tiempo real de todas las cámaras</p>
          </div>
          <CameraManagementDialog />
        </div>

        {/* Camera Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ALL_CAMERAS.map((camera) => (
            <Card key={camera.id}>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted">
                  <img
                    src={`/.jpg?height=200&width=350&query=${camera.location}`}
                    alt={camera.location}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant={camera.status === "online" ? "default" : "destructive"} className="gap-1.5">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          camera.status === "online" ? "bg-success animate-pulse" : "bg-destructive"
                        }`}
                      />
                      {camera.status === "online" ? "En vivo" : "Offline"}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{camera.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {camera.resolution}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{camera.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <CameraViewerDialog
                      cameraName={camera.name}
                      cameraLocation={camera.location}
                      trigger={
                        <Button size="sm" className="flex-1">
                          <Camera className="w-3 h-3 mr-2" />
                          Ver
                        </Button>
                      }
                    />
                    <Button size="sm" variant="outline">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

const ALL_CAMERAS = [
  { id: 1, name: "CAM-A01", location: "Almacén - Entrada Principal", status: "online" as const, resolution: "4K" },
  { id: 2, name: "CAM-A02", location: "Almacén - Zona de Carga", status: "online" as const, resolution: "1080p" },
  { id: 3, name: "CAM-B01", location: "Producción - Línea 1", status: "online" as const, resolution: "1080p" },
  { id: 4, name: "CAM-B02", location: "Producción - Línea 2", status: "online" as const, resolution: "1080p" },
  { id: 5, name: "CAM-C01", location: "Montaje - Área Principal", status: "offline" as const, resolution: "4K" },
  { id: 6, name: "CAM-D01", location: "Exterior - Estacionamiento", status: "online" as const, resolution: "1080p" },
]
