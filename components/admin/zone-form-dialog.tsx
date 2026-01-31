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
import { MapPin, Loader2, HardHat, Shield, Eye, Footprints, Shirt, Headphones } from "lucide-react";
import toast from "react-hot-toast";

// ✅ Usar el servicio unificado
import { crearZona, actualizarZona, obtenerZonaPorId, actualizarZonaConEpps } from "@/servicios/zona";
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

  // Mapeo de iconos para cada EPP
  const eppIcons: Record<string, any> = {
    casco: HardHat,
    gafas: Eye,
    guantes: Shield,
    chaleco: Shirt,
    botas: Footprints,
    mascarilla: Shield,
    protectores: Headphones,
  };

  const getAdminId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id_administrador ?? 0;
  };

  // ====================================================
  // 🔹 CARGAR DATOS AL ABRIR
  // ====================================================
  useEffect(() => {
    if (!open) return;

    const adminId = getAdminId();

    if (zone) {
      // ✅ EDITAR: Obtener zona con EPPs incluidos
      (async () => {
        try {
          const zonaCompleta = await obtenerZonaPorId(zone.id_Zona);
          
          // ✅ Validar que zonaCompleta no sea null
          if (!zonaCompleta) {
            throw new Error("No se pudo cargar la zona");
          }

          setFormData({
            nombreZona: zonaCompleta.nombreZona || "",
            latitud: zonaCompleta.latitud || "",
            longitud: zonaCompleta.longitud || "",
            estado: zonaCompleta.borrado ? "active" : "inactive",
            id_empresa_zona: zonaCompleta.id_empresa_zona || 0,
            id_administrador_zona: adminId,
          });

          // ✅ EPPs ya vienen en la respuesta
          const activos = (zonaCompleta.epps || []).map((e: any) => e.tipo_epp);
          setEppSeleccionados(activos);
        } catch (error) {
          console.error("Error al cargar zona:", error);
          toast.error("Error al cargar la zona", {
            style: {
              background: "#DC2626",
              color: "#fff",
              borderRadius: "10px",
              padding: "12px 16px",
            },
            icon: "❌",
          });
          // Resetear formulario en caso de error
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
      })();
    } else {
      // ✅ CREAR: Formulario vacío
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

  // ====================================================
  // 🔹 MANEJAR SELECCIÓN DE UBICACIÓN
  // ====================================================
  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData((p) => ({
      ...p,
      latitud: lat.toString(),
      longitud: lng.toString(),
    }));
    // Limpiar errores de coordenadas
    setErrors((prev: any) => ({
      ...prev,
      latitud: null,
      longitud: null,
    }));
  };

  // ====================================================
  // 🔹 VALIDAR FORMULARIO
  // ====================================================
  const validarFormulario = () => {
    const newErrors: any = {};
    
    // Validar campos de zona
    const nombreError = validarNombreZona(formData.nombreZona);
    const latitudError = validarCoordenada(formData.latitud, "latitud");
    const longitudError = validarCoordenada(formData.longitud, "longitud");
    
    if (nombreError) newErrors.nombreZona = nombreError;
    if (latitudError) newErrors.latitud = latitudError;
    if (longitudError) newErrors.longitud = longitudError;
    
    setErrors(newErrors);

    // ✅ VALIDAR: Al crear, requiere EPPs
    if (!zone && eppSeleccionados.length === 0) {
      toast.error("Seleccione al menos un EPP", {
        style: {
          background: "#DC2626",
          color: "#fff",
          borderRadius: "10px",
          padding: "12px 16px",
        },
        icon: "❌",
      });
      return false;
    }

    return Object.keys(newErrors).length === 0;
  };

  // ====================================================
  // 🔹 GUARDAR (CREAR O ACTUALIZAR)
  // ====================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setLoading(true);

    try {
      if (zone) {
        // ✅ ACTUALIZAR: Zona + EPPs juntos
        await actualizarZonaConEpps(zone.id_Zona, {
          nombreZona: formData.nombreZona.trim(),
          latitud: formData.latitud,
          longitud: formData.longitud,
          id_empresa_zona: formData.id_empresa_zona,
          id_administrador_zona: formData.id_administrador_zona,
          epps: eppSeleccionados, // ✨ EPPs se actualizan juntos
        });

        toast.success("Zona actualizada correctamente", {
          style: {
            background: "#2563EB",
            color: "#fff",
            borderRadius: "10px",
            padding: "12px 16px",
          },
          icon: "",
        });
      } else {
        // ✅ CREAR: Zona + EPPs en una sola llamada
        const nuevaZona = await crearZona({
          nombreZona: formData.nombreZona.trim(),
          latitud: formData.latitud,
          longitud: formData.longitud,
          id_empresa_zona: formData.id_empresa_zona,
          id_administrador_zona: formData.id_administrador_zona,
          epps: eppSeleccionados, // ✨ EPPs se crean automáticamente
        });

        console.log(`✅ Zona creada con ${nuevaZona?.total_epps ?? 0} EPPs`);

        toast.success("Zona creada correctamente", {
          style: {
            background: "#16A34A",
            color: "#fff",
            borderRadius: "10px",
            padding: "12px 16px",
          },
          icon: "✅",
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      console.error("Error al guardar zona:", err);
      toast.error(err?.message || "Error al guardar la zona", {
        style: {
          background: "#DC2626",
          color: "#fff",
          borderRadius: "10px",
          padding: "12px 16px",
        },
        icon: "❌",
      });
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
          {/* ===== NOMBRE ===== */}
          <div>
            <Label className="mb-2 block">Nombre</Label>
            <Input
              value={formData.nombreZona}
              onChange={(e) => {
                setFormData({ ...formData, nombreZona: e.target.value });
                // Limpiar error al escribir
                if (errors.nombreZona) {
                  setErrors({ ...errors, nombreZona: null });
                }
              }}
            />
            {errors.nombreZona && (
              <p className="text-red-500 text-sm mt-1">{errors.nombreZona}</p>
            )}
          </div>

          {/* ===== MAPA ===== */}
          <MapPicker
            latitude={formData.latitud ? parseFloat(formData.latitud) : -2.2038}
            longitude={
              formData.longitud ? parseFloat(formData.longitud) : -79.8975
            }
            onLocationSelect={handleLocationSelect}
          />

          {/* ===== COORDENADAS ===== */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                placeholder="Latitud"
                value={formData.latitud}
                onChange={(e) => {
                  setFormData({ ...formData, latitud: e.target.value });
                  // Limpiar error al escribir
                  if (errors.latitud) {
                    setErrors({ ...errors, latitud: null });
                  }
                }}
              />
              {errors.latitud && (
                <p className="text-red-500 text-sm mt-1">{errors.latitud}</p>
              )}
            </div>
            <div>
              <Input
                placeholder="Longitud"
                value={formData.longitud}
                onChange={(e) => {
                  setFormData({ ...formData, longitud: e.target.value });
                  // Limpiar error al escribir
                  if (errors.longitud) {
                    setErrors({ ...errors, longitud: null });
                  }
                }}
              />
              {errors.longitud && (
                <p className="text-red-500 text-sm mt-1">{errors.longitud}</p>
              )}
            </div>
          </div>

          {/* ===== SELECCIÓN DE EPPS ===== */}
          <div>
            <Label className="mb-2 block">
              EPP obligatorios en la zona
              {!zone && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {TIPOS_EPP.map((epp) => {
                const IconComponent = eppIcons[epp.key] || Shield;
                const isSelected = eppSeleccionados.includes(epp.key);

                return (
                  <label
                    key={epp.key}
                    className={`flex items-center gap-2 border rounded-lg p-2 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-50 border-blue-300"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEppSeleccionados((p) => [...p, epp.key]);
                        } else {
                          setEppSeleccionados((p) =>
                            p.filter((x) => x !== epp.key)
                          );
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <IconComponent className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{epp.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ===== BOTONES ===== */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {zone ? "Actualizar Zona" : "Crear Zona"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}