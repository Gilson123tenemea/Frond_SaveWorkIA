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

export function EmpresaDialog({
  open,
  onOpenChange,
  empresa,
  onSuccess,
}: EmpresaDialogProps) {
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

  // Saneador universal + validación en tiempo real
  const handleChange = (campo: string, valor: string) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));

    // VALIDACIÓN automática por campo
    let error = null;
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

    setErrors((prev: any) => ({ ...prev, [campo]: error }));
  };

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

  const validateForm = () => {
    const campos = ["nombreEmpresa", "ruc", "direccion", "telefono", "correo", "sector"];
    const newErrors: any = {};

    campos.forEach((campo) => {
      const valor = (formData as any)[campo];

      newErrors[campo] =
        campoObligatorio(valor, campo) ||
        (campo === "nombreEmpresa" && validarNombreEmpresa(valor)) ||
        (campo === "telefono" && validarTelefono(valor)) ||
        (campo === "ruc" && validarRuc(valor)) ||
        (campo === "correo" && validarCorreo(valor)) ||
        null;
    });

    setErrors(newErrors);
    return Object.values(newErrors).every((x) => x === null);
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("⚠️ Corrige los campos marcados en rojo.");
      return;
    }

    const payload: any = {
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

    // Estilos personalizados
    const toastOptions = empresa
      ? {
          // 🔵 Azul editar
          style: {
            background: "#2563eb",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: 600,
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#1e3a8a",
          },
        }
      : {
          // 🟢 Verde crear
          style: {
            background: "#16a34a",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: 600,
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#166534",
          },
        };

    toast.promise(
      promise,
      {
        loading: empresa
          ? "Actualizando empresa..."
          : "Registrando empresa...",

        success: empresa
          ? `Empresa "${formData.nombreEmpresa}" actualizada con éxito`
          : `Empresa "${formData.nombreEmpresa}" registrada correctamente`,

        error: (err: any) => {
          const backendMsg =
            err?.response?.data?.detail ||
            err?.detail ||
            err?.message ||
            "Ocurrió un error";
          return `⚠️ ${backendMsg}`;
        },
      },
      toastOptions
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
              ? "Actualiza los datos de la empresa."
              : "Ingresa los datos de la nueva empresa."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Nombre */}
            <div>
              <Label>Nombre de la Empresa</Label>
              <Input
                maxLength={50}
                className={errors.nombreEmpresa ? "border-red-500" : ""}
                value={formData.nombreEmpresa}
                onChange={(e) =>
                  handleChange(
                    "nombreEmpresa",
                    e.target.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ ]/g, "")
                  )
                }
                placeholder="Ej: Constructora ABC"
              />
              {errors.nombreEmpresa && (
                <p className="text-red-500 text-sm">{errors.nombreEmpresa}</p>
              )}
            </div>

            {/* RUC */}
            <div>
              <Label>RUC</Label>
              <Input
                maxLength={13}
                disabled={!!empresa}
                className={errors.ruc ? "border-red-500" : ""}
                value={formData.ruc}
                onChange={(e) =>
                  handleChange("ruc", e.target.value.replace(/\D/g, ""))
                }
                placeholder="Ej: 1790012345001"
              />
              {errors.ruc && <p className="text-red-500 text-sm">{errors.ruc}</p>}
            </div>

            {/* Dirección */}
            <div>
              <Label>Dirección</Label>
              <Input
                className={errors.direccion ? "border-red-500" : ""}
                value={formData.direccion}
                onChange={(e) => handleChange("direccion", e.target.value)}
                placeholder="Dirección completa"
              />
              {errors.direccion && (
                <p className="text-red-500 text-sm">{errors.direccion}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <Label>Teléfono</Label>
              <Input
                maxLength={10}
                className={errors.telefono ? "border-red-500" : ""}
                value={formData.telefono}
                onChange={(e) =>
                  handleChange("telefono", e.target.value.replace(/\D/g, ""))
                }
                placeholder="0998887766"
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
                className={errors.correo ? "border-red-500" : ""}
                value={formData.correo}
                onChange={(e) => handleChange("correo", e.target.value)}
                placeholder="contacto@empresa.com"
              />
              {errors.correo && (
                <p className="text-red-500 text-sm">{errors.correo}</p>
              )}
            </div>

            {/* Sector */}
            <div>
              <Label>Sector</Label>
              <Input
                className={errors.sector ? "border-red-500" : ""}
                value={formData.sector}
                onChange={(e) => handleChange("sector", e.target.value)}
                placeholder="Ej: Construcción / Tecnología"
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
