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
import { crearEmpresa, actualizarEmpresa } from "../../servicios/empresa";
import { getUser } from "@/lib/auth";

// 🟦 Importar validaciones
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

  // 🔴 errores por campo
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

  // ================================
  // CARGA DE DATOS
  // ================================
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

  // ================================
  // VALIDACIÓN COMPLETA
  // ================================
  const validateForm = () => {
    const newErrors: any = {};

    newErrors.nombreEmpresa =
      campoObligatorio(formData.nombreEmpresa, "Nombre de la empresa") ||
      validarNombreEmpresa(formData.nombreEmpresa);

    newErrors.ruc =
      campoObligatorio(formData.ruc, "RUC") ||
      validarRuc(formData.ruc);

    newErrors.direccion =
      campoObligatorio(formData.direccion, "Dirección");

    newErrors.telefono =
      campoObligatorio(formData.telefono, "Teléfono") ||
      validarTelefono(formData.telefono);

    newErrors.correo =
      campoObligatorio(formData.correo, "Correo electrónico") ||
      validarCorreo(formData.correo);

    newErrors.sector =
      campoObligatorio(formData.sector, "Sector");

    setErrors(newErrors);

    return Object.values(newErrors).every((e) => e === null);
  };

  // ================================
  // GUARDAR / ACTUALIZAR
  // ================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ❌ Si las validaciones fallan
    if (!validateForm()) {
      toast.error("⚠️ Corrige los campos marcados en rojo.");
      return;
    }

    const promise = empresa
      ? actualizarEmpresa(empresa.id_Empresa, formData)
      : crearEmpresa(formData);

    toast.promise(
      promise,
      {
        loading: empresa ? "Actualizando empresa..." : "Registrando empresa...",
        success: empresa
          ? `Empresa "${formData.nombreEmpresa}" actualizada con éxito`
          : `Empresa "${formData.nombreEmpresa}" registrada exitosamente`,
        error: "❌ Ocurrió un error al guardar la empresa",
      },
      {
        style: {
          background: empresa ? "#2563eb" : "#16a34a",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: 500,
          boxShadow: "0 2px 20px rgba(0, 0, 0, 0.2)",
        },
        iconTheme: {
          primary: "#fff",
          secondary: empresa ? "#1e3a8a" : "#15803d",
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {empresa ? "Editar Empresa" : "Registrar Nueva Empresa"}
          </DialogTitle>
          <DialogDescription>
            {empresa ? "Actualiza los datos de la empresa" : "Registra una nueva empresa en el sistema"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombreEmpresa">Nombre de la Empresa</Label>
              <Input
                id="nombreEmpresa"
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
            <div className="space-y-2">
              <Label htmlFor="ruc">RUC</Label>
              <Input
                id="ruc"
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
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
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
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
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
            <div className="space-y-2">
              <Label htmlFor="correo">Correo Electrónico</Label>
              <Input
                id="correo"
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
            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Input
                id="sector"
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
              {empresa ? "Actualizar" : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
