"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Users, UserCheck, Camera, AlertTriangle, CheckCircle } from "lucide-react"

interface ZoneDetailsDialogProps {
  open: boolean
  onClose: () => void
  zone: any | null
}

export function ZoneDetailsDialog({ open, onClose, zone }: ZoneDetailsDialogProps) {

  if (!zone) return null

  // Inspector asignado real
  const inspector = zone.inspector

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {zone.name}
          </DialogTitle>
          <DialogDescription>Información detallada de la zona</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">

          {/* UBICACIÓN */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Latitud</p>
                  <p className="text-lg font-semibold">{zone.latitude.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Longitud</p>
                  <p className="text-lg font-semibold">{zone.longitude.toFixed(6)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* INSPECTOR ASIGNADO */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <UserCheck className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold">Inspector Asignado</h3>
              </div>

              {!inspector?.name || inspector.name.includes("Sin") ? (
                <p className="text-sm text-muted-foreground">No hay inspector asignado</p>
              ) : (
                <div className="p-3 border rounded-lg flex items-center gap-3 bg-muted/20">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback>
                      {inspector.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{inspector.name}</p>
                    <p className="text-xs text-muted-foreground">Cédula: {inspector.email}</p>
                  </div>
                  <Badge className="bg-success">Activo</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ESTADÍSTICAS DE TRABAJADORES */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold">Estadísticas de Trabajadores</h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Total trabajadores reales */}
                <div className="text-center p-4 border rounded-lg bg-background">
                  <Users className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-2xl font-bold">{zone.workers}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total</p>
                </div>

                {/* Con EPP (mock temporal) */}
                <div className="text-center p-4 border rounded-lg bg-success/10 border-success/20">
                  <CheckCircle className="w-5 h-5 mx-auto mb-2 text-success" />
                  <p className="text-2xl font-bold text-success">0</p>
                  <p className="text-xs text-muted-foreground mt-1">Con EPP</p>
                </div>

                {/* Sin EPP (mock temporal) */}
                <div className="text-center p-4 border rounded-lg bg-destructive/10 border-destructive/20">
                  <AlertTriangle className="w-5 h-5 mx-auto mb-2 text-destructive" />
                  <p className="text-2xl font-bold text-destructive">0</p>
                  <p className="text-xs text-muted-foreground mt-1">Sin EPP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CÁMARAS */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold">Cámaras</h3>
                </div>
                <Badge variant="outline">{zone.cameras} cámaras activas</Badge>
              </div>
            </CardContent>
          </Card>

        </div>
      </DialogContent>
    </Dialog>
  )
}
