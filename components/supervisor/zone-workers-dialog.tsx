"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, UserPlus, MapPin } from "lucide-react"
import toast from "react-hot-toast"

import { listarTrabajadoresNoAsignados } from "@/servicios/trabajador"
import {
  listarAsignacionesTrabajadorZonaDetalles,
  crearAsignacionTrabajadorZona,
  eliminarAsignacionLogico,
} from "@/servicios/trabajador_zona"
import { getUser } from "@/lib/auth"

export function ZoneWorkersDialog({ open, onClose, zone }: any) {
  const [assignedWorkers, setAssignedWorkers] = useState<any[]>([])
  const [availableWorkers, setAvailableWorkers] = useState<any[]>([])
  const [selectedWorkerId, setSelectedWorkerId] = useState("")


  const loadRealWorkers = async () => {
    const user = getUser()
    if (!user || !user.id_supervisor) return

    try {
      const workers = await listarTrabajadoresNoAsignados(user.id_supervisor)

      const formatted = workers.map((t: any) => ({
        id: t.id_trabajador,
        name: `${t.persona.nombre} ${t.persona.apellido}`,
        cedula: t.persona.cedula,
        position: t.cargo,
      }))

      setAvailableWorkers(formatted)
    } catch (error) {
      console.error("❌ Error cargando trabajadores no asignados:", error)
    }
  }


  const loadAssignedWorkers = async () => {
    if (!zone) return

    try {
      const asignaciones = await listarAsignacionesTrabajadorZonaDetalles()

      const filtered = asignaciones
        .filter((a: any) => a.zona_id === zone.id)
        .map((a: any) => ({
          asignacionId: a.id_asignacion,
          id: a.trabajador_id,
          name: `${a.trabajador_nombre} ${a.trabajador_apellido}`,
          cedula: a.trabajador_cedula,
          position: a.trabajador_cargo,
          zona: a.zona_nombre,
        }))

      setAssignedWorkers(filtered)
    } catch (error) {
      console.error("❌ Error cargando asignados:", error)
    }
  }

  useEffect(() => {
    if (zone && open) {
      loadRealWorkers()
      loadAssignedWorkers()
    }
  }, [zone, open])

  const handleAssignWorker = async () => {
    if (!selectedWorkerId) return

    const payload = {
      id_trabajador_trabajadorzona: Number(selectedWorkerId),
      id_zona_trabajadorzona: zone.id,
    }

    try {
      await crearAsignacionTrabajadorZona(payload)

      toast.success("Trabajador asignado correctamente", {
        style: {
          background: "#15803d",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: 500,
        },
      });

      await loadRealWorkers()
      await loadAssignedWorkers()
      setSelectedWorkerId("")
    } catch (error) {
      toast.error("❌ Error al asignar el trabajador")
      console.error(error)
    }
  }

  const handleDeleteConfirm = (asignacionId: number, nombre: string) => {
    // Crear fondo oscuro CON ID único
    const overlayId = "overlay-delete-confirm";
    let overlay = document.getElementById(overlayId);

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = overlayId;
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.background = "rgba(0,0,0,0.4)";
      overlay.style.zIndex = "999";
      document.body.appendChild(overlay);
    }

    const removeOverlay = () => {
      const ov = document.getElementById(overlayId);
      if (ov) ov.remove();
    };

    const toastId = toast(
      (t) => (
        <div className="flex flex-col gap-4 p-2 text-center">
          <p className="text-base font-semibold text-gray-800">
            ¿Eliminar la asignación de <b>{nombre}</b>?
          </p>

          <div className="flex justify-center gap-3">

            {/* CANCELAR */}
            <button
              onClick={() => {
                toast.dismiss(t.id);
                removeOverlay();
              }}
              className="px-4 py-2 text-sm bg-white border rounded-md hover:bg-gray-100 text-black"
            >
              Cancelar
            </button>

            {/* ELIMINAR */}
            <button
              onClick={async () => {
                toast.dismiss(t.id);

                const promise = eliminarAsignacionLogico(asignacionId);

                toast.promise(
                  promise,
                  {
                    loading: "Eliminando asignación...",
                    success: "Asignación eliminada correctamente",
                    error: "❌ Error al eliminar",
                  },
                  {
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
                  }
                );


                try {
                  await promise;
                  await loadAssignedWorkers();
                  await loadRealWorkers();
                } catch (err) {
                  console.error(err);
                }

                removeOverlay();
              }}
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Eliminar
            </button>

          </div>
        </div>
      ),
      {
        duration: 8000,
        position: "top-center",
        style: {
          background: "#fff",
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          borderRadius: "12px",
          padding: "20px",
          width: "380px",
        },
      }
    );

    setTimeout(() => {
      removeOverlay();
    }, 8500);
  };

  const isOverlayActive = () => {
    return document.getElementById("overlay-delete-confirm") !== null;
  };


  if (!zone) return null


  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state && isOverlayActive()) return;
        onClose();
      }}
    >
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Gestionar Trabajadores — {zone.name}
          </DialogTitle>
          <DialogDescription>
            Asigna y administra los trabajadores de esta zona
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 flex-1 overflow-hidden flex flex-col">

          {/* ====================================================== */}
          {/* ASIGNAR TRABAJADOR */}
          {/* ====================================================== */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-muted-foreground" />
                Asignar Trabajador
              </h3>

              <div className="flex gap-2">
                <Select value={selectedWorkerId} onValueChange={setSelectedWorkerId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecciona un trabajador" />
                  </SelectTrigger>

                  <SelectContent>
                    {availableWorkers.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No hay trabajadores disponibles
                      </div>
                    ) : (
                      availableWorkers.map((worker) => (
                        <SelectItem key={worker.id} value={worker.id.toString()}>
                          {worker.name} — {worker.cedula}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                <Button disabled={!selectedWorkerId} onClick={handleAssignWorker}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Asignar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ====================================================== */}
          {/* TABLA DE TRABAJADORES ASIGNADOS */}
          {/* ====================================================== */}
          <Card className="flex flex-col flex-1 overflow-hidden">
            <CardContent className="pt-6 flex flex-col overflow-hidden h-full">

              {/* ENCABEZADO */}
              <div className="grid grid-cols-4 font-semibold text-sm text-gray-700 border-b pb-2 mb-3 flex-shrink-0">
                <span>Trabajador Asignado</span>
                <span>Cargo</span>
                <span>Zona</span>
                <span className="text-right">Acciones</span>
              </div>

              {/* SIN ASIGNADOS */}
              {assignedWorkers.length === 0 ? (
                <p className="text-center text-muted-foreground py-10">
                  No hay trabajadores asignados
                </p>
              ) : (
                <div className="space-y-3 overflow-y-auto pr-2 flex-1">

                  {assignedWorkers.map((worker) => (
                    <div
                      key={worker.asignacionId}
                      className="grid grid-cols-4 items-center p-3 border rounded-lg bg-muted/30"
                    >
                      {/* NOMBRE */}
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            {worker.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-medium">{worker.name}</p>
                          <p className="text-xs text-muted-foreground">{worker.cedula}</p>
                        </div>
                      </div>

                      {/* CARGO */}
                      <p className="text-sm">{worker.position}</p>

                      {/* ZONA */}
                      <p className="text-sm">{worker.zona}</p>

                      {/* ACCIÓN */}
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteConfirm(worker.asignacionId, worker.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                    </div>
                  ))}

                </div>
              )}

            </CardContent>
          </Card>

        </div>
      </DialogContent>
    </Dialog>
  );

}