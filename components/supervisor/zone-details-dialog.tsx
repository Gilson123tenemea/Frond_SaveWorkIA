"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Users, UserCheck, Camera } from "lucide-react"
import { getZoneWorkerStats, getInspectorsByZone, type Zone } from "@/lib/storage"

interface ZoneDetailsDialogProps {
  open: boolean
  onClose: () => void
  zone: Zone | null
}

export function ZoneDetailsDialog({ open, onClose, zone }: ZoneDetailsDialogProps) {
  const [stats, setStats] = useState<{
    totalWorkers: number
    compliantWorkers: number
    nonCompliantWorkers: number
  } | null>(null)
  const [inspectors, setInspectors] = useState<any[]>([])

  useEffect(() => {
    if (zone && open) {
      const allStats = getZoneWorkerStats()
      const zoneStats = allStats.find((s) => s.zoneId === zone.id)
      setStats(zoneStats || { totalWorkers: 0, compliantWorkers: 0, nonCompliantWorkers: 0 })

      const assignedInspectors = getInspectorsByZone(zone.id)
      setInspectors(assignedInspectors)
    }
  }, [zone, open])

  if (!zone) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {zone.name}
          </DialogTitle>
          <DialogDescription>Detalles y estadísticas de la zona</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Location Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Latitud</p>
                  <p className="text-lg font-semibold">{zone.latitude.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Longitud</p>
                  <p className="text-lg font-semibold">{zone.longitude.toFixed(6)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inspectors Assigned */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <UserCheck className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold">Inspectores Asignados</h3>
              </div>
              {inspectors.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay inspectores asignados a esta zona</p>
              ) : (
                <div className="space-y-2">
                  {inspectors.map((inspector) => (
                    <div key={inspector.id} className="flex items-center gap-3 p-2 border rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">{inspector.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{inspector.name}</p>
                        <p className="text-xs text-muted-foreground">{inspector.email}</p>
                      </div>
                      <Badge variant="default">Activo</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Worker Stats */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold">Estadísticas de Trabajadores</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-2xl font-bold">{stats?.totalWorkers || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total</p>
                </div>
                <div className="text-center p-3 border rounded-lg bg-success/5">
                  <p className="text-2xl font-bold text-success">{stats?.compliantWorkers || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">Con EPP</p>
                </div>
                <div className="text-center p-3 border rounded-lg bg-destructive/5">
                  <p className="text-2xl font-bold text-destructive">{stats?.nonCompliantWorkers || 0}</p>
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
                  <h3 className="font-semibold">Cámaras de Vigilancia</h3>
                </div>
                <Badge variant="outline">{zone.cameras} cámaras</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
