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
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { crearZona, actualizarZona } from "@/servicios/zona";
import { MapPicker } from "@/components/maps/google-maps-picker";

// Validaciones Front
import {
  validarNombreZona,
  validarCoordenada,
} from "@/components/validaciones/validacionesZona";

interface ZoneFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zone: any | null;
  companyId: number | null;
  onSuccess: () => void;
}

export function ZoneFormDialog({
  open,
  onOpenChange,
  zone,
  companyId,
  onSuccess,
}: ZoneFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [formData, setFormData] = useState({
    nombreZona: "",
    latitud: "",
    longitud: "",
    estado: "active",
    id_empresa_zona: 0,
    id_administrador_zona: 0,
  });

  // Obtener ADMIN desde localStorage
  const getAdminId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id_administrador ?? 0;
  };

  // Cargar valores al abrir modal
  useEffect(() => {
    if (!open) return;

    const adminId = getAdminId();

    if (zone) {
      // MODO EDITAR
      setFormData({
        nombreZona: zone.nombreZona,
        latitud: zone.latitud,
        longitud: zone.longitud,
        estado: zone.borrado ? "active" : "inactive",
        id_empresa_zona: zone.id_empresa_zona,
        id_administrador_zona: adminId,
      });
    } else {
      // MODO CREAR
      setFormData({
        nombreZona: "",
        latitud: "",
        longitud: "",
        estado: "active",
        id_empresa_zona: companyId ?? 0,
        id_administrador_zona: adminId,
      });
    }

    setErrors({});
  }, [open, zone, companyId]);

  // Guardar coordenadas desde el mapa
  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitud: lat.toString(),
      longitud: lng.toString(),
    }));
  };

  // Validar formulario
  const validarFormulario = () => {
    const newErrors: any = {};

    newErrors.nombreZona = validarNombreZona(formData.nombreZona);
    newErrors.latitud = validarCoordenada(formData.latitud, "latitud");
    newErrors.longitud = validarCoordenada(formData.longitud, "longitud");

    setErrors(newErrors);

    return !Object.values(newErrors).some((e) => e !== null);
  };

  // Guardar (crear/editar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      toast.error("⚠️ Revise los campos del formulario");
      return;
    }

    const dataToSend = {
      nombreZona: formData.nombreZona.trim(),
      latitud: formData.latitud,
      longitud: formData.longitud,
      id_empresa_zona: formData.id_empresa_zona,
      id_administrador_zona: formData.id_administrador_zona,
      borrado: formData.estado === "active",
    };

    const promise = zone
      ? actualizarZona(zone.id_Zona, dataToSend)
      : crearZona(dataToSend);

    toast.promise(
      promise,
      {
        loading: zone ? "Actualizando zona..." : "Registrando zona...",
        success: zone
          ? `Zona "${formData.nombreZona}" actualizada correctamente`
          : `Zona "${formData.nombreZona}" registrada exitosamente`,
        error: (err: any) => {
          const backendMsg =
            err?.response?.data?.detail ||
            err?.message ||
            "❌ Error al guardar la zona";

          return "⚠️ " + backendMsg;
        },
      },
      {
        style: {
          background: zone ? "#1d4ed8" : "#16a34a",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: 500,
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        },
        iconTheme: {
          primary: "#fff",
          secondary: zone ? "#1e40af" : "#166534",
        },
      }
    );

    setLoading(true);

    try {
      await promise;
      onSuccess();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {zone ? "Editar Zona" : "Registrar Nueva Zona"}
          </DialogTitle>
          <DialogDescription>
            Seleccione una ubicación en el mapa y llene todos los campos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label>Nombre de la Zona</Label>
              <Input
                placeholder="Ej: Zona A - Bodega"
                value={formData.nombreZona}
                onChange={(e) =>
                  setFormData({ ...formData, nombreZona: e.target.value })
                }
              />
              {errors.nombreZona && (
                <p className="text-red-500 text-sm">{errors.nombreZona}</p>
              )}
            </div>

            {/* Mapa */}
            <div className="space-y-2">
              <Label>Ubicación</Label>
              <MapPicker
                latitude={
                  formData.latitud ? parseFloat(formData.latitud) : -2.2038
                }
                longitude={
                  formData.longitud ? parseFloat(formData.longitud) : -79.8975
                }
                onLocationSelect={handleLocationSelect}
              />
            </div>

            {/* Coordenadas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Latitud</Label>
                <Input
                  value={formData.latitud}
                  onChange={(e) =>
                    setFormData({ ...formData, latitud: e.target.value })
                  }
                />
                {errors.latitud && (
                  <p className="text-red-500 text-sm">{errors.latitud}</p>
                )}
              </div>

              <div>
                <Label>Longitud</Label>
                <Input
                  value={formData.longitud}
                  onChange={(e) =>
                    setFormData({ ...formData, longitud: e.target.value })
                  }
                />
                {errors.longitud && (
                  <p className="text-red-500 text-sm">{errors.longitud}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {zone ? "Actualizar" : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
