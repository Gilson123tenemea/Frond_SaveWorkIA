"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import toast from "react-hot-toast";

// Estilos para ocultar el ojo nativo del navegador
const hidePasswordEyeStyles = `
  input[type="password"]::-webkit-outer-spin-button,
  input[type="password"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="password"]::-ms-reveal {
    display: none;
  }
`;

// Inyectar estilos
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = hidePasswordEyeStyles;
  document.head.appendChild(style);
}

// Servicios
import {
  registrarTrabajador,
  editarTrabajador,
  validarCedulaInstantanea,
  validarCorreoInstantaneo,
  validarCodigoInstantaneo,
  verificarCorreoTrabajador,
} from "../../servicios/trabajador";

import {
  validarCedulaEcuatoriana,
  validarNombre,
  validarApellido,
  validarTelefono,
  validarCorreo,
  validarDireccion,
  validarGenero,
  validarFechaNacimiento,
  validarCargo,
  validarImplementos,
  validarEstadoTrabajador,
  validarCodigoTrabajador,
  validarContrasena,
} from "../validaciones/validaciones";

import { obtenerEmpresaPorSupervisor } from "../../servicios/supervisor";
import { getUser } from "@/lib/auth";

export function WorkerDialog({ open, onClose, worker }: any) {
  const currentUser = getUser();
  const isEditing = Boolean(worker);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);

  const [correoValidacion, setCorreoValidacion] = useState<{
    validando: boolean;
    disponible: boolean | null;
  }>({
    validando: false,
    disponible: null,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  type FormDataType = typeof formData;

  const [formData, setFormData] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    direccion: "",
    genero: "",
    fecha_nacimiento: "",
    contrasena: "",
    cargo: "",
    implementos_requeridos: "",
    estado: true,
    codigo_trabajador: "",
    id_empresa: 0,
    id_supervisor_trabajador: 0,
  });

  const validarCorreoEnTiempoReal = async (correo: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!correo.trim()) {
      setCorreoValidacion({ validando: false, disponible: null });
      return;
    }

    const errorFormato = validarCorreo(correo);
    if (errorFormato) {
      setCorreoValidacion({ validando: false, disponible: null });
      return;
    }

    if (isEditing && correo === worker.persona.correo) {
      setCorreoValidacion({ validando: false, disponible: true });
      return;
    }

    setCorreoValidacion({ validando: true, disponible: null });

    timeoutRef.current = setTimeout(async () => {
      try {
        const disponible = await verificarCorreoTrabajador(correo);
        setCorreoValidacion({
          validando: false,
          disponible: disponible,
        });
      } catch (error) {
        console.error("Error validando correo:", error);
        setCorreoValidacion({ validando: false, disponible: null });
      }
    }, 500);
  };

  const validateField = async (name: string, value: any) => {
    let error = null;

    switch (name) {
      case "cedula":
        error = validarCedulaEcuatoriana(value);
        if (!error && !isEditing) {
          const existe = await validarCedulaInstantanea(value);
          if (existe) error = "Esta cédula ya está registrada";
        }
        break;

      case "correo":
        error = validarCorreo(value);
        if (!error || error === null) {
          validarCorreoEnTiempoReal(value);
        } else {
          setCorreoValidacion({ validando: false, disponible: null });
        }
        break;

      case "nombre":
        error = validarNombre(value);
        break;

      case "apellido":
        error = validarApellido(value);
        break;

      case "telefono":
        error = validarTelefono(value);
        break;

      case "direccion":
        error = validarDireccion(value);
        break;

      case "genero":
        error = validarGenero(value);
        break;

      case "fecha_nacimiento":
        error = validarFechaNacimiento(value);
        break;

      case "contrasena":
        if (!isEditing) error = validarContrasena(value);
        break;

      case "cargo":
        error = validarCargo(value);
        break;

      case "implementos_requeridos":
        error = validarImplementos(value);
        break;

      case "estado":
        error = validarEstadoTrabajador(value ? "activo" : "inactivo");
        break;

      case "codigo_trabajador":
        error = validarCodigoTrabajador(value);

        if (!error && !isEditing) {
          // ✅ CAMBIO: Ahora pasa idEmpresa
          const existe = await validarCodigoInstantaneo(value, formData.id_empresa);
          if (existe) error = "Este código ya está registrado";
        }

        // ✅ CAMBIO: Si está editando y cambió el código
        if (!error && isEditing && value !== worker.codigo_trabajador) {
          const existe = await validarCodigoInstantaneo(value, formData.id_empresa);
          if (existe) error = "Este código ya está registrado en esta empresa";
        }
        break;
    }

    setErrors((prev: any) => ({ ...prev, [name]: error }));
    return error;
  };

  const validateAll = async () => {
    const nuevosErrores: any = {};

    for (const key in formData) {
      const value = (formData as any)[key];
      const err = await validateField(key, value);
      nuevosErrores[key] = err;
    }

    setErrors(nuevosErrores);
    return !Object.values(nuevosErrores).some((e) => e);
  };

  useEffect(() => {
    async function cargarEmpresa() {
      if (currentUser?.id_supervisor) {
        const empresa = await obtenerEmpresaPorSupervisor(currentUser.id_supervisor);

        setFormData((prev: FormDataType) => ({
          ...prev,
          id_empresa: empresa.id_Empresa,
          id_supervisor_trabajador: currentUser?.id_supervisor ?? 0,
        }));
      }
    }

    if (open) {
      if (isEditing) {
        setFormData({
          cedula: worker.persona.cedula,
          nombre: worker.persona.nombre,
          apellido: worker.persona.apellido,
          telefono: worker.persona.telefono,
          correo: worker.persona.correo,
          direccion: worker.persona.direccion,
          genero: worker.persona.genero,
          fecha_nacimiento: worker.persona.fecha_nacimiento,
          contrasena: "",
          cargo: worker.cargo,
          implementos_requeridos: worker.implementos_requeridos,
          estado: worker.estado,
          codigo_trabajador: worker.codigo_trabajador,
          id_empresa: worker.id_empresa,
          id_supervisor_trabajador: worker.id_supervisor_trabajador,
        });
        setCorreoValidacion({ validando: false, disponible: true });
      } else {
        setFormData({
          cedula: "",
          nombre: "",
          apellido: "",
          telefono: "",
          correo: "",
          direccion: "",
          genero: "",
          fecha_nacimiento: "",
          contrasena: "",
          cargo: "",
          implementos_requeridos: "",
          estado: true,
          codigo_trabajador: "",
          id_empresa: 0,
          id_supervisor_trabajador: 0,
        });

        cargarEmpresa();
        setCorreoValidacion({ validando: false, disponible: null });
      }

      setErrors({});
    }
  }, [worker, open]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const esValido = await validateAll();
    if (!esValido) {
      toast.error("Corrija los campos marcados en rojo", {
        style: {
          background: "#dc2626",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: 500,
        },
      });
      return;
    }

    if (!isEditing && correoValidacion.disponible === false) {
      toast.error("❌ El correo ya está registrado");
      return;
    }

    setLoading(true);

    const body = {
      persona: {
        cedula: formData.cedula,
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        correo: formData.correo,
        direccion: formData.direccion,
        genero: formData.genero,
        fecha_nacimiento: formData.fecha_nacimiento,
        contrasena: formData.contrasena,
      },
      trabajador: {
        cargo: formData.cargo,
        implementos_requeridos: formData.implementos_requeridos,
        estado: formData.estado,
        codigo_trabajador: formData.codigo_trabajador,
        id_empresa: formData.id_empresa,
        id_supervisor_trabajador: formData.id_supervisor_trabajador,
      },
    };

    try {
      if (isEditing) {
        const promise = editarTrabajador(worker.id_trabajador, body);

        toast.promise(
          promise,
          {
            loading: "Actualizando trabajador...",
            success: `Trabajador "${formData.nombre} ${formData.apellido}" actualizado con éxito`,
            error: "Ocurrió un error al actualizar el trabajador",
          },
          {
            style: {
              background: "#1d4ed8",
              color: "#fff",
              borderRadius: "8px",
              fontWeight: 500,
              boxShadow: "0 2px 20px rgba(0, 0, 0, 0.25)",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#1e3a8a", 
            },
          }
        );

        await promise;
        onClose();
      } else {
        const promise = registrarTrabajador(body);

        toast.promise(
          promise,
          {
            loading: "Registrando trabajador...",
            success: `Trabajador "${formData.nombre} ${formData.apellido}" registrado exitosamente`,
            error: "Ocurrió un error al registrar el trabajador",
          },
          {
            style: {
              background: "#15803d",
              color: "#fff",
              borderRadius: "8px",
              fontWeight: 500,
              boxShadow: "0 2px 20px rgba(0, 0, 0, 0.2)",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#15803d", 
            },
          }
        );

        await promise;
        onClose();
      }
    } catch {
      toast.error("❌ Error inesperado", {
        style: {
          background: "#dc2626",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: 500,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const renderError = (field: string) =>
    errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Trabajador" : "Registrar Trabajador"}</DialogTitle>
          <DialogDescription>Complete los campos requeridos.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 px-2">

          {/* CÉDULA */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Cédula</Label>
            <Input
              maxLength={10}
              disabled={isEditing}
              placeholder="Ej: 0923456789"
              value={formData.cedula}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setFormData({ ...formData, cedula: value });
                validateField("cedula", value);
              }}
            />
            {renderError("cedula")}
          </div>

          {/* NOMBRE */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Nombre</Label>
            <Input
              placeholder="Ej: Juan"
              value={formData.nombre}
              onChange={(e) => {
                const value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, "");
                setFormData({ ...formData, nombre: value });
                validateField("nombre", value);
              }}
            />
            {renderError("nombre")}
          </div>

          {/* APELLIDO */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Apellido</Label>
            <Input
              placeholder="Ej: Pérez"
              value={formData.apellido}
              onChange={(e) => {
                const value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, "");
                setFormData({ ...formData, apellido: value });
                validateField("apellido", value);
              }}
            />
            {renderError("apellido")}
          </div>

          {/* TELÉFONO */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Teléfono</Label>
            <Input
              maxLength={10}
              placeholder="Ej: 0998765432"
              value={formData.telefono}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setFormData({ ...formData, telefono: value });
                validateField("telefono", value);
              }}
            />
            {renderError("telefono")}
          </div>

          {/* CORREO */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Correo</Label>
            <Input
              placeholder="Ej: juan.perez@mail.com"
              value={formData.correo}
              disabled={isEditing}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, correo: value });
                validateField("correo", value);
              }}
            />
            {!isEditing && correoValidacion.disponible === false && (
              <p className="text-sm text-red-600 mt-1">Este correo ya está registrado</p>
            )}
            {renderError("correo")}
          </div>

          {/* DIRECCIÓN */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Dirección</Label>
            <Input
              placeholder="Ej: Calle Principal #123"
              value={formData.direccion}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, direccion: value });
                validateField("direccion", value);
              }}
            />
            {renderError("direccion")}
          </div>

          {/* GÉNERO */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Género</Label>
            <Select
              value={formData.genero}
              onValueChange={(value) => {
                setFormData({ ...formData, genero: value });
                validateField("genero", value);
              }}
            >
              <SelectTrigger><SelectValue placeholder="Seleccione género" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Femenino">Femenino</SelectItem>
              </SelectContent>
            </Select>
            {renderError("genero")}
          </div>

          {/* FECHA NACIMIENTO */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Fecha nacimiento</Label>
            <Input
              type="date"
              value={formData.fecha_nacimiento}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, fecha_nacimiento: value });
                validateField("fecha_nacimiento", value);
              }}
            />
            {renderError("fecha_nacimiento")}
          </div>

          {/* CONTRASEÑA */}
          {!isEditing && (
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">Contraseña</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mín. 8 caracteres"
                  className="pr-10"
                  value={formData.contrasena}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, contrasena: value });
                    validateField("contrasena", value);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.871 9.871" />
                    </svg>
                  )}
                </button>
              </div>
              {renderError("contrasena")}
            </div>
          )}

          {/* CARGO */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Cargo</Label>
            <Input
              placeholder="Ej: Operario"
              value={formData.cargo}
              onChange={(e) => {
                const value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, "");
                setFormData({ ...formData, cargo: value });
                validateField("cargo", value);
              }}
            />
            {renderError("cargo")}
          </div>

          {/* IMPLEMENTOS */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Implementos</Label>
            <Select
              value={formData.implementos_requeridos}
              onValueChange={(value) => {
                setFormData({ ...formData, implementos_requeridos: value });
                validateField("implementos_requeridos", value);
              }}
            >
              <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Entregado">Entregado</SelectItem>
                <SelectItem value="No Entregado">No Entregado</SelectItem>
              </SelectContent>
            </Select>
            {renderError("implementos_requeridos")}
          </div>

          {/* ESTADO */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Estado</Label>
            <Select
              value={formData.estado ? "active" : "inactive"}
              onValueChange={(value) => {
                const booleanValue = value === "active";
                setFormData({ ...formData, estado: booleanValue });
                validateField("estado", booleanValue);
              }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            {renderError("estado")}
          </div>

          {/* CÓDIGO */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Código</Label>
            <Input
              maxLength={7}
              placeholder="Ej: TRA-001"
              value={formData.codigo_trabajador}
              onChange={async (e) => {
                let value = e.target.value.toUpperCase();

                value = value.replace(/[^A-Z0-9-]/g, "").replace(/--+/g, "-");

                setFormData((prev) => ({
                  ...prev,
                  codigo_trabajador: value,
                }));

                await validateField("codigo_trabajador", value);
              }}
            />
            {renderError("codigo_trabajador")}
          </div>

          {/* BOTONES */}
          <div className="col-span-2 flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || (!isEditing && correoValidacion.disponible === false)}>
              {loading ? "Guardando..." : isEditing ? "Guardar cambios" : "Registrar"}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}