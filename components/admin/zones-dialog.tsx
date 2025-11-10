"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, MapPin, Pencil, Trash2, Camera } from "lucide-react"
import { getZones, getCompanies, deleteZone, type Zone } from "@/lib/storage"
import { ZoneFormDialog } from "./zone-form-dialog"
import { CamerasDialog } from "./cameras-dialog"

interface ZonesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId: number | null
  onSuccess: () => void
}

export function ZonesDialog({ open, onOpenChange, companyId, onSuccess }: ZonesDialogProps) {
  const [search, setSearch] = useState("")
  const [zones, setZones] = useState<Zone[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingZone, setEditingZone] = useState<Zone | null>(null)
  const [camerasZoneId, setCamerasZoneId] = useState<number | null>(null)
  const company = getCompanies().find((c) => c.id === companyId)

  useEffect(() => {
    if (companyId) {
      loadZones()
    }
  }, [companyId])

  const loadZones = () => {
    const allZones = getZones()
    setZones(allZones.filter((z) => z.companyId === companyId))
  }

  const filteredZones = zones.filter((zone) => zone.name.toLowerCase().includes(search.toLowerCase()))

  const handleAdd = () => {
    setEditingZone(null)
    setIsFormOpen(true)
  }

  const handleEdit = (zone: Zone) => {
    setEditingZone(zone)
    setIsFormOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta zona? Se eliminarán todas sus cámaras.")) {
      deleteZone(id)
      loadZones()
      onSuccess()
    }
  }

  const handleFormSuccess = () => {
    loadZones()
    setIsFormOpen(false)
    setEditingZone(null)
    onSuccess()
  }

  const handleViewCameras = (zoneId: number) => {
    setCamerasZoneId(zoneId)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Zonas de {company?.name}
            </DialogTitle>
            <DialogDescription>Gestiona las zonas de trabajo de la empresa</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar zona..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Zona
              </Button>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zona</TableHead>
                    <TableHead>Coordenadas</TableHead>
                    <TableHead>Cámaras</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredZones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No hay zonas registradas
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredZones.map((zone) => (
                      <TableRow key={zone.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-success" />
                            </div>
                            <div>
                              <p className="font-medium">{zone.name}</p>
                              <p className="text-xs text-muted-foreground">ID: {zone.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>Lat: {zone.latitude.toFixed(4)}</p>
                            <p className="text-muted-foreground">Lng: {zone.longitude.toFixed(4)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4 text-muted-foreground" />
                            <span>{zone.cameras}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={zone.status === "active" ? "default" : "outline"}>
                            {zone.status === "active" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewCameras(zone.id)}>
                              <Camera className="w-4 h-4 mr-2" />
                              Cámaras
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(zone)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(zone.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ZoneFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        zone={editingZone}
        companyId={companyId}
        onSuccess={handleFormSuccess}
      />

      <CamerasDialog
        open={camerasZoneId !== null}
        onOpenChange={(open) => !open && setCamerasZoneId(null)}
        zoneId={camerasZoneId}
        onSuccess={() => {
          loadZones()
          onSuccess()
        }}
      />
    </>
  )
}
