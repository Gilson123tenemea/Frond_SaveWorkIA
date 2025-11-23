"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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
  id_administrador_zona?: number
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

  // 🔹 Estado para manejar el modal de cámaras
  const [camerasDialog, setCamerasDialog] = useState<{
    open: boolean
    id: number | null
    nombre: string
  }>({ open: false, id: null, nombre: "" })

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: number; nombre?: string }>({
    open: false,
  })

  // 🔹 Cargar zonas desde el backend
const loadZones = async () => {
  if (!companyId) return;

  try {
    const data = await listarZonasPorEmpresa(companyId);

    const zonasConCamaras = data.map((z: any) => ({
      ...z,
      cameras:
        z.cameras ??
        z.total_camaras ??
        z.camaras ??
        z.cameras_count ??
        0, // fallback final
    }));

    setZones(zonasConCamaras);
  } catch (error) {
    console.error("❌ Error al cargar las zonas:", error);
    toast.error("❌ Error al cargar las zonas desde el servidor");
  }
};


  useEffect(() => {
    if (open && companyId) loadZones()
  }, [open, companyId])

  // 🔍 Filtro de búsqueda
  const filteredZones = zones.filter((zone) =>
    (zone.nombreZona ?? "").toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = () => {
    setEditingZone(null)
    setIsFormOpen(true)
  }

  const handleEdit = (zone: Zona) => {
    setEditingZone(zone)
    setIsFormOpen(true)
  }

  // 📸 Abrir cámaras
  const handleViewCameras = (zone: Zona) => {
    console.log("📸 Zona seleccionada:", zone)

    const zoneId = zone.id_Zona

    if (!zoneId || zoneId <= 0) {
      toast.error("❌ No se pudo identificar la zona seleccionada")
      return
    }

    setCamerasDialog({
      open: true,
      id: zoneId,
      nombre: zone.nombreZona,
    })
  }

  // 🗑️ Confirmar eliminación
  const confirmDelete = (id: number, nombre: string) => {
    setDeleteDialog({ open: true, id, nombre })
  }

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id) return
    const promise = eliminarZona(deleteDialog.id)

    toast.promise(
      promise,
      {
        loading: "Eliminando zona...",
        success: `Zona "${deleteDialog.nombre}" eliminada correctamente`,
        error: "❌ No se pudo eliminar la zona",
      },
      {
        style: { background: "#dc2626", color: "#fff" },
        iconTheme: { primary: "#fff", secondary: "#7f1d1d" },
      }
    )

    try {
      await promise
      await loadZones()
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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
<DialogContent className="max-w-[90vw] sm:!max-w-[90vw] w-full max-h-[95vh] overflow-y-auto">          
  <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {companyId ? (
                <>Zonas de la Empresa {companyId}</>
              ) : (
                <span className="text-red-500">Empresa no identificada</span>
              )}
            </DialogTitle>
            <DialogDescription>
              Gestiona las zonas de trabajo de la empresa, agrega nuevas o edita las existentes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 🔍 Búsqueda y botón agregar */}
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

            {/* 📋 Tabla */}
            <div className="border rounded-lg shadow-sm w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[25%]">Zona</TableHead>
                    <TableHead className="w-[20%]">Coordenadas</TableHead>
                    <TableHead className="w-[10%]">Cámaras</TableHead>
                    <TableHead className="w-[10%]">Estado</TableHead>
                    <TableHead className="w-[35%] text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredZones.length === 0 ? (
                    <TableRow key="no-zones">
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No hay zonas registradas
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredZones.map((zone) => (
                      <TableRow
                        key={zone.id_Zona ?? `zona-${zone.nombreZona}`}
                        className="hover:bg-muted/50 transition"
                      >
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewCameras(zone)}
                            >
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

      {/* 🔴 Confirmación de eliminación */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              ¿Estás seguro de eliminar la zona <strong>{deleteDialog.nombre}</strong>?
            </DialogTitle>
            <DialogDescription>
              Se eliminarán todas las cámaras asociadas a esta zona.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false })}>
              Cancelar
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🟩 Formulario de zona */}
      <ZoneFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        zone={editingZone}
        companyId={companyId}
        onSuccess={handleFormSuccess}
      />

      {/* 📸 Modal de cámaras */}
      <CamerasDialog
        open={camerasDialog.open}
        onOpenChange={(open) =>
          setCamerasDialog((prev) => ({ ...prev, open, id: open ? prev.id : null }))
        }
        zoneId={camerasDialog.id ?? 0}
        zoneName={camerasDialog.nombre}
        onSuccess={() => {
          loadZones()
          onSuccess()
        }}
      />
    </>
  )
}