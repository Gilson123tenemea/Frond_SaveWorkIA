"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Plus, MapPin, Settings, Activity, Eye } from "lucide-react"

interface CameraManagementDialogProps {
  trigger?: React.ReactNode
}

export function CameraManagementDialog({ trigger }: CameraManagementDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Gestionar Cámaras
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Gestión de Cámaras
          </DialogTitle>
          <DialogDescription>Configura y administra las cámaras de vigilancia del sistema</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Cámaras Activas</TabsTrigger>
            <TabsTrigger value="add">Agregar Nueva</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <div className="space-y-3">
              {MOCK_CAMERAS.map((camera) => (
                <div key={camera.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          camera.status === "online"
                            ? "bg-success/10"
                            : camera.status === "maintenance"
                              ? "bg-yellow-500/10"
                              : "bg-destructive/10"
                        }`}
                      >
                        <Camera
                          className={`w-5 h-5 ${
                            camera.status === "online"
                              ? "text-success"
                              : camera.status === "maintenance"
                                ? "text-yellow-600"
                                : "text-destructive"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{camera.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {camera.resolution}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{camera.location}</span>
                          <span>•</span>
                          <span>Zona {camera.zone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          camera.status === "online"
                            ? "bg-success animate-pulse"
                            : camera.status === "maintenance"
                              ? "bg-yellow-500"
                              : "bg-destructive"
                        }`}
                      />
                      <span className="text-sm">
                        {camera.status === "online"
                          ? "En línea"
                          : camera.status === "maintenance"
                            ? "Mantenimiento"
                            : "Fuera de línea"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <Eye className="w-3 h-3" />
                      Ver Stream
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <Settings className="w-3 h-3" />
                      Configurar
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <Activity className="w-3 h-3" />
                      Estado
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="camera-name">Nombre de Cámara</Label>
                  <Input id="camera-name" placeholder="CAM-A01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="camera-zone">Zona</Label>
                  <Select>
                    <SelectTrigger id="camera-zone">
                      <SelectValue placeholder="Seleccionar zona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Zona A - Almacén</SelectItem>
                      <SelectItem value="B">Zona B - Producción</SelectItem>
                      <SelectItem value="C">Zona C - Montaje</SelectItem>
                      <SelectItem value="D">Zona D - Exterior</SelectItem>
                      <SelectItem value="E">Zona E - Restringida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="camera-location">Ubicación Específica</Label>
                <Input id="camera-location" placeholder="Entrada principal, cerca de la puerta 3" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="camera-ip">Dirección IP</Label>
                  <Input id="camera-ip" placeholder="192.168.1.100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="camera-resolution">Resolución</Label>
                  <Select>
                    <SelectTrigger id="camera-resolution">
                      <SelectValue placeholder="Seleccionar resolución" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p HD</SelectItem>
                      <SelectItem value="1080p">1080p Full HD</SelectItem>
                      <SelectItem value="4k">4K Ultra HD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="camera-fps">FPS</Label>
                  <Select>
                    <SelectTrigger id="camera-fps">
                      <SelectValue placeholder="Frames por segundo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 FPS</SelectItem>
                      <SelectItem value="30">30 FPS</SelectItem>
                      <SelectItem value="60">60 FPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="camera-model">Modelo</Label>
                  <Input id="camera-model" placeholder="Hikvision DS-2CD2143G0" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <Button type="button" className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Cámara
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

const MOCK_CAMERAS = [
  { id: 1, name: "CAM-A01", location: "Entrada Principal", zone: "A", status: "online" as const, resolution: "4K" },
  { id: 2, name: "CAM-A02", location: "Zona de Carga", zone: "A", status: "online" as const, resolution: "1080p" },
  { id: 3, name: "CAM-B01", location: "Línea 1", zone: "B", status: "online" as const, resolution: "1080p" },
  { id: 4, name: "CAM-B02", location: "Línea 2", zone: "B", status: "maintenance" as const, resolution: "1080p" },
  { id: 5, name: "CAM-C01", location: "Área de Montaje", zone: "C", status: "offline" as const, resolution: "4K" },
]
