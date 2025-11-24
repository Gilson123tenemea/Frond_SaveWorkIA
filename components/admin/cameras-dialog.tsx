// src/components/admin/zones/cameras-dialog.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Plus, Search, Pencil, Trash2, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { listarCamarasPorZona, eliminarCamara } from "@/servicios/camara";
import { CameraFormDialog } from "./camera-form-dialog";

interface CamerasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zoneId: number | null;
  zoneName?: string;
  onSuccess: () => void;
}

export function CamerasDialog({
  open,
  onOpenChange,
  zoneId,
  zoneName,
  onSuccess,
}: CamerasDialogProps) {
  const [search, setSearch] = useState("");
  const [cameras, setCameras] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<any | null>(null);

  // 🔹 Cargar cámaras
  const loadCameras = async () => {
    if (!zoneId) {
      console.warn("⚠️ No se recibió un zoneId válido");
      return;
    }
    try {
      const data = await listarCamarasPorZona(zoneId);
      setCameras(data);
    } catch {
      toast.error("❌ Error al obtener las cámaras");
    }
  };

  useEffect(() => {
    if (zoneId && open) {
      loadCameras();
    }
  }, [zoneId, open]);

  const filteredCameras = cameras.filter(
    (camera) =>
      camera.codigo?.toLowerCase().includes(search.toLowerCase()) ||
      camera.ipAddress?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!zoneId) {
      toast.error("❌ Zona no identificada, no se puede agregar cámara");
      return;
    }
    setEditingCamera(null);
    setIsFormOpen(true);
  };

  const handleEdit = (camera: any) => {
    setEditingCamera(camera);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number, codigo: string) => {
    if (!zoneId) return;
    const confirmDelete = confirm(`¿Eliminar cámara ${codigo}?`);
    if (!confirmDelete) return;

    const promise = eliminarCamara(id);
    toast.promise(promise, {
      loading: "Eliminando cámara...",
      success: `Cámara "${codigo}" eliminada`,
      error: "❌ Error al eliminar",
    });

    await promise;
    loadCameras();
    onSuccess();
  };

  const handleFormSuccess = () => {
    loadCameras();
    setIsFormOpen(false);
    setEditingCamera(null);
    onSuccess();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              {zoneId ? (
                <span>
                  Cámaras de la Zona{" "}
                  <strong>{zoneName ?? `#${zoneId}`}</strong>
                </span>
              ) : (
                <span className="text-red-500 font-semibold">
                  Zona no identificada
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Gestiona las cámaras asociadas a esta zona.
            </DialogDescription>
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
              <Button onClick={handleAdd} disabled={!zoneId}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Cámara
              </Button>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCameras.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground py-8"
                      >
                        No hay cámaras registradas
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCameras.map((camera) => (
                      <TableRow key={camera.id_camara}>
                        <TableCell>{camera.codigo}</TableCell>
                        <TableCell>{camera.ipAddress}</TableCell>
                        <TableCell>{camera.tipo}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              camera.estado === "activa"
                                ? "default"
                                : "outline"
                            }
                          >
                            {camera.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(camera)}
                          >
                            <Pencil className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDelete(camera.id_camara, camera.codigo)
                            }
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
  );
}
