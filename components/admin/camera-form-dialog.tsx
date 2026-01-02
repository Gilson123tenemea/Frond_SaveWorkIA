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

  // Estado prueba cámara
  const [conexionOk, setConexionOk] = useState(false);
  const [testing, setTesting] = useState(false);
  const [mensajeTest, setMensajeTest] = useState<string | null>(null);
  const [tipoMensajeTest, setTipoMensajeTest] = useState<"ok" | "error" | null>(
    null
  );

  const esEdicion = !!camera;

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

  const validarFormulario = (esEdicion: boolean) => {
    const newErrors: Record<string, string | null> = {
      name: null,
      location: null,
      resolution: null,
      status: null,
    };

    if (!esEdicion) {
      if (!formData.name.trim()) {
        newErrors.name = "El nombre / código de la cámara es obligatorio";
      }
      if (!formData.location.trim()) {
        newErrors.location = "La URL de la cámara es obligatoria";
      }
      if (
        !formData.location.startsWith("http://") &&
        !formData.location.startsWith("https://") &&
        !formData.location.startsWith("rtsp://")
      ) {
        newErrors.location =
          "La URL debe empezar con http://, https:// o rtsp://";
      }
    }

    if (!formData.status) {
      newErrors.status = "El estado es obligatorio";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e !== null);
  };

  const handleProbarConexion = async () => {
    if (!formData.location.trim()) {
      toast.error("⚠️ Ingresa primero la URL de la cámara", {
        style: {
          background: "#dc2626",
          color: "#fff",
          fontWeight: 500,
        },
        iconTheme: { primary: "#fff", secondary: "#7f1d1d" },
      });
      return;
    }

    setTesting(true);
    setMensajeTest(null);
    setTipoMensajeTest(null);

    try {
      const resp = await probarConexionCamara(formData.location.trim());
      const msg = resp.message || "La cámara respondió correctamente";

      setConexionOk(true);
      setTipoMensajeTest("ok");
      setMensajeTest(msg);

      toast.success(msg, {
        style: {
          background: "#16a34a",
          color: "#fff",
          fontWeight: 500,
        },
        iconTheme: { primary: "#fff", secondary: "#14532d" },
      });
    } catch (err: any) {
      const msg = err?.message || "No se pudo conectar con la cámara";

      setConexionOk(false);
      setTipoMensajeTest("error");
      setMensajeTest(msg);

      toast.error(msg, {
        style: { background: "#dc2626", color: "#fff" },
        iconTheme: { primary: "#fff", secondary: "#7f1d1d" },
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario(esEdicion)) {
      toast.error("⚠️ Revise los campos del formulario", {
        style: {
          background: "#dc2626",
          color: "#fff",
          fontWeight: 500,
        },
        iconTheme: { primary: "#fff", secondary: "#7f1d1d" },
      });
      return;
    }

    if (!esEdicion && !conexionOk) {
      toast.error("⚠️ Primero prueba la conexión de la cámara", {
        style: {
          background: "#dc2626",
          color: "#fff",
          fontWeight: 500,
        },
        iconTheme: { primary: "#fff", secondary: "#7f1d1d" },
      });
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const adminId = user?.id_administrador ?? 0;

    let payload: any;

    if (esEdicion) {
      payload = { estado: formData.status };
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
      ? actualizarCamara(camera.id_camara, payload)
      : crearCamara(payload);

    toast.promise(
      promise,
      {
        loading: esEdicion ? "Actualizando cámara..." : "Registrando cámara...",
        success: esEdicion
          ? `Cámara ${formData.name} actualizada correctamente`
          : `Cámara ${formData.name} creada correctamente`,
        error: "❌ No se pudo completar la operación",
      },
      {
        style: {
          background: esEdicion ? "#2563EB" : "#16a34a",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: 500,
        },
        success: {
          style: {
            background: esEdicion ? "#2563EB" : "#16a34a",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: esEdicion ? "#1e3a8a" : "#14532d",
          },
        },
        error: {
          style: {
            background: "#dc2626",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#7f1d1d",
          },
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
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            {esEdicion ? "Editar Cámara" : "Crear Cámara"}
          </DialogTitle>
          <DialogDescription>
            {esEdicion
              ? "Modifica el estado de la cámara"
              : "Registra una nueva cámara para esta zona"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">

            {/* Código */}
            <div className="space-y-2">
              <Label>Código</Label>
              <Input
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (e.target.value.trim()) {
                    setErrors({ ...errors, name: null });
                  }
                }}
                disabled={esEdicion}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* URL */}
            <div className="space-y-2">
              <Label>URL Cámara</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.location}
                  onChange={(e) => {
                    setFormData({ ...formData, location: e.target.value });
                    setConexionOk(false);
                    setMensajeTest(null);
                    if (e.target.value.trim()) {
                      setErrors({ ...errors, location: null });
                    }
                  }}
                  disabled={esEdicion}
                />

                {!esEdicion && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={testing}
                    onClick={handleProbarConexion}
                  >
                    {testing ? "Probando..." : "Probar"}
                  </Button>
                )}
              </div>
              {errors.location && (
                <p className="text-red-500 text-sm">{errors.location}</p>
              )}
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
            </div>

            {/* Tipo y Estado */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo</Label>
                <Select
                  value={formData.resolution}
                  onValueChange={(val) =>
                    setFormData({ ...formData, resolution: val })
                  }
                  disabled={esEdicion}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IP">IP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData({ ...formData, status: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
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
              {esEdicion ? "Actualizar" : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}