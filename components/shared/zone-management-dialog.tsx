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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Plus, Users, Camera, Edit, Trash2 } from "lucide-react"

interface ZoneManagementDialogProps {
  trigger?: React.ReactNode
}

export function ZoneManagementDialog({ trigger }: ZoneManagementDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Gestionar Zonas
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Gestión de Zonas
          </DialogTitle>
          <DialogDescription>Configura y administra las zonas de trabajo del sistema</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Zonas Activas</TabsTrigger>
            <TabsTrigger value="add">Agregar Nueva</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {MOCK_ZONES.map((zone) => (
                <div key={zone.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
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
                      <div className="flex-1">
                        <h4 className="font-semibold">{zone.name}</h4>
                        <p className="text-sm text-muted-foreground">{zone.description}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        zone.riskLevel === "high" ? "destructive" : zone.riskLevel === "medium" ? "outline" : "default"
                      }
                    >
                      {zone.riskLevel === "high"
                        ? "Alto Riesgo"
                        : zone.riskLevel === "medium"
                          ? "Riesgo Medio"
                          : "Bajo Riesgo"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{zone.workers} trabajadores</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-muted-foreground" />
                      <span>{zone.cameras} cámaras</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 gap-2 bg-transparent">
                      <Edit className="w-3 h-3" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <Trash2 className="w-3 h-3" />
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
                  <Label htmlFor="zone-name">Nombre de Zona</Label>
                  <Input id="zone-name" placeholder="Zona F" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone-code">Código</Label>
                  <Input id="zone-code" placeholder="ZN-F" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zone-description">Descripción</Label>
                <Textarea id="zone-description" placeholder="Descripción detallada de la zona..." rows={3} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="zone-risk">Nivel de Riesgo</Label>
                  <Select>
                    <SelectTrigger id="zone-risk">
                      <SelectValue placeholder="Seleccionar nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Bajo Riesgo</SelectItem>
                      <SelectItem value="medium">Riesgo Medio</SelectItem>
                      <SelectItem value="high">Alto Riesgo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone-capacity">Capacidad Máxima</Label>
                  <Input id="zone-capacity" type="number" placeholder="20" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zone-supervisor">Supervisor Asignado</Label>
                <Select>
                  <SelectTrigger id="zone-supervisor">
                    <SelectValue placeholder="Seleccionar supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">María González</SelectItem>
                    <SelectItem value="2">Carlos Rodríguez</SelectItem>
                    <SelectItem value="3">Ana Martínez</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Equipos de Protección Requeridos</Label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">Casco</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">Chaleco</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Gafas</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">Botas</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <Button type="button" className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Zona
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

const MOCK_ZONES = [
  { id: 1, name: "Zona A", description: "Almacén Principal", workers: 8, cameras: 3, riskLevel: "low" as const },
  { id: 2, name: "Zona B", description: "Línea de Producción", workers: 12, cameras: 4, riskLevel: "high" as const },
  { id: 3, name: "Zona C", description: "Área de Montaje", workers: 6, cameras: 2, riskLevel: "medium" as const },
  { id: 4, name: "Zona D", description: "Zona Exterior", workers: 4, cameras: 2, riskLevel: "medium" as const },
  { id: 5, name: "Zona E", description: "Área Restringida", workers: 1, cameras: 2, riskLevel: "high" as const },
  { id: 6, name: "Zona F", description: "Oficinas", workers: 5, cameras: 1, riskLevel: "low" as const },
]
