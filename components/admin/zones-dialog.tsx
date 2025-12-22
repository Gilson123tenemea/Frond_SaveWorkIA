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
  MapPin,
  Pencil,
  Trash2,
  Camera,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import { listarZonasPorEmpresa, eliminarZona } from "@/servicios/zona";
import { obtenerEppPorZona } from "@/servicios/zona_epp";
import { ZoneFormDialog } from "./zone-form-dialog";
import { CamerasDialog } from "./cameras-dialog";

interface Zona {
  id_Zona: number;
  nombreZona: string;
  latitud: string;
  longitud: string;
  borrado: boolean;
  cameras?: number;
  epps?: string[];
}

interface ZonesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number | null;
  onSuccess: () => void;
}

export function ZonesDialog({
  open,
  onOpenChange,
  companyId,
  onSuccess,
}: ZonesDialogProps) {
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

  // =========================
  // Cargar zonas + EPP
  // =========================
  const loadZones = async () => {
    if (!companyId) return;

    try {
      const data = await listarZonasPorEmpresa(companyId);

      const zonasCompletas = await Promise.all(
        data.map(async (z: any) => {
          let epps: string[] = [];
          try {
            const resp = await obtenerEppPorZona(z.id_Zona);
            epps = resp.map((e: any) => e.tipo_epp);
          } catch { }

          return {
            ...z,
            cameras:
              z.cameras ??
              z.total_camaras ??
              z.camaras ??
              z.cameras_count ??
              0,
            epps,
          };
        })
      );

      setZones(zonasCompletas);
    } catch (err: any) {
      toast.error(err.message || "Error al cargar zonas", {
        style: {
          background: "#DC2626",
          color: "#fff",
          borderRadius: "10px",
          padding: "12px 16px",
        },
        icon: "❌",
      });
    }
  };

  useEffect(() => {
    if (open && companyId) loadZones();
  }, [open, companyId]);

  const filteredZones = zones.filter((z) =>
    z.nombreZona.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // Acciones
  // =========================
  const handleAdd = () => {
    setEditingZone(null);
    setIsFormOpen(true);
  };

  const handleEdit = (zone: Zona) => {
    setEditingZone(zone);
    setIsFormOpen(true);
  };

  const handleViewCameras = (zone: Zona) => {
    setCamerasDialog({
      open: true,
      id: zone.id_Zona,
      nombre: zone.nombreZona,
    });
  };

  const confirmDelete = (id: number, nombre: string) => {
    setDeleteDialog({ open: true, id, nombre });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id) return;

    toast.loading("Eliminando zona...");
    const result = await eliminarZona(deleteDialog.id);
    toast.dismiss();

    if (!result.ok) {
      toast.error(result.message, {
        style: {
          background: "#DC2626",
          color: "#fff",
          borderRadius: "10px",
          padding: "12px 16px",
        },
        icon: "⚠️",
      });
      return;
    }

    toast.success(`Zona "${deleteDialog.nombre}" eliminada`, {
      style: {
        background: "#DC2626",
        color: "#fff",
        borderRadius: "10px",
        padding: "12px 16px",
      },
      icon: "🗑️",
    });
    
    await loadZones();
    onSuccess();
    setDeleteDialog({ open: false, id: undefined, nombre: "" });
  };

  const handleFormSuccess = () => {
    loadZones();
    setIsFormOpen(false);
    setEditingZone(null);
    onSuccess();
  };

  // =========================
  // UI
  // =========================
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
              Administra zonas y los EPP obligatorios.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Buscar + agregar */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
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
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zona</TableHead>
                    <TableHead>Coordenadas</TableHead>
                    <TableHead>Cámaras</TableHead>
                    <TableHead>EPP</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredZones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        No hay zonas
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredZones.map((zone) => (
                      <TableRow key={zone.id_Zona} className="align-top">
                        {/* 🔥 ZONA GRANDE (NO SE TOCA) */}
                        <TableCell>
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mt-1">
                              <MapPin className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-base">
                                {zone.nombreZona}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                ID: {zone.id_Zona}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <p>Lat: {zone.latitud}</p>
                          <p>Lng: {zone.longitud}</p>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            {zone.cameras}
                          </div>
                        </TableCell>

                        {/* EPP */}
                        <TableCell>
                          {zone.epps && zone.epps.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {zone.epps.map((epp, index) => (
                                <Badge
                                  key={`${zone.id_Zona}-epp-${epp}-${index}`}
                                  variant="secondary"
                                  className="flex items-center gap-1"
                                >
                                  {epp}
                                </Badge>
                              ))}

                            </div>
                          ) : (
                            <Badge variant="outline">Sin EPP</Badge>
                          )}
                        </TableCell>

                        <TableCell>
                          <Badge variant={zone.borrado ? "default" : "outline"}>
                            {zone.borrado ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewCameras(zone)}
                            >
                              <Camera className="w-4 h-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(zone)}
                            >
                              <Pencil className="w-4 h-4 text-blue-600" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                              onClick={() =>
                                confirmDelete(zone.id_Zona, zone.nombreZona)
                              }
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

      {/* Confirm delete */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog((p) => ({ ...p, open }))
        }
      >
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
              onClick={() =>
                setDeleteDialog({ open: false, id: undefined, nombre: "" })
              }
            >
              Cancelar
            </Button>
            <Button
              className="bg-red-600 text-white"
              onClick={handleConfirmDelete}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modales */}
      <ZoneFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        zone={editingZone}
        companyId={companyId}
        onSuccess={handleFormSuccess}
      />

      <CamerasDialog
        open={camerasDialog.open}
        onOpenChange={(open) =>
          setCamerasDialog((p) => ({
            ...p,
            open,
            id: open ? p.id : null,
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