"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, MapPin, Pencil, Trash2, Camera } from "lucide-react";
import toast from "react-hot-toast";

import { listarZonasPorEmpresa, eliminarZona } from "@/servicios/zona";
import { ZoneFormDialog } from "./zone-form-dialog";
import { CamerasDialog } from "./cameras-dialog";

interface Zona {
  id_Zona: number;
  nombreZona: string;
  latitud: string;
  longitud: string;
  id_empresa_zona: number;
  id_administrador_zona?: number;
  borrado: boolean;
  cameras?: number;
}

interface ZonesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number | null;
  onSuccess: () => void;
}

export function ZonesDialog({ open, onOpenChange, companyId, onSuccess }: ZonesDialogProps) {
  const [search, setSearch] = useState("");
  const [zones, setZones] = useState<Zona[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zona | null>(null);

  const [camerasDialog, setCamerasDialog] = useState({
    open: false,
    id: null as number | null,
    nombre: "",
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: undefined as number | undefined,
    nombre: "",
  });

  // =====================================================
  // 🔹 Cargar zonas por empresa
  // =====================================================
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
          0,
      }));

      setZones(zonasConCamaras);
    } catch (error: any) {
      toast.error(error.message || "❌ Error al cargar zonas");
    }
  };

  useEffect(() => {
    if (open && companyId) loadZones();
  }, [open, companyId]);

  // =====================================================
  // 🔍 Filtro de búsqueda
  // =====================================================
  const filteredZones = zones.filter((zone) =>
    (zone.nombreZona ?? "").toLowerCase().includes(search.toLowerCase())
  );

  // =====================================================
  // ➕ Agregar zona
  // =====================================================
  const handleAdd = () => {
    setEditingZone(null);
    setIsFormOpen(true);
  };

  // =====================================================
  // ✏️ Editar zona
  // =====================================================
  const handleEdit = (zone: Zona) => {
    setEditingZone(zone);
    setIsFormOpen(true);
  };

  // =====================================================
  // 📸 Ver cámaras de la zona
  // =====================================================
  const handleViewCameras = (zone: Zona) => {
    if (!zone.id_Zona) {
      toast.error("❌ Zona inválida");
      return;
    }

    setCamerasDialog({
      open: true,
      id: zone.id_Zona,
      nombre: zone.nombreZona,
    });
  };

  // =====================================================
  // 🗑️ Confirmar eliminación
  // =====================================================
  const confirmDelete = (id: number, nombre: string) => {
    setDeleteDialog({ open: true, id, nombre });
  };

  // =====================================================
  // 🔥 Ejecutar eliminación con manejo correcto de errores
  // =====================================================
 const handleConfirmDelete = async () => {
  if (!deleteDialog.id) return;

  toast.loading("Eliminando zona...");

  const result = await eliminarZona(deleteDialog.id);

  toast.dismiss();

  if (!result.ok) {
    toast.error("⚠️ " + result.message, {
      style: {
        background: "#dc2626",
        color: "white",
      },
      iconTheme: { primary: "white", secondary: "#7f1d1d" },
    });

    return;
  }

  toast.success(`Zona "${deleteDialog.nombre}" eliminada correctamente`, {
    style: {
      background: "#059669",
      color: "white",
    },
  });

  await loadZones();
  onSuccess();

  setDeleteDialog({ open: false, id: undefined, nombre: "" });
};

  // =====================================================
  // ✔ Zona creada o editada
  // =====================================================
  const handleFormSuccess = () => {
    loadZones();
    setIsFormOpen(false);
    setEditingZone(null);
    onSuccess();
  };

  // =====================================================
  // 🔥 UI COMPLETO
  // =====================================================
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[90vw] sm:max-w-[90vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Zonas de Empresa {companyId}
            </DialogTitle>
            <DialogDescription>
              Administra las zonas registradas dentro de esta empresa.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Input + botón agregar */}
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

            {/* Tabla */}
            <div className="border rounded-lg shadow-sm w-full">
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
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
                            <Button variant="ghost" size="sm" onClick={() => handleViewCameras(zone)}>
                              <Camera className="w-4 h-4 mr-2" />
                              Cámaras
                            </Button>

                            <Button variant="ghost" size="sm" onClick={() => handleEdit(zone)}>
                              <Pencil className="w-4 h-4 text-blue-600" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => confirmDelete(zone.id_Zona, zone.nombreZona)}
                            >
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

      {/* Confirmación eliminar */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open })) }>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>
              ¿Eliminar zona <b>{deleteDialog.nombre}</b>?
            </DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog(prev => ({ ...prev, open: false }))}>
              Cancelar
            </Button>

            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Formulario zona */}
      <ZoneFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        zone={editingZone}
        companyId={companyId}
        onSuccess={handleFormSuccess}
      />

      {/* Modal cámaras */}
      <CamerasDialog
        open={camerasDialog.open}
        onOpenChange={(open) =>
          setCamerasDialog((prev) => ({
            ...prev,
            open,
            id: open ? prev.id : null,
          }))
        }
        zoneId={camerasDialog.id ?? 0}
        zoneName={camerasDialog.nombre}
        onSuccess={() => {
          loadZones();
          onSuccess();
        }}
      />
    </>
  );
}
