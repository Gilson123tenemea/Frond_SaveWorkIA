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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  MapPinned,
  Users,
  Building2,
  MapPin,
  RefreshCcw,
} from "lucide-react";

import toast from "react-hot-toast";

import type { WorkerAPI } from "./workers-table";

import {
  listarZonasDetallesPorSupervisor,
  listarAsignacionesTrabajadorZonaDetalles,
  crearAsignacionTrabajadorZona,
  eliminarAsignacionLogico,
} from "@/servicios/trabajador_zona";

import { getUser } from "@/lib/auth";

// ----------------------------------------------------------------
// Tipo de zona
// ----------------------------------------------------------------
interface ZoneFormatted {
  id: number;
  name: string;
  workers: number;
  cameras: number;
  latitude: number;
  longitude: number;
  inspector: {
    name: string;
    email: string;
  };
}

interface AssignWorkerZonesDialogProps {
  open: boolean;
  onClose: () => void;
  worker: WorkerAPI | null;
}

export function AssignWorkerZonesDialog({
  open,
  onClose,
  worker,
}: AssignWorkerZonesDialogProps) {
  const user = getUser();

  const [zones, setZones] = useState<ZoneFormatted[]>([]);
  const [loading, setLoading] = useState(false);

  // Si YA está asignado → aquí se guarda esa asignación
  const [assigned, setAssigned] = useState<{
    asignacionId: number;
    zoneId: number;
    zoneName: string;
  } | null>(null);

  const [selectedZone, setSelectedZone] = useState<number | null>(null);

  // ----------------------------------------------------------------
  // Cargar lista de zonas del supervisor
  // ----------------------------------------------------------------
  const loadZones = async () => {
    if (!user?.id_supervisor) return;

    try {
      const data = await listarZonasDetallesPorSupervisor(user.id_supervisor);

      const formatted: ZoneFormatted[] = data.map((item: any) => ({
        id: item.zona.id,
        name: item.zona.nombre,
        latitude: parseFloat(item.zona.latitud),
        longitude: parseFloat(item.zona.longitud),
        cameras: item.total_camaras,
        workers: item.total_trabajadores,
        inspector: {
          name: `${item.inspector?.nombre || "Sin"} ${item.inspector?.apellido || "Inspector"
            }`,
          email: item.inspector?.correo || "N/A",
        },
      }));

      setZones(formatted);
    } catch (error) {
      console.error(error);
      toast.error("Error cargando zonas");
    }
  };

  // ----------------------------------------------------------------
  // Cargar asignación actual del trabajador
  // IMPORTANTE: tu endpoint /detalles SOLO devuelve asignaciones ACTIVAS
  // ----------------------------------------------------------------
  const loadAssignedZone = async () => {
    if (!worker) return;

    try {
      const all = await listarAsignacionesTrabajadorZonaDetalles();

      // Si aparece aquí → el trabajador YA tiene zona asignada
      const found = all.find(
        (a: any) => a.trabajador_id === worker.id_trabajador
      );

      if (found) {
        setAssigned({
          asignacionId: found.id_asignacion,
          zoneId: found.zona_id,
          zoneName: found.zona_nombre,
        });

        setSelectedZone(found.zona_id);
      } else {
        setAssigned(null);
        setSelectedZone(null);
      }
    } catch (error) {
      console.error("Error asignación:", error);
      toast.error("Error cargando asignación actual");
    }
  };

  // ----------------------------------------------------------------
  // Cargar todo al abrir el modal
  // ----------------------------------------------------------------
  useEffect(() => {
    if (open && worker) {
      loadZones();
      loadAssignedZone();
    }
  }, [open, worker]);

  // ----------------------------------------------------------------
  // Guardar asignación → solo posible si NO tiene zona asignada
  // ----------------------------------------------------------------
  const handleSave = async () => {
    if (!worker) return;

    if (assigned) {
      toast.error("Este trabajador ya tiene una zona asignada.");
      return;
    }

    if (!selectedZone) {
      toast.error("Selecciona una zona");
      return;
    }

    setLoading(true);

    try {
      await crearAsignacionTrabajadorZona({
        id_trabajador_trabajadorzona: worker.id_trabajador,
        id_zona_trabajadorzona: selectedZone,
      });

      toast.success("Zona asignada correctamente", {
        style: {
          background: "#15803d",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: 500,
        },
      });

      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Error al asignar la zona");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // Cambiar zona (borrado lógico)
  // ----------------------------------------------------------------
  const handleChangeZone = async () => {
    if (!assigned) return;

    try {
      await eliminarAsignacionLogico(assigned.asignacionId);

      toast.success("Zona eliminada. Ahora puedes seleccionar otra.", {
        style: {
          background: "#dc2626",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: 500,
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#b91c1c",
        },
      });

      setAssigned(null);
      setSelectedZone(null);

      await loadAssignedZone();
      await loadZones();
    } catch (e) {
      console.error(e);
      toast.error("Error al cambiar zona");
    }
  };

  if (!worker) return null;

  // ----------------------------------------------------------------
  // UI
  // ----------------------------------------------------------------
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPinned className="w-5 h-5 text-primary" />
            Asignación de zona
          </DialogTitle>
          <DialogDescription>
            Administrar la zona de trabajo de{" "}
            <b>
              {worker.persona.nombre} {worker.persona.apellido}
            </b>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* ------------------ Info del trabajador ------------------ */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">
                {worker.persona.nombre} {worker.persona.apellido}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Cédula: {worker.persona.cedula}
            </p>
            <p className="text-xs text-muted-foreground">
              Cargo: {worker.cargo}
            </p>
          </div>

          {/* ------------------ SI YA TIENE ZONA ------------------ */}
          {assigned ? (
            <div className="p-4 border rounded-lg bg-primary/10 space-y-3">
              <h4 className="font-medium text-sm">Zona asignada actualmente:</h4>

              {(() => {
                const zone = zones.find((z) => z.id === assigned.zoneId);
                if (!zone) return null;

                return (
                  <div className="border p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{zone.name}</span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1">
                      Inspector: {zone.inspector.name}
                    </p>

                    <div className="flex gap-3 mt-2 text-xs">
                      <Badge>{zone.workers} trabajadores</Badge>
                      <Badge variant="outline">{zone.cameras} cámaras</Badge>
                    </div>
                  </div>
                );
              })()}

              <Button
                variant="destructive"
                className="w-full flex gap-2"
                onClick={handleChangeZone}
              >
                <RefreshCcw className="w-4 h-4" />
                Cambiar zona
              </Button>
            </div>
          ) : (
            <>
              {/* ------------------ LISTA DE ZONAS ------------------ */}
              <h4 className="text-sm font-medium">Selecciona una zona:</h4>

              <ScrollArea className="h-[300px] pr-4">
                {zones.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    No hay zonas disponibles
                  </div>
                ) : (
                  <div className="space-y-3">
                    {zones.map((zone) => (
                      <div
                        key={zone.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedZone === zone.id
                          ? "bg-primary/20 border-primary"
                          : "hover:bg-muted/50"
                          }`}
                        onClick={() => setSelectedZone(zone.id)}
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{zone.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)}
                            </p>
                          </div>

                          <div className="text-right text-xs space-y-1">
                            <Badge>{zone.workers} trabajadores</Badge>
                            <Badge variant="outline">{zone.cameras} cámaras</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <Button
                disabled={!selectedZone || loading}
                onClick={handleSave}
                className="w-full"
              >
                Guardar Zona
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
