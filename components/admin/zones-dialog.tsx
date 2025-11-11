"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, MapPin, Pencil, Trash2, Camera } from "lucide-react"
import toast from "react-hot-toast"
import { listarZonasPorEmpresa, eliminarZona } from "@/servicios/zona"
import { ZoneFormDialog } from "./zone-form-dialog"
import { CamerasDialog } from "./cameras-dialog"

interface Zona {
  id_Zona: number
  nombreZona: string
  latitud: string
  longitud: string
  id_empresa_zona: number
  id_administrador_zona: number
  borrado: boolean
  cameras?: number
}

interface ZonesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId: number | null
  onSuccess: () => void
}

export function ZonesDialog({ open, onOpenChange, companyId, onSuccess }: ZonesDialogProps) {
  const [search, setSearch] = useState("")
  const [zones, setZones] = useState<Zona[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingZone, setEditingZone] = useState<Zona | null>(null)
  const [camerasZoneId, setCamerasZoneId] = useState<number | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: number; nombre?: string }>({
    open: false,
  })

  // 🔹 Cargar zonas desde el backend
  const loadZones = async () => {
    if (!companyId) return
    try {
      const data = await listarZonasPorEmpresa(companyId)
      setZones(
        data.map((z: Zona) => ({
          ...z,
          cameras: z.cameras ?? 0,
        }))
      )
    } catch {
      toast.error("❌ Error al cargar las zonas")
    }
  }

  useEffect(() => {
    if (companyId) loadZones()
  }, [companyId])

  const filteredZones = zones.filter((zone) =>
    zone.nombreZona.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = () => {
    setEditingZone(null)
    setIsFormOpen(true)
  }

  const handleEdit = (zone: Zona) => {
    setEditingZone(zone)
    setIsFormOpen(true)
  }

  // 🔹 Eliminar zona (con toast y confirm dialog)
  const confirmDelete = (id: number, nombre: string) => {
    setDeleteDialog({ open: true, id, nombre })
  }

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id) return
    const { id, nombre } = deleteDialog

    const promise = eliminarZona(id)

    toast.promise(
      promise,
      {
        loading: "Eliminando zona...",
        success: `🗑️ Zona "${nombre}" eliminada correctamente`,
        error: "❌ No se pudo eliminar la zona",
      },
      {
        style: {
          background: "#dc2626",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: 500,
          boxShadow: "0 2px 20px rgba(0, 0, 0, 0.2)",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#7f1d1d",
        },
      }
    )

    try {
      await promise
      loadZones()
      onSuccess()
    } finally {
      setDeleteDialog({ open: false })
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Zonas de la Empresa {companyId}
            </DialogTitle>
            <DialogDescription>
              Gestiona las zonas de trabajo de la empresa, agrega nuevas o edita las existentes
            </DialogDescription>
          </DialogHeader>

          {/* Barra de búsqueda y botón agregar */}
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

            {/* Tabla de zonas */}
            <div className="border rounded-lg shadow-sm">
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
                      <TableRow key={zone.id_Zona} className="hover:bg-muted/50 transition">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">{zone.nombreZona}</p>
                              <p className="text-xs text-muted-foreground">ID: {zone.id_Zona}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p>Lat: {zone.latitud}</p>
                          <p>Lng: {zone.longitud}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4 text-muted-foreground" />
                            <span>{zone.cameras}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={zone.borrado ? "default" : "outline"}>
                            {zone.borrado ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewCameras(zone.id_Zona)}>
                              <Camera className="w-4 h-4 mr-2" />
                              Cámaras
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(zone)}>
                              <Pencil className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => confirmDelete(zone.id_Zona, zone.nombreZona)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
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

      {/* 🟥 Modal de confirmación de eliminación */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>¿Estás seguro de eliminar la zona <strong>{deleteDialog.nombre}</strong>?</DialogTitle>
            <DialogDescription>Se eliminarán todas las cámaras asociadas a esta zona.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false })}>
              Cancelar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleConfirmDelete}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogo para crear o editar zona */}
      <ZoneFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        zone={editingZone}
        companyId={companyId}
        onSuccess={handleFormSuccess}
      />

      {/* Dialogo de cámaras */}
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
