"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import toast from "react-hot-toast";

import { getUser } from "@/lib/auth";
import { listarZonasPorEmpresa } from "@/servicios/zona";
import { listarInspectoresPorSupervisor } from "@/servicios/inspector";
import {
  crearAsignacionInspectorZona,
  actualizarAsignacion,
} from "@/servicios/zona_inspector";

interface ZoneAssignFormProps {
  open: boolean;
  onClose: () => void;
  editingItem?: any | null;
}

export function ZoneAssignForm({
  open,
  onClose,
  editingItem,
}: ZoneAssignFormProps) {
  const [zonas, setZonas] = useState<any[]>([]);
  const [inspectores, setInspectores] = useState<any[]>([]);

  const [zonaSeleccionada, setZonaSeleccionada] = useState("");
  const [inspectorSeleccionado, setInspectorSeleccionado] = useState("");

  // ===============================
  // HELPERS PROFESIONALES
  // ===============================

  const extractInspectorId = (item: any) => {
    if (!item) return "";

    return (
      item.inspector_id ?? // <-- El más importante (viene del mapper)
      item.id_inspector_inspectorzona ??
      item.id_inspector ??
      item.inspector?.id_inspector ??
      ""
    );
  };

  const extractZonaId = (item: any) => {
    if (!item) return "";

    return (
      item.zona_id ?? // <-- Viene del mapper
      item.id_zona_inspectorzona ??
      item.id_zona ??
      item.zona?.id_zona ??
      ""
    );
  };

  // ===============================
  // CARGAR DATOS AL ABRIR MODAL
  // ===============================
  useEffect(() => {
    if (!open) return;

    const user = getUser();
    const supervisorId = user?.id;
    const empresaId = user?.id_empresa_supervisor;

    if (!empresaId || !supervisorId) {
      toast.error("No se pudo obtener datos del usuario");
      return;
    }

    listarZonasPorEmpresa(empresaId)
      .then(setZonas)
      .catch(() => toast.error("Error al cargar zonas"));

    listarInspectoresPorSupervisor(supervisorId)
      .then(setInspectores)
      .catch(() => toast.error("Error al cargar inspectores"));

    if (editingItem) {
      setZonaSeleccionada(String(extractZonaId(editingItem)));
    } else {
      setZonaSeleccionada("");
      setInspectorSeleccionado("");
    }
  }, [open, editingItem]);

  // ===============================
  // AUTOSELECCIÓN DEL INSPECTOR
  // ===============================
  useEffect(() => {
    if (!editingItem || inspectores.length === 0) return;

    const inspectorId = String(extractInspectorId(editingItem));

    const existe = inspectores.some(
      (i) => String(i.id_inspector) === inspectorId
    );

    if (existe) {
      setInspectorSeleccionado(inspectorId);
    } else {
      console.warn("⚠ Inspector no encontrado en la lista:", inspectorId);
    }
  }, [inspectores, editingItem]);

  // ===============================
  // GUARDAR / EDITAR
  // ===============================
  const handleSubmit = async () => {
    try {
      if (!zonaSeleccionada || !inspectorSeleccionado) {
        toast.error("Debe seleccionar zona e inspector");
        return;
      }

      const payload = {
        id_inspector_inspectorzona: Number(inspectorSeleccionado),
        id_zona_inspectorzona: Number(zonaSeleccionada),
      };

      if (editingItem) {
        // ===============================
        // 🔵 ACTUALIZAR — DISEÑO PRO
        // ===============================
        const promise = actualizarAsignacion(
          editingItem.id_inspector_zona,
          payload
        );

        toast.promise(
          promise,
          {
            loading: "Actualizando asignación...",
            success: `Asignación actualizada correctamente`,
            error: "❌ Error al actualizar la asignación",
          },
          {
            style: {
              background: "#2563eb",
              color: "#fff",
              borderRadius: "8px",
              fontWeight: 500,
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#1e3a8a",
            },
          }
        );

        await promise;

      } else {
        // ===============================
        // 🟢 CREAR — DISEÑO PRO
        // ===============================
        const promise = crearAsignacionInspectorZona(payload);

        toast.promise(
          promise,
          {
            loading: "Guardando asignación...",
            success: `Asignación creada exitosamente`,
            error: "❌ Error al crear la asignación",
          },
          {
            style: {
              background: "#16a34a",
              color: "#fff",
              borderRadius: "8px",
              fontWeight: 500,
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#15803d",
            },
          }
        );

        await promise;
      }

      onClose();

    } catch (error) {
      console.error(error);
      toast.error("Error al guardar", {
        style: {
          background: "#dc2626",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: 500,
        },
      });
    }
  };


  // ===============================
  // RENDER UI
  // ===============================
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "Editar Asignación" : "Asignar Inspector a Zona"}
          </DialogTitle>
          <DialogDescription>
            Selecciona la zona y el inspector para continuar.
          </DialogDescription>
        </DialogHeader>

        {/* ZONA */}
        <div className="space-y-2 mt-4">
          <Label>Zona</Label>
          <Select value={zonaSeleccionada} onValueChange={setZonaSeleccionada}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una zona" />
            </SelectTrigger>
            <SelectContent>
              {zonas.map((z) => (
                <SelectItem key={z.id_zona} value={String(z.id_zona)}>
                  {z.nombreZona}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* INSPECTOR */}
        <div className="space-y-2 mt-4">
          <Label>Inspector</Label>
          <Select
            value={inspectorSeleccionado}
            onValueChange={setInspectorSeleccionado}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un inspector" />
            </SelectTrigger>
            <SelectContent>
              {inspectores.map((i: any) => (
                <SelectItem
                  key={i.id_inspector}
                  value={String(i.id_inspector)}
                >
                  {i.nombre} {i.apellido} – {i.cedula}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!zonaSeleccionada || !inspectorSeleccionado}
          >
            {editingItem ? "Actualizar" : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
