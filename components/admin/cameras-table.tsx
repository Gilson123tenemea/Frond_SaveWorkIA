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
  Trash2,
  Pencil,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  listarCamaras,
  eliminarCamara,
} from "@/servicios/camara";

import { AllCamerasDialog } from "./all-cameras-dialog";
import { CameraFormDialog } from "./camera-form-dialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function CamerasTable() {
  const [search, setSearch] = useState("");
  const [cameras, setCameras] = useState<any[]>([]);        // ← YA NO ES NEVER
  const [loading, setLoading] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    camera: any | null;
  }>({
    open: false,
    camera: null,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<any | null>(null);

  const loadCameras = async () => {
    setLoading(true);
    try {
      const data = await listarCamaras();
      setCameras(data);
    } catch {
      toast.error("❌ Error al cargar cámaras");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCameras();
  }, []);

  const filtered = cameras.filter((cam: any) => {
    const s = search.toLowerCase();
    return (
      cam.codigo?.toLowerCase().includes(s) ||
      cam.ipAddress?.toLowerCase().includes(s) ||
      cam.zona?.nombreZona?.toLowerCase().includes(s) ||
      cam.zona?.empresa?.nombreEmpresa?.toLowerCase().includes(s)
    );
  });

  const confirmDelete = (camera: any) => {
    setDeleteDialog({ open: true, camera });
  };

  const executeDelete = async () => {
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
        style: { background: "#dc2626", color: "white" },
        iconTheme: { primary: "#fff", secondary: "#7f1d1d" },
      }
    );

    await promise;
    setDeleteDialog({ open: false, camera: null });
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
      {/* DELETE MODAL */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              ¿Eliminar cámara?
            </DialogTitle>
            <DialogDescription className="text-center">
              La cámara <b>{deleteDialog.camera?.codigo}</b> será eliminada.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-center gap-4">
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
              onClick={executeDelete}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cámaras Registradas</CardTitle>
              <CardDescription>
                Todas las cámaras del sistema con su empresa y zona.
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
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center">
                      No hay cámaras registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((cam: any) => (
                    <TableRow key={cam.id_camara}>
                      <TableCell className="font-medium">
                        {cam.codigo}
                      </TableCell>

                      <TableCell>{cam.ipAddress}</TableCell>

                      <TableCell>{cam.zona?.nombreZona}</TableCell>

                      <TableCell>
                        {cam.zona?.empresa?.nombreEmpresa}
                      </TableCell>

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
                        <Button
                          variant="ghost"
                          onClick={() => handleEdit(cam)}
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={() => confirmDelete(cam)}
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

      <AllCamerasDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={loadCameras}
      />

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
