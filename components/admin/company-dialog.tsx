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
import { Building2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { crearEmpresa, actualizarEmpresa } from "@/servicios/empresa";
import { getUser } from "@/lib/auth";

import {
  campoObligatorio,
  validarNombreEmpresa,
  validarTelefono,
  validarRuc,
  validarCorreo,
} from "@/components/validaciones/empresa-validaciones";

interface EmpresaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresa: any | null;
  onSuccess: () => void;
}

export function EmpresaDialog({ open, onOpenChange, empresa, onSuccess }: EmpresaDialogProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [formData, setFormData] = useState({
    nombreEmpresa: "",
    ruc: "",
    direccion: "",
    telefono: "",
    correo: "",
    sector: "",
    id_administrador_empresa: 0,
  });

  // CARGAR DATOS
  useEffect(() => {
    const user = getUser();
    const adminId = user?.id_administrador;

    if (empresa) {
      setFormData({
        nombreEmpresa: empresa.nombreEmpresa,
        ruc: empresa.ruc,
        direccion: empresa.direccion,
        telefono: empresa.telefono,
        correo: empresa.correo,
        sector: empresa.sector,
        id_administrador_empresa: empresa.id_administrador_empresa,
      });
    } else {
      setFormData({
        nombreEmpresa: "",
        ruc: "",
        direccion: "",
        telefono: "",
        correo: "",
        sector: "",
        id_administrador_empresa: adminId ?? 0,
      });
    }

    setErrors({});
  }, [empresa, open]);

  // VALIDACIONES
  const validateForm = () => {
    const newErrors: any = {};

    newErrors.nombreEmpresa =
      campoObligatorio(formData.nombreEmpresa, "Nombre de la empresa") ||
      validarNombreEmpresa(formData.nombreEmpresa);

    newErrors.ruc =
      campoObligatorio(formData.ruc, "RUC") || validarRuc(formData.ruc);

    newErrors.direccion = campoObligatorio(formData.direccion, "Dirección");

    newErrors.telefono =
      campoObligatorio(formData.telefono, "Teléfono") ||
      validarTelefono(formData.telefono);

    newErrors.correo =
      campoObligatorio(formData.correo, "Correo electrónico") ||
      validarCorreo(formData.correo);

    newErrors.sector = campoObligatorio(formData.sector, "Sector");

    setErrors(newErrors);

    return Object.values(newErrors).every((e) => e === null);
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("⚠️ Corrige los campos marcados en rojo.");
      return;
    }

    let payload: any = {
      nombreEmpresa: formData.nombreEmpresa,
      direccion: formData.direccion,
      telefono: formData.telefono,
      correo: formData.correo,
      sector: formData.sector,
      id_administrador_empresa: formData.id_administrador_empresa,
    };

    if (!empresa) payload.ruc = formData.ruc;

    const promise = empresa
      ? actualizarEmpresa(empresa.id_Empresa, payload)
      : crearEmpresa(payload);

    toast.promise(
      promise,
      {
        loading: empresa ? "Actualizando empresa..." : "Registrando empresa...",
        success: empresa
          ? `Empresa "${formData.nombreEmpresa}" actualizada con éxito`
          : `Empresa "${formData.nombreEmpresa}" registrada exitosamente`,
        error: (err: any) => {
          const backendMsg =
            err?.response?.data?.detail ||
            err?.detail ||
            err?.message ||
            "Ocurrió un error";
          return `⚠️ ${backendMsg}`;
        },
      },
      {
        // 🔵 LOADING
        loading: {
          style: {
            background: "#2563eb",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: 500,
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#1e3a8a",
          },
        },
        // 🟢 SUCCESS
        success: {
          style: {
            background: "#16a34a",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: 500,
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#14532d",
          },
        },
        // 🔴 ERROR
        error: {
          style: {
            background: "#dc2626",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: 500,
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#7f1d1d",
          },
        },
      }
    );

    try {
      await promise;
      onSuccess();
      onOpenChange(false);
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {empresa ? "Editar Empresa" : "Registrar Nueva Empresa"}
          </DialogTitle>
          <DialogDescription>
            {empresa
              ? "Actualiza los datos de la empresa"
              : "Registra una nueva empresa en el sistema"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Nombre */}
            <div>
              <Label>Nombre de la Empresa</Label>
              <Input
                placeholder="Ej: Constructora ABC"
                value={formData.nombreEmpresa}
                onChange={(e) =>
                  setFormData({ ...formData, nombreEmpresa: e.target.value })
                }
              />
              {errors.nombreEmpresa && (
                <p className="text-red-500 text-sm">{errors.nombreEmpresa}</p>
              )}
            </div>

            {/* RUC */}
            <div>
              <Label>RUC</Label>
              <Input
                placeholder="Ej: 1790012345001"
                value={formData.ruc}
                disabled={!!empresa}
                onChange={(e) =>
                  setFormData({ ...formData, ruc: e.target.value })
                }
              />
              {errors.ruc && (
                <p className="text-red-500 text-sm">{errors.ruc}</p>
              )}
            </div>

            {/* Dirección */}
            <div>
              <Label>Dirección</Label>
              <Input
                placeholder="Ej: Av. Loja y Remigio Crespo"
                value={formData.direccion}
                onChange={(e) =>
                  setFormData({ ...formData, direccion: e.target.value })
                }
              />
              {errors.direccion && (
                <p className="text-red-500 text-sm">{errors.direccion}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <Label>Teléfono</Label>
              <Input
                placeholder="0998887766"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
              />
              {errors.telefono && (
                <p className="text-red-500 text-sm">{errors.telefono}</p>
              )}
            </div>

            {/* Correo */}
            <div>
              <Label>Correo Electrónico</Label>
              <Input
                type="email"
                placeholder="contacto@empresa.com"
                value={formData.correo}
                onChange={(e) =>
                  setFormData({ ...formData, correo: e.target.value })
                }
              />
              {errors.correo && (
                <p className="text-red-500 text-sm">{errors.correo}</p>
              )}
            </div>

            {/* Sector */}
            <div>
              <Label>Sector</Label>
              <Input
                placeholder="Ej: Construcción / Tecnología / Legal"
                value={formData.sector}
                onChange={(e) =>
                  setFormData({ ...formData, sector: e.target.value })
                }
              />
              {errors.sector && (
                <p className="text-red-500 text-sm">{errors.sector}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {empresa ? "Actualizar" : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
