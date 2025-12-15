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
import {
  crearEppZona,
  obtenerEppPorZona,
  actualizarEppZona,
} from "@/servicios/zona_epp";
import { TIPOS_EPP } from "@/lib/constantes/epp";

import { MapPicker } from "@/components/maps/google-maps-picker";

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

  const [eppSeleccionados, setEppSeleccionados] = useState<string[]>([]);

  const getAdminId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id_administrador ?? 0;
  };

  // -------------------------------
  // Cargar datos al abrir
  // -------------------------------
  useEffect(() => {
    if (!open) return;

    const adminId = getAdminId();

    if (zone) {
      setFormData({
        nombreZona: zone.nombreZona,
        latitud: zone.latitud,
        longitud: zone.longitud,
        estado: zone.borrado ? "active" : "inactive",
        id_empresa_zona: zone.id_empresa_zona,
        id_administrador_zona: adminId,
      });

      // 👇 Cargar EPP de la zona
      (async () => {
        try {
          const epps = await obtenerEppPorZona(zone.id_Zona);
          const activos = epps.map((e: any) => e.tipo_epp);
          setEppSeleccionados(activos);
        } catch {
          toast.error("❌ Error al cargar EPP de la zona");
          setEppSeleccionados([]);
        }
      })();
    } else {
      setFormData({
        nombreZona: "",
        latitud: "",
        longitud: "",
        estado: "active",
        id_empresa_zona: companyId ?? 0,
        id_administrador_zona: adminId,
      });
      setEppSeleccionados([]);
    }

    setErrors({});
  }, [open, zone, companyId]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData((p) => ({
      ...p,
      latitud: lat.toString(),
      longitud: lng.toString(),
    }));
  };

  const validarFormulario = () => {
    const newErrors: any = {};
    newErrors.nombreZona = validarNombreZona(formData.nombreZona);
    newErrors.latitud = validarCoordenada(formData.latitud, "latitud");
    newErrors.longitud = validarCoordenada(formData.longitud, "longitud");
    setErrors(newErrors);

    if (!zone && eppSeleccionados.length === 0) {
      toast.error("Seleccione al menos un EPP");
      return false;
    }

    return !Object.values(newErrors).some((e) => e !== null);
  };

  // -------------------------------
  // Guardar
  // -------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const dataToSend = {
      nombreZona: formData.nombreZona.trim(),
      latitud: formData.latitud,
      longitud: formData.longitud,
      id_empresa_zona: formData.id_empresa_zona,
      id_administrador_zona: formData.id_administrador_zona,
      borrado: formData.estado === "active",
    };

    setLoading(true);

    try {
      let zonaResp;

      if (zone) {
        zonaResp = await actualizarZona(zone.id_Zona, dataToSend);

        // 👇 ACTUALIZAR EPP
        await actualizarEppZona(zone.id_Zona, eppSeleccionados);
      } else {
        zonaResp = await crearZona(dataToSend);

        const idZona = zonaResp.id_Zona;
        await Promise.all(
          eppSeleccionados.map((epp) =>
            crearEppZona({
              idZona,
              tipoEpp: epp,
              obligatorio: true,
            })
          )
        );
      }

      toast.success("Zona guardada correctamente");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Error al guardar");
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
            Configure la zona y los EPP obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input
              value={formData.nombreZona}
              onChange={(e) =>
                setFormData({ ...formData, nombreZona: e.target.value })
              }
            />
            {errors.nombreZona && (
              <p className="text-red-500 text-sm">{errors.nombreZona}</p>
            )}
          </div>

          <MapPicker
            latitude={formData.latitud ? parseFloat(formData.latitud) : -2.2038}
            longitude={
              formData.longitud ? parseFloat(formData.longitud) : -79.8975
            }
            onLocationSelect={handleLocationSelect}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Latitud"
              value={formData.latitud}
              onChange={(e) =>
                setFormData({ ...formData, latitud: e.target.value })
              }
            />
            <Input
              placeholder="Longitud"
              value={formData.longitud}
              onChange={(e) =>
                setFormData({ ...formData, longitud: e.target.value })
              }
            />
          </div>

          {/* EPP */}
          <div>
            <Label>EPP obligatorios en la zona</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {TIPOS_EPP.map((epp) => (
                <label
                  key={epp.key}
                  className="flex items-center gap-2 border rounded-lg p-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={eppSeleccionados.includes(epp.key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setEppSeleccionados((p) => [...p, epp.key]);
                      } else {
                        setEppSeleccionados((p) =>
                          p.filter((x) => x !== epp.key)
                        );
                      }
                    }}
                  />
                  {epp.label}
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
