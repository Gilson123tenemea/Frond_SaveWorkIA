"use client";

import type React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// Servicios
import {
  crearCamara,
  actualizarCamara,
  probarConexionCamara,
} from "@/servicios/camara";

interface CameraFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  camera: any | null;
  zoneId: number | null;
  onSuccess: () => void;
}

export function CameraFormDialog({
  open,
  onOpenChange,
  camera,
  zoneId,
  onSuccess,
}: CameraFormDialogProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    resolution: "IP",
    status: "activa",
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // Estado de prueba de conexión
  const [conexionOk, setConexionOk] = useState(false);
  const [testing, setTesting] = useState(false);
  const [mensajeTest, setMensajeTest] = useState<string | null>(null);
  const [tipoMensajeTest, setTipoMensajeTest] = useState<
    "ok" | "error" | null
  >(null);

  // ============================================================
  // 🔥 Cargar datos para edición o limpieza para creación
  // ============================================================
  useEffect(() => {
    if (camera) {
      setFormData({
        name: camera.codigo,
        location: camera.ipAddress,
        resolution: camera.tipo,
        status: camera.estado,
      });
    } else {
      setFormData({
        name: "",
        location: "",
        resolution: "IP",
        status: "activa",
      });
    }

    setErrors({});
    setConexionOk(false);
    setMensajeTest(null);
    setTipoMensajeTest(null);
  }, [camera, open]);

  // ============================================================
  // 🔥 Validaciones FRONTEND
  // ============================================================
  const validarFormulario = (esEdicion: boolean) => {
    const newErrors: Record<string, string | null> = {
      name: null,
      location: null,
      resolution: null,
      status: null,
    };

    if (!esEdicion) {
      if (!formData.name.trim()) {
        newErrors.name = "El nombre o código de la cámara es obligatorio";
      }

      // URL válida (http, https, rtsp)
      if (!formData.location.trim()) {
        newErrors.location = "La URL de la cámara es obligatoria";
      } else if (
        !formData.location.startsWith("http://") &&
        !formData.location.startsWith("https://") &&
        !formData.location.startsWith("rtsp://")
      ) {
        newErrors.location =
          "La URL debe iniciar con http://, https:// o rtsp://";
      }

      if (!formData.resolution) {
        newErrors.resolution = "El tipo de cámara es obligatorio";
      }
    }

    if (!formData.status) {
      newErrors.status = "El estado es obligatorio";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e !== null);
  };

  // ============================================================
  // 🔥 Probar conexión con la cámara
  // ============================================================
  const handleProbarConexion = async () => {
    if (!formData.location || formData.location.trim() === "") {
      toast.error("Ingresa primero la URL de la cámara");
      return;
    }

    setTesting(true);
    setMensajeTest(null);
    setTipoMensajeTest(null);

    try {
      const resp = await probarConexionCamara(formData.location.trim());
      const msg = resp.message || "Conexión exitosa";

      setConexionOk(true);
      setMensajeTest(msg);
      setTipoMensajeTest("ok");
      toast.success(msg);
    } catch (err: any) {
      const msg =
        typeof err === "string"
          ? err
          : err?.message
          ? err.message
          : "No se pudo conectar con la cámara";

      setConexionOk(false);
      setTipoMensajeTest("error");
      setMensajeTest(msg);
      toast.error(msg);
    } finally {
      setTesting(false);
    }
  };

  // ============================================================
  // 🔥 Enviar al backend
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const esEdicion = !!camera;

    if (!validarFormulario(esEdicion)) {
      toast.error("⚠️ Revise los campos del formulario");
      return;
    }

    if (!esEdicion && !conexionOk) {
      toast.error("Primero debes probar la conexión de la cámara");
      return;
    }

    if (!zoneId && !esEdicion) {
      toast.error("No se pudo identificar la zona");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const adminId =
      user?.id_administrador ||
      parseInt(localStorage.getItem("adminId") || "0");

    let payload: any;

    if (esEdicion) {
      payload = {
        estado: formData.status,
      };
    } else {
      payload = {
        codigo: formData.name.trim(),
        tipo: formData.resolution,
        estado: formData.status,
        ipAddress: formData.location.trim(),
        id_zona: zoneId,
        id_administrador: adminId,
        borrado: true,
      };
    }

    const promise = esEdicion
      ? actualizarCamara(camera?.id_camara, payload)
      : crearCamara(payload);

    toast.promise(promise, {
      loading: esEdicion ? "Actualizando cámara..." : "Registrando cámara...",
      success: esEdicion
        ? `Cámara ${formData.name} actualizada correctamente`
        : `Cámara ${formData.name} registrada exitosamente`,
      error: (err) => {
        const msg = String(err?.message || "").toLowerCase();

        if (msg.includes("código") || msg.includes("codigo")) {
          return "⚠️ Ya existe una cámara con ese código en esta empresa";
        }

        if (msg.includes("ip") || msg.includes("dirección")) {
          return "⚠️ Esta URL ya está en uso dentro de la empresa";
        }

        if (msg.includes("formato") || msg.includes("obligatorio")) {
          return "⚠️ Verifique los datos ingresados";
        }

        return "❌ No se pudo guardar la cámara";
      },
    });

    setLoading(true);
    try {
      await promise;
      onSuccess();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const esEdicion = !!camera;

  // ============================================================
  // 🔥 UI COMPLETA
  // ============================================================
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            {esEdicion ? "Editar Cámara" : "Crear Nueva Cámara"}
          </DialogTitle>
          <DialogDescription>
            {esEdicion
              ? "Solo puedes modificar el estado de la cámara"
              : "Completa los datos para registrar una nueva cámara"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">

            {/* Código */}
            <div className="space-y-2">
              <Label>Nombre / Código de Cámara</Label>
              <Input
                placeholder="Ej: CAM-A01"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={esEdicion}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* URL */}
            <div className="space-y-2">
              <Label>URL de la Cámara</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="http://192.168.1.10:8080/video"
                  value={formData.location}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      location: e.target.value,
                    });
                    setConexionOk(false);
                    setMensajeTest(null);
                    setTipoMensajeTest(null);
                  }}
                  disabled={esEdicion}
                  className="flex-1"
                />

                {!esEdicion && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleProbarConexion}
                    disabled={testing || !formData.location}
                  >
                    {testing ? "Probando..." : "Probar"}
                  </Button>
                )}
              </div>

              {mensajeTest && (
                <p
                  className={`text-sm ${
                    tipoMensajeTest === "ok"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {mensajeTest}
                </p>
              )}

              {errors.location && (
                <p className="text-red-500 text-sm">
                  {errors.location}
                </p>
              )}
            </div>

            {/* Tipo y Estado */}
            <div className="grid grid-cols-2 gap-4">

              {/* Tipo */}
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.resolution}
                  onValueChange={(value) =>
                    setFormData({ ...formData, resolution: value })
                  }
                  disabled={esEdicion}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de cámara" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IP">IP</SelectItem>
                    <SelectItem value="Domo">Domo</SelectItem>
                    <SelectItem value="Bullet">Bullet</SelectItem>
                    <SelectItem value="PTZ">PTZ</SelectItem>
                  </SelectContent>
                </Select>
                {errors.resolution && (
                  <p className="text-red-500 text-sm">
                    {errors.resolution}
                  </p>
                )}
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activa">Activa</SelectItem>
                    <SelectItem value="inactiva">Inactiva</SelectItem>
                    <SelectItem value="mantenimiento">
                      Mantenimiento
                    </SelectItem>
                    <SelectItem value="desconectada">
                      Desconectada
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-red-500 text-sm">
                    {errors.status}
                  </p>
                )}
              </div>

            </div>
          </div>

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
              {loading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {esEdicion ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
