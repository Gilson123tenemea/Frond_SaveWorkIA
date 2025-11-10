"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Camera, MapPin, Trash2 } from "lucide-react"
import { getCameras, deleteCamera, type Camera as CameraType } from "@/lib/storage"
import { AllCamerasDialog } from "./all-cameras-dialog"

export function CamerasTable() {
  const [search, setSearch] = useState("")
  const [cameras, setCameras] = useState<CameraType[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadCameras()
  }, [])

  const loadCameras = () => {
    setCameras(getCameras())
  }

  const filteredCameras = cameras.filter(
    (camera) =>
      camera.name.toLowerCase().includes(search.toLowerCase()) ||
      camera.location.toLowerCase().includes(search.toLowerCase()),
  )

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta cámara?")) {
      deleteCamera(id)
      loadCameras()
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cámaras del Sistema</CardTitle>
              <CardDescription>Monitorea todas las cámaras registradas</CardDescription>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Cámara
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cámara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cámara</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Zona</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Resolución</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCameras.map((camera) => (
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
                        <div>
                          <p className="font-medium">{camera.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {camera.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{camera.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>{camera.zone}</TableCell>
                    <TableCell>{camera.company}</TableCell>
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
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(camera.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AllCamerasDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSuccess={loadCameras} />
    </>
  )
}
