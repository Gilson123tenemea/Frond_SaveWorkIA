"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter, // <-- IMPORTADO AQUÍ
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

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Camera as CamIcon,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  listarCamarasPorZona,
  eliminarCamara,
} from "@/servicios/camara";

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

  // Modal delete
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    camera: null as any,
  });

  const loadCameras = async () => {
    if (!zoneId) return;
    try {
      const data = await listarCamarasPorZona(zoneId);
      setCameras(data);
    } catch {
      toast.error("❌ Error al cargar cámaras");
    }
  };

  useEffect(() => {
    if (open && zoneId) loadCameras();
  }, [open, zoneId]);

  const filteredCameras = cameras.filter(
    (cam: any) =>
      cam.codigo.toLowerCase().includes(search.toLowerCase()) ||
      cam.ipAddress.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setEditingCamera(null);
    setIsFormOpen(true);
  };

  const handleEdit = (cam: any) => {
    setEditingCamera(cam);
    setIsFormOpen(true);
  };

  const handleDelete = (camera: any) => {
    setDeleteDialog({ open: true, camera });
  };

  const confirmDelete = async () => {
    const cam = deleteDialog.camera;

    const promise = eliminarCamara(cam.id_camara);

    toast.promise(
      promise,
      {
        loading: "Eliminando cámara...",
        success: `Cámara "${cam.codigo}" eliminada correctamente`,
        error: "❌ No se pudo eliminar la cámara",
      },
      {
        style: {
          background: "#dc2626",
          color: "white",
          borderRadius: "8px",
          fontWeight: 500,
        },
        iconTheme: { primary: "#fff", secondary: "#7f1d1d" },
      }
    );

    try {
      await promise;
      setDeleteDialog({ open: false, camera: null });
      loadCameras();
      onSuccess();
    } catch {}
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingCamera(null);
    loadCameras();
    onSuccess();
  };

  return (
    <>
      {/* LISTA */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CamIcon className="w-5 h-5" />
              Cámaras en {zoneName ?? "Zona"}
            </DialogTitle>
            <DialogDescription>
              Gestiona todas las cámaras asociadas a esta zona.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between gap-4 py-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar
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
                      className="py-6 text-center text-muted-foreground"
                    >
                      No hay cámaras registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCameras.map((cam: any) => (
                    <TableRow key={cam.id_camara}>
                      <TableCell>{cam.codigo}</TableCell>
                      <TableCell>{cam.ipAddress}</TableCell>
                      <TableCell>{cam.tipo}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            cam.estado === "activa" ? "default" : "outline"
                          }
                        >
                          {cam.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" onClick={() => handleEdit(cam)}>
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </Button>

                        <Button variant="ghost" onClick={() => handleDelete(cam)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DELETE */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>
              ¿Eliminar cámara <b>{deleteDialog.camera?.codigo}</b>?
            </DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteDialog((prev) => ({ ...prev, open: false }))
              }
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
