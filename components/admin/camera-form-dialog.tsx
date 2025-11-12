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
import { crearCamara, actualizarCamara } from "@/servicios/camara";

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
    resolution: "1080p",
    status: "online",
  });

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
        resolution: "1080p",
        status: "online",
      });
    }
  }, [camera, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneId) {
      toast.error("No se pudo identificar la zona");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const adminId =
      user?.id_administrador || parseInt(localStorage.getItem("adminId") || "0");

    const payload = {
      codigo: formData.name.trim(),
      tipo: formData.resolution,
      estado: formData.status,
      ipAddress: formData.location.trim(),
      id_zona: zoneId,
      id_administrador: adminId,
      borrado: true,
    };

    const promise = camera
      ? actualizarCamara(camera.id_camara, payload)
      : crearCamara(payload);

    toast.promise(promise, {
      loading: camera ? "Actualizando cámara..." : "Registrando cámara...",
      success: camera
        ? `Cámara ${formData.name} actualizada correctamente`
        : `Cámara ${formData.name} registrada exitosamente`,
      error: (err) =>
        String(err?.message || "").includes("código")
          ? "⚠️ El código ya está registrado"
          : String(err?.message || "").includes("IP")
          ? "⚠️ La IP ya está en uso"
          : "❌ Error al guardar la cámara",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            {camera ? "Editar Cámara" : "Crear Nueva Cámara"}
          </DialogTitle>
          <DialogDescription>
            {camera
              ? "Actualiza los datos de la cámara"
              : "Registra una nueva cámara de seguridad"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre o Código de Cámara</Label>
              <Input
                id="name"
                placeholder="Ej: CAM-A01"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Dirección IP</Label>
              <Input
                id="location"
                placeholder="Ej: 192.168.1.20"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resolution">Tipo</Label>
                <Select
                  value={formData.resolution}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, resolution: value })
                  }
                >
                  <SelectTrigger id="resolution">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IP">IP</SelectItem>
                    <SelectItem value="Domo">Domo</SelectItem>
                    <SelectItem value="Bullet">Bullet</SelectItem>
                    <SelectItem value="PTZ">PTZ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activa">Activa</SelectItem>
                    <SelectItem value="inactiva">Inactiva</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="desconectada">Desconectada</SelectItem>
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
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {camera ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
