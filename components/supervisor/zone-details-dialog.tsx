"use client"

import { useEffect, useState } from "react"
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
  const [inspectors, setInspectors] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalWorkers: 0,
    compliantWorkers: 0,
    nonCompliantWorkers: 0,
  })

  const MOCK_INSPECTORS = [
    { id: 1, name: "Carlos Ramírez", email: "carlos@savework.com" },
    { id: 2, name: "María González", email: "maria@savework.com" },
  ]

  const MOCK_STATS = {
    totalWorkers: 12,
    compliantWorkers: 9,
    nonCompliantWorkers: 3,
  }

  useEffect(() => {
    if (zone && open) {
      setInspectors(MOCK_INSPECTORS)
      setStats(MOCK_STATS)
    }
  }, [zone, open])

  if (!zone) return null

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
          {/* Location Info */}
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

          {/* Inspectors */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <UserCheck className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold">Inspectores Asignados</h3>
              </div>

              {inspectors.map((inspector) => (
                <div key={inspector.id} className="p-3 border rounded-lg flex items-center gap-3 bg-muted/20">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback>
                      {inspector.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{inspector.name}</p>
                    <p className="text-xs text-muted-foreground">{inspector.email}</p>
                  </div>
                  <Badge className="bg-success">Activo</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Worker Stats */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold">Estadísticas de Trabajadores</h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-4 border rounded-lg bg-background">
                  <Users className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-2xl font-bold">{stats.totalWorkers}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-success/10 border-success/20">
                  <CheckCircle className="w-5 h-5 mx-auto mb-2 text-success" />
                  <p className="text-2xl font-bold text-success">{stats.compliantWorkers}</p>
                  <p className="text-xs text-muted-foreground mt-1">Con EPP</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-destructive/10 border-destructive/20">
                  <AlertTriangle className="w-5 h-5 mx-auto mb-2 text-destructive" />
                  <p className="text-2xl font-bold text-destructive">{stats.nonCompliantWorkers}</p>
                  <p className="text-xs text-muted-foreground mt-1">Sin EPP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cameras */}
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
