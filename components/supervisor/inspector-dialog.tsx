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

import { getUser } from "@/lib/auth";
import { toast } from "react-hot-toast";

// 🔥 VALIDACIONES
import {
  validarCedulaEcuatoriana,
  validarNombre,
  validarApellido,
  validarTelefono,
  validarCorreo,
  validarDireccion,
  validarGenero,
  validarFechaNacimiento,
  validarContrasena,
  validarZonaAsignada,
  validarFrecuenciaVisita,
} from "../validaciones/validaciones"

import {
  registrarInspector,
  editarInspector,
  verificarCedula,
} from "../../servicios/inspector";

interface InspectorDialogProps {
  open: boolean;
  onClose: () => void;
  inspector: any | null;
}

export function InspectorDialog({ open, onClose, inspector }: InspectorDialogProps) {
  const currentUser = getUser();
  const isEditing = Boolean(inspector);

  const [errors, setErrors] = useState<any>({});
  const [cedulaVerificada, setCedulaVerificada] = useState<boolean | null>(null);

  // 📋 Estado del formulario
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
    zona_asignada: "",
    frecuenciaVisita: "",
  });

  useEffect(() => {
    if (open) {
      if (isEditing) {
        setFormData({
          cedula: inspector.cedula || "",
          nombre: inspector.nombre || "",
          apellido: inspector.apellido || "",
          telefono: inspector.telefono || "",
          correo: inspector.correo || "",
          direccion: inspector.direccion || "",
          genero: inspector.genero || "",
          fecha_nacimiento: inspector.fecha_nacimiento || "",
          contrasena: "",
          zona_asignada: inspector.zona_asignada || "",
          frecuenciaVisita: inspector.frecuenciaVisita || "",
        });
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
          zona_asignada: "",
          frecuenciaVisita: "",
        });
      }
    }
  }, [open, inspector, isEditing]);


  // 🟦 Validación por campo
  const onChange = async (field: string, value: string) => {
    let formateado = value;

    // Filtros
    if (field === "cedula") formateado = value.replace(/[^0-9]/g, "").slice(0, 10);
    if (field === "telefono") formateado = value.replace(/[^0-9]/g, "").slice(0, 10);
    if (field === "nombre") formateado = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, "");
    if (field === "apellido") formateado = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, "");
    if (field === "direccion")
      formateado = value.replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúñÑ #.,-]/g, "");

    setFormData((prev) => ({ ...prev, [field]: formateado }));

    // Validaciones individuales
    let error = null;

    if (field === "cedula") {
      error = validarCedulaEcuatoriana(formateado);

      // 🔥 Verificar cédula repetida SOLO al crear
      if (!isEditing && formateado.length === 10 && !error) {
        const existe = await verificarCedula(formateado);
        if (existe) {
          error = "Ya existe un inspector activo con esta cédula";
          setCedulaVerificada(true);
        } else {
          setCedulaVerificada(false);
        }
      }
    }

    if (field === "nombre") error = validarNombre(formateado);
    if (field === "apellido") error = validarApellido(formateado);
    if (field === "telefono") error = validarTelefono(formateado);
    if (field === "correo") error = validarCorreo(formateado);
    if (field === "direccion") error = validarDireccion(formateado);
    if (field === "genero") error = validarGenero(formateado);
    if (field === "fecha_nacimiento") error = validarFechaNacimiento(formateado);
    if (field === "contrasena" && !isEditing) error = validarContrasena(formateado);
    if (field === "zona_asignada") error = validarZonaAsignada(formateado);
    if (field === "frecuenciaVisita") error = validarFrecuenciaVisita(formateado);

    setErrors((prev: any) => ({ ...prev, [field]: error }));
  };

  // 🟦 Validación general
  const formularioValido = () => {
    return Object.values(errors).every((e) => e === null) &&
      (!isEditing ? !cedulaVerificada : true);
  };
  // 🔵 Validar todos los campos al enviar
  const validarTodo = () => {
    const nuevosErrores: any = {};

    nuevosErrores.cedula = validarCedulaEcuatoriana(formData.cedula);
    nuevosErrores.nombre = validarNombre(formData.nombre);
    nuevosErrores.apellido = validarApellido(formData.apellido);
    nuevosErrores.telefono = validarTelefono(formData.telefono);
    nuevosErrores.correo = validarCorreo(formData.correo);
    nuevosErrores.direccion = validarDireccion(formData.direccion);
    nuevosErrores.genero = validarGenero(formData.genero);
    nuevosErrores.fecha_nacimiento = validarFechaNacimiento(formData.fecha_nacimiento);

    if (!isEditing) {
      nuevosErrores.contrasena = validarContrasena(formData.contrasena);
    }

    nuevosErrores.zona_asignada = validarZonaAsignada(formData.zona_asignada);
    nuevosErrores.frecuenciaVisita = validarFrecuenciaVisita(formData.frecuenciaVisita);

    setErrors(nuevosErrores);

    return Object.values(nuevosErrores).every((e) => e === null);
  };

  // 🟦 Guardar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔥 Validación completa ANTES de enviar
    const todoOk = validarTodo();
    if (!todoOk) {
      toast.error("❌ Debe completar todos los campos obligatorios");
      return;
    }

    // 🔥 Verificar cédula repetida SOLO al crear
    if (!isEditing && formData.cedula.length === 10) {
      const existe = await verificarCedula(formData.cedula);
      if (existe) {
        setErrors((prev: any) => ({
          ...prev,
          cedula: "Ya existe un inspector activo con esta cédula",
        }));
        toast.error("❌ La cédula ya está registrada");
        return;
      }
    }

    try {
      const supervisorId = currentUser?.id;

      const datosInspector: any = {
        persona: {
          cedula: formData.cedula,
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          correo: formData.correo,
          direccion: formData.direccion,
          genero: formData.genero,
          fecha_nacimiento: formData.fecha_nacimiento,
          contrasena: formData.contrasena, // ✔ Solo válida en crear
        },
        zona_asignada: formData.zona_asignada,
        frecuenciaVisita: formData.frecuenciaVisita,
        id_supervisor_registro: supervisorId,
      };

      if (isEditing) {
        const promise = editarInspector(inspector.id_inspector, datosInspector);

        toast.promise(
          promise,
          {
            loading: "Actualizando inspector...",
            success: `Inspector "${formData.nombre} ${formData.apellido}" actualizado con éxito`,
            error: "❌ Ocurrió un error al actualizar el inspector",
          },
          {
            style: {
              background: "#2563eb",
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

      } else {
        const promise = registrarInspector(datosInspector);

        toast.promise(
          promise,
          {
            loading: "Registrando inspector...",
            success: `Inspector "${formData.nombre} ${formData.apellido}" registrado exitosamente`,
            error: "❌ Ocurrió un error al registrar el inspector",
          },
          {
            style: {
              background: "#16a34a",
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


      }

      onClose();
    } catch (error: any) {
      console.error("❌ Error guardando inspector:", error);
      toast.error(error.message || "Error al guardar");
    }
  };


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Inspector" : "Registrar Inspector"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica la información del inspector"
              : "Completa los datos para registrar un nuevo inspector"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            {/* CÉDULA */}
            <div>
              <Label>Cédula</Label>
              <Input
                value={formData.cedula}
                disabled={isEditing}
                onChange={(e) => onChange("cedula", e.target.value)}
              />
              {errors.cedula && <p className="text-red-500 text-sm">{errors.cedula}</p>}
            </div>

            {/* TELÉFONO */}
            <div>
              <Label>Teléfono</Label>
              <Input
                value={formData.telefono}
                onChange={(e) => onChange("telefono", e.target.value)}
              />
              {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
            </div>

            {/* NOMBRE */}
            <div>
              <Label>Nombre</Label>
              <Input
                value={formData.nombre}
                onChange={(e) => onChange("nombre", e.target.value)}
              />
              {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
            </div>

            {/* APELLIDO */}
            <div>
              <Label>Apellido</Label>
              <Input
                value={formData.apellido}
                onChange={(e) => onChange("apellido", e.target.value)}
              />
              {errors.apellido && <p className="text-red-500 text-sm">{errors.apellido}</p>}
            </div>

            {/* CORREO */}
            <div>
              <Label>Correo</Label>
              <Input
                value={formData.correo}
                onChange={(e) => onChange("correo", e.target.value)}
              />
              {errors.correo && <p className="text-red-500 text-sm">{errors.correo}</p>}
            </div>

            {/* DIRECCIÓN */}
            <div>
              <Label>Dirección</Label>
              <Input
                value={formData.direccion}
                onChange={(e) => onChange("direccion", e.target.value)}
              />
              {errors.direccion && <p className="text-red-500 text-sm">{errors.direccion}</p>}
            </div>

            {/* FECHA NACIMIENTO */}
            <div>
              <Label>Fecha de Nacimiento</Label>
              <Input
                type="date"
                value={formData.fecha_nacimiento}
                onChange={(e) => onChange("fecha_nacimiento", e.target.value)}
              />
              {errors.fecha_nacimiento && (
                <p className="text-red-500 text-sm">{errors.fecha_nacimiento}</p>
              )}
            </div>

            {/* CONTRASEÑA */}
            <div>
              <Label>Contraseña</Label>
              <Input
                type="password"
                disabled={isEditing}
                value={formData.contrasena}
                onChange={(e) => onChange("contrasena", e.target.value)}
              />
              {!isEditing && errors.contrasena && (
                <p className="text-red-500 text-sm">{errors.contrasena}</p>
              )}
            </div>

            {/* ZONA ASIGNADA */}
            <div>
              <Label>Zona Asignada</Label>
              <Input
                value={formData.zona_asignada}
                onChange={(e) => onChange("zona_asignada", e.target.value)}
              />
              {errors.zona_asignada && (
                <p className="text-red-500 text-sm">{errors.zona_asignada}</p>
              )}
            </div>

            {/* FRECUENCIA VISITA */}
            <div>
              <Label>Frecuencia de Visita</Label>
              <Input
                value={formData.frecuenciaVisita}
                onChange={(e) => onChange("frecuenciaVisita", e.target.value)}
              />
              {errors.frecuenciaVisita && (
                <p className="text-red-500 text-sm">{errors.frecuenciaVisita}</p>
              )}
            </div>

            {/* GÉNERO */}
            <div>
              <Label>Género</Label>
              <Select
                value={formData.genero}
                onValueChange={(v) => onChange("genero", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Femenino">Femenino</SelectItem>
                </SelectContent>
              </Select>
              {errors.genero && <p className="text-red-500 text-sm">{errors.genero}</p>}
            </div>

          </div>

          {/* BOTONES */}
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={!formularioValido()}
            >
              {isEditing ? "Guardar Cambios" : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
