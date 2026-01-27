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

/* =====================
   TIPOS
===================== */

interface Empresa {
  id_Empresa: number;
  nombreEmpresa: string;
  ruc: string;
  direccion: string;
  telefono: string;
  correo: string;
  sector: string;
  id_administrador_empresa: number;
}

interface EmpresaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresa: Empresa | null;
  onSuccess: () => void;
}

interface FormDataEmpresa {
  nombreEmpresa: string;
  ruc: string;
  direccion: string;
  telefono: string;
  correo: string;
  sector: string;
  id_administrador_empresa: number;
}

interface CampoProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  disabled?: boolean;
  type?: string;
  maxLength?: number;
}

/* =====================
   COMPONENTE
===================== */

export function EmpresaDialog({
  open,
  onOpenChange,
  empresa,
  onSuccess,
}: EmpresaDialogProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const [formData, setFormData] = useState<FormDataEmpresa>({
    nombreEmpresa: "",
    ruc: "",
    direccion: "",
    telefono: "",
    correo: "",
    sector: "",
    id_administrador_empresa: 0,
  });

  const handleChange = (campo: keyof FormDataEmpresa, valor: string) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));

    let error: string | null = null;

    switch (campo) {
      case "nombreEmpresa":
        error =
          campoObligatorio(valor, "Nombre de la empresa") ||
          validarNombreEmpresa(valor);
        break;
      case "ruc":
        error = campoObligatorio(valor, "RUC") || validarRuc(valor);
        break;
      case "direccion":
        error = campoObligatorio(valor, "Dirección");
        break;
      case "telefono":
        error =
          campoObligatorio(valor, "Teléfono") || validarTelefono(valor);
        break;
      case "correo":
        error =
          campoObligatorio(valor, "Correo electrónico") ||
          validarCorreo(valor);
        break;
      case "sector":
        error = campoObligatorio(valor, "Sector");
        break;
    }

    setErrors((prev) => ({ ...prev, [campo]: error }));
  };

  useEffect(() => {
    const user = getUser();
    const adminId = user?.id_administrador ?? 0;

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
        id_administrador_empresa: adminId,
      });
    }

    setErrors({});
  }, [empresa, open]);

  const validateForm = (): boolean => {
    const campos: (keyof FormDataEmpresa)[] = [
      "nombreEmpresa",
      "ruc",
      "direccion",
      "telefono",
      "correo",
      "sector",
    ];

    const newErrors: Record<string, string | null> = {};

    campos.forEach((campo) => {
      const valor = formData[campo];
      const valorStr = String(valor)
      newErrors[campo] =
        campoObligatorio(valor, campo) ||
        (campo === "nombreEmpresa" && validarNombreEmpresa(valorStr)) ||
        (campo === "telefono" && validarTelefono(valorStr)) ||
        (campo === "ruc" && validarRuc(valorStr)) ||
        (campo === "correo" && validarCorreo(valorStr)) ||
        null;
    });

    setErrors(newErrors);
    return Object.values(newErrors).every((x) => x === null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Corrige los campos marcados en rojo.");
      return;
    }

    const payload = {
      nombreEmpresa: formData.nombreEmpresa,
      direccion: formData.direccion,
      telefono: formData.telefono,
      correo: formData.correo,
      sector: formData.sector,
      id_administrador_empresa: formData.id_administrador_empresa,
      ...(empresa ? {} : { ruc: formData.ruc }),
    };

    setLoading(true);

    const promise = empresa
      ? actualizarEmpresa(empresa.id_Empresa, payload)
      : crearEmpresa(payload);

    toast.promise(promise, {
      loading: empresa ? "Actualizando empresa..." : "Registrando empresa...",
      success: empresa
        ? "Empresa actualizada con éxito"
        : "Empresa registrada correctamente",
      error: "Ocurrió un error",
    }, {
      success: {
        style: {
          background: empresa ? "#2563EB" : "#16A34A", 
          color: "#fff",
        },
      },
      error: {
        style: {
          background: "#DC2626", 
          color: "#fff",
        },
      },
    });

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
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {empresa ? "Editar Empresa" : "Registrar Nueva Empresa"}
          </DialogTitle>
          <DialogDescription>
            {empresa
              ? "Actualiza los datos de la empresa."
              : "Ingresa los datos de la nueva empresa."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-2 py-2">
            <Campo
              label="Nombre de la Empresa"
              value={formData.nombreEmpresa}
              error={errors.nombreEmpresa}
              placeholder="Ej: Constructora ABC"
              onChange={(v) =>
                handleChange(
                  "nombreEmpresa",
                  v.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ ]/g, "")
                )
              }
            />

            <Campo
              label="RUC"
              value={formData.ruc}
              error={errors.ruc}
              disabled={!!empresa}
              maxLength={13}
              placeholder="Ej: 1790012345001"
              onChange={(v) =>
                handleChange("ruc", v.replace(/\D/g, "").slice(0, 13))
              }
            />

            <Campo
              label="Dirección"
              value={formData.direccion}
              error={errors.direccion}
              placeholder="Av. Amazonas y Naciones Unidas"
              onChange={(v) => handleChange("direccion", v)}
            />

            <Campo
              label="Teléfono"
              value={formData.telefono}
              error={errors.telefono}
              maxLength={10}
              placeholder="0998887766"
              onChange={(v) =>
                handleChange("telefono", v.replace(/\D/g, ""))
              }
            />

            <Campo
              label="Correo Electrónico"
              type="email"
              value={formData.correo}
              error={errors.correo}
              placeholder="contacto@empresa.com"
              onChange={(v) => handleChange("correo", v)}
            />

            <Campo
              label="Sector"
              value={formData.sector}
              error={errors.sector}
              placeholder="Construcción / Tecnología"
              onChange={(v) =>
                handleChange(
                  "sector",
                  v.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ /\-]/g, "")
                )
              }
            />
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
              {empresa ? "Actualizar" : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* =====================
   CAMPO REUTILIZABLE
===================== */

function Campo({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  type = "text",
  maxLength,
}: CampoProps) {
  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium">{label}</Label>
      <Input
        type={type}
        value={value}
        disabled={disabled}
        maxLength={maxLength}
        className={error ? "border-red-500" : ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="min-h-[14px]">
        {error && (
          <p className="text-red-500 text-xs leading-tight">{error}</p>
        )}
      </div>
    </div>
  );
}
