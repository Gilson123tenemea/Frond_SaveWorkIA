"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Camera,
  MapPin,
  Trash2,
  Pencil,
} from "lucide-react";
import toast from "react-hot-toast";
import { listarCamaras, eliminarCamara } from "@/servicios/camara";
import { AllCamerasDialog } from "./all-cameras-dialog";
import { CameraFormDialog } from "./camera-form-dialog";

// 🔥 IMPORTAR dialog de SHADCN
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function CamerasTable() {
  const [search, setSearch] = useState("");
  const [cameras, setCameras] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCamera, setEditingCamera] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // 🔥 Estado para modal de eliminación
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cameraToDelete, setCameraToDelete] = useState<any | null>(null);

  const loadCameras = async () => {
    setLoading(true);
    try {
      const data = await listarCamaras();
      setCameras(data);
    } catch (error) {
      toast.error("❌ Error al obtener las cámaras");
      console.error("Error al obtener cámaras:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCameras();
  }, []);

  const filteredCameras = cameras.filter((camera) => {
    const codigo = camera.codigo?.toLowerCase() ?? "";
    const ip = camera.ipAddress?.toLowerCase() ?? "";
    const zona = camera.zona?.nombreZona?.toLowerCase() ?? "";
    const empresa = camera.zona?.empresa?.nombreEmpresa?.toLowerCase() ?? "";
    const searchLower = search.toLowerCase();
    return (
      codigo.includes(searchLower) ||
      ip.includes(searchLower) ||
      zona.includes(searchLower) ||
      empresa.includes(searchLower)
    );
  });

  // ============================================================
  // 🔥 NUEVO: abrir modal para eliminar
  // ============================================================
  const handleDelete = (camera: any) => {
    setCameraToDelete(camera);
    setDeleteOpen(true);
  };

  // ============================================================
  // 🔥 NUEVO: confirmar desde modal
  // ============================================================
  const confirmDelete = async () => {
    if (!cameraToDelete) return;

    const promise = eliminarCamara(cameraToDelete.id_camara);

    toast.promise(promise, {
      loading: "Eliminando cámara...",
      success: `Cámara "${cameraToDelete.codigo}" eliminada correctamente`,
      error: "❌ No se pudo eliminar la cámara",
    });

    await promise;
    setDeleteOpen(false);
    setCameraToDelete(null);
    loadCameras();
  };

  const handleEdit = (camera: any) => {
    setEditingCamera(camera);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingCamera(null);
    loadCameras();
  };

  return (
    <>
      {/* ======================= */}
      {/* 🔥 MODAL DE ELIMINACIÓN */}
      {/* ======================= */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              ¿Eliminar cámara?
            </DialogTitle>
            <DialogDescription className="text-center">
              La cámara <strong>{cameraToDelete?.codigo}</strong> será eliminada del sistema.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
            >
              Cancelar
            </Button>

            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ======================= */}
      {/* TABLA COMPLETA */}
      {/* ======================= */}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cámaras del Sistema</CardTitle>
              <CardDescription>
                Monitorea todas las cámaras registradas con su zona y empresa.
              </CardDescription>
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
                placeholder="Buscar cámara, IP, zona o empresa..."
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
                  <TableHead>IP</TableHead>
                  <TableHead>Zona</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Resolución</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Cargando cámaras...
                    </TableCell>
                  </TableRow>
                ) : filteredCameras.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No hay cámaras registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCameras.map((camera) => (
                    <TableRow key={camera.id_camara}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              camera.estado === "activa"
                                ? "bg-green-100"
                                : camera.estado === "mantenimiento"
                                ? "bg-yellow-100"
                                : "bg-red-100"
                            }`}
                          >
                            <Camera
                              className={`w-5 h-5 ${
                                camera.estado === "activa"
                                  ? "text-green-600"
                                  : camera.estado === "mantenimiento"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{camera.codigo}</p>
                            <p className="text-xs text-muted-foreground">
                              ID: {camera.id_camara}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{camera.ipAddress}</span>
                        </div>
                      </TableCell>

                      <TableCell>{camera.zona?.nombreZona ?? "—"}</TableCell>

                      <TableCell>
                        {camera.zona?.empresa?.nombreEmpresa ?? "—"}
                      </TableCell>

                      <TableCell>{camera.tipo}</TableCell>

                      <TableCell>
                        <Badge variant="outline">
                          {camera.resolucion || "1080p"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              camera.estado === "activa"
                                ? "bg-green-500 animate-pulse"
                                : camera.estado === "mantenimiento"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span className="text-sm capitalize">
                            {camera.estado}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(camera)}
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </Button>

                        {/* 🔥 NUEVO: abre modal */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(camera)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de registro */}
      <AllCamerasDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={loadCameras}
      />

      {/* Modal de edición */}
      <CameraFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        camera={editingCamera}
        zoneId={editingCamera?.id_zona ?? null}
        onSuccess={handleFormSuccess}
      />
    </>
  );
}
