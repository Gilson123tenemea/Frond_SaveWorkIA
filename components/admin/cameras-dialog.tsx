"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import { getCameras, getZones, deleteCamera, type Camera } from "@/lib/storage"
import { CameraFormDialog } from "./camera-form-dialog"

interface CamerasDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  zoneId: number | null
  onSuccess: () => void
}

export function CamerasDialog({ open, onOpenChange, zoneId, onSuccess }: CamerasDialogProps) {
  const [search, setSearch] = useState("")
  const [cameras, setCameras] = useState<Camera[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null)
  const zone = getZones().find((z) => z.id === zoneId)

  useEffect(() => {
    if (zoneId) {
      loadCameras()
    }
  }, [zoneId])

  const loadCameras = () => {
    const allCameras = getCameras()
    setCameras(allCameras.filter((c) => c.zoneId === zoneId))
  }

  const filteredCameras = cameras.filter(
    (camera) =>
      camera.name.toLowerCase().includes(search.toLowerCase()) ||
      camera.location.toLowerCase().includes(search.toLowerCase()),
  )

  const handleAdd = () => {
    setEditingCamera(null)
    setIsFormOpen(true)
  }

  const handleEdit = (camera: Camera) => {
    setEditingCamera(camera)
    setIsFormOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta cámara?")) {
      deleteCamera(id)
      loadCameras()
      onSuccess()
    }
  }

  const handleFormSuccess = () => {
    loadCameras()
    setIsFormOpen(false)
    setEditingCamera(null)
    onSuccess()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <img src="path/to/camera-icon.svg" alt="Camera" className="w-5 h-5" />
              Cámaras de {zone?.name}
            </DialogTitle>
            <DialogDescription>Gestiona las cámaras de esta zona</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cámara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Cámara
              </Button>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cámara</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Resolución</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCameras.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No hay cámaras registradas
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCameras.map((camera) => (
                      <TableRow key={camera.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                camera.status === "online"
                                  ? "bg-success/10"
                                  : camera.status === "maintenance"
                                    ? "bg-yellow-500/10"
                                    : "bg-destructive/10"
                              }`}
                            >
                              <img
                                src="path/to/camera-icon.svg"
                                alt="Camera"
                                className={`w-5 h-5 ${
                                  camera.status === "online"
                                    ? "text-success"
                                    : camera.status === "maintenance"
                                      ? "text-yellow-600"
                                      : "text-destructive"
                                }`}
                              />
                            </div>
                            <div>
                              <p className="font-medium">{camera.name}</p>
                              <p className="text-xs text-muted-foreground">ID: {camera.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{camera.location}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{camera.resolution}</Badge>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(camera)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(camera.id)}>
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

      <CameraFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        camera={editingCamera}
        zoneId={zoneId}
        onSuccess={handleFormSuccess}
      />
    </>
  )
}
