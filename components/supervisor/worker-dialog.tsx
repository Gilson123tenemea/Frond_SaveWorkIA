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

// Servicios
import {
  registrarTrabajador,
  editarTrabajador,
  validarCedulaInstantanea,
  validarCorreoInstantaneo,
  validarCodigoInstantaneo,
  verificarCorreoTrabajador, // ✨ NUEVO
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
  validarAreaTrabajo,
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

  // ✨ NUEVO: Estado para validación de correo
  const [correoValidacion, setCorreoValidacion] = useState<{
    validando: boolean;
    disponible: boolean | null;
  }>({
    validando: false,
    disponible: null,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 👉 Tipo para evitar error TS7006
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
    area_trabajo: "",
    implementos_requeridos: "",
    estado: true,
    codigo_trabajador: "",
    id_empresa: 0,
    id_supervisor_trabajador: 0,
  });

  // ✨ NUEVA FUNCIÓN: Validar correo en tiempo real
  const validarCorreoEnTiempoReal = async (correo: string) => {
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Si está vacío o inválido, no validar en servidor
    if (!correo.trim()) {
      setCorreoValidacion({ validando: false, disponible: null });
      return;
    }

    // Validar formato primero
    const errorFormato = validarCorreo(correo);
    if (errorFormato) {
      setCorreoValidacion({ validando: false, disponible: null });
      return;
    }

    // Si estamos editando y el correo es el mismo, no validar en servidor
    if (isEditing && correo === worker.persona.correo) {
      setCorreoValidacion({ validando: false, disponible: true });
      return;
    }

    // Mostrar estado "validando"
    setCorreoValidacion({ validando: true, disponible: null });

    // Debounce: esperar 500ms
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

  // -------------------------------------------------
  // VALIDAR CAMPO
  // -------------------------------------------------
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
        // ✨ NUEVO: Validar en tiempo real
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

      case "area_trabajo":
        error = validarAreaTrabajo(value);
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
          const existe = await validarCodigoInstantaneo(value);
          if (existe) error = "Este código ya está registrado";
        }
        break;

    }

    setErrors((prev: any) => ({ ...prev, [name]: error }));
    return error;
  };

  // -------------------------------------------------
  // VALIDAR TODO
  // -------------------------------------------------
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

  // -------------------------------------------------
  // PRECARGA
  // -------------------------------------------------
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
        area_trabajo: worker.area_trabajo,
        implementos_requeridos: worker.implementos_requeridos,
        estado: worker.estado,
        codigo_trabajador: worker.codigo_trabajador,
        id_empresa: worker.id_empresa,
        id_supervisor_trabajador: worker.id_supervisor_trabajador,
      });
      // Al editar, correo ya validado
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
        area_trabajo: "",
        implementos_requeridos: "",
        estado: true,
        codigo_trabajador: "",
        id_empresa: 0,
        id_supervisor_trabajador: 0,
      });

      cargarEmpresa();
      setCorreoValidacion({ validando: false, disponible: null });
    }
  }, [worker, open]);

  // -------------------------------------------------
  // SUBMIT FINAL
  // -------------------------------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const esValido = await validateAll();
    if (!esValido) {
      toast.error("❌ Corrija los campos marcados en rojo", {
        style: {
          background: "#dc2626",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: 500,
        },
      });
      return;
    }

    // ✨ NUEVO: Verificar que correo esté disponible
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
        area_trabajo: formData.area_trabajo,
        implementos_requeridos: formData.implementos_requeridos,
        estado: formData.estado,
        codigo_trabajador: formData.codigo_trabajador,
        id_empresa: formData.id_empresa,
        id_supervisor_trabajador: formData.id_supervisor_trabajador,
      },
    };

    try {
      if (isEditing) {
        // 🔵 ACTUALIZAR TRABAJADOR
        const promise = editarTrabajador(worker.id_trabajador, body);

        toast.loading("Actualizando trabajador...", {
          id: "worker-update",
          style: {
            background: "#2563eb",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: 500,
          },
        });

        try {
          await promise;

          toast.success(
            `Trabajador "${formData.nombre} ${formData.apellido}" actualizado con éxito`,
            {
              id: "worker-update",
              style: {
                background: "#1d4ed8",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: 500,
              },
            }
          );

          onClose();
        } catch {
          toast.error("❌ No se pudo actualizar el trabajador", {
            id: "worker-update",
            style: {
              background: "#dc2626",
              color: "#fff",
              borderRadius: "8px",
              fontWeight: 500,
            },
          });
        }
      } else {
        // 🟢 REGISTRAR TRABAJADOR
        const promise = registrarTrabajador(body);

        toast.loading("Registrando trabajador...", {
          id: "worker-create",
          style: {
            background: "#16a34a",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: 500,
          },
        });

        try {
          await promise;

          toast.success(
            `Trabajador "${formData.nombre} ${formData.apellido}" registrado exitosamente`,
            {
              id: "worker-create",
              style: {
                background: "#15803d",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: 500,
              },
            }
          );

          onClose();
        } catch {
          toast.error("❌ No se pudo registrar el trabajador", {
            id: "worker-create",
            style: {
              background: "#dc2626",
              color: "#fff",
              borderRadius: "8px",
              fontWeight: 500,
            },
          });
        }
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
    }

    setLoading(false);
  };



  // -------------------------------------------------
  // RENDER ERROR
  // -------------------------------------------------
  const renderError = (field: string) =>
    errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>;

  // -------------------------------------------------
  // RENDER
  // -------------------------------------------------
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[75vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Trabajador" : "Registrar Trabajador"}</DialogTitle>
          <DialogDescription>Complete los campos requeridos.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">

          {/* CÉDULA */}
          <div>
            <Label>Cédula</Label>
            <Input
              maxLength={10}
              disabled={isEditing}
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
          <div>
            <Label>Nombre</Label>
            <Input
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
          <div>
            <Label>Apellido</Label>
            <Input
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
          <div>
            <Label>Teléfono</Label>
            <Input
              maxLength={10}
              value={formData.telefono}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setFormData({ ...formData, telefono: value });
                validateField("telefono", value);
              }}
            />
            {renderError("telefono")}
          </div>

          {/* CORREO CON VALIDACIÓN EN TIEMPO REAL */}
          <div>
            <Label>Correo</Label>
            <Input
              value={formData.correo}
              disabled={isEditing}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, correo: value });
                validateField("correo", value);
              }}
            />
            {/* ✨ SOLO MOSTRAR SI EL CORREO YA EXISTE */}
            {!isEditing && correoValidacion.disponible === false && (
              <p className="text-sm text-red-600 mt-1">Este correo ya está registrado</p>
            )}
            {renderError("correo")}
          </div>

          {/* DIRECCIÓN */}
          <div>
            <Label>Dirección</Label>
            <Input
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
          <div>
            <Label>Género</Label>
            <Select
              value={formData.genero}
              onValueChange={(value) => {
                setFormData({ ...formData, genero: value });
                validateField("genero", value);
              }}
            >
              <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Femenino">Femenino</SelectItem>
              </SelectContent>
            </Select>
            {renderError("genero")}
          </div>

          {/* FECHA NACIMIENTO */}
          <div>
            <Label>Fecha nacimiento</Label>
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
            <div>
              <Label>Contraseña</Label>
              <Input
                type="password"
                value={formData.contrasena}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, contrasena: value });
                  validateField("contrasena", value);
                }}
              />
              {renderError("contrasena")}
            </div>
          )}

          {/* CARGO */}
          <div>
            <Label>Cargo</Label>
            <Input
              value={formData.cargo}
              onChange={(e) => {
                const value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, "");
                setFormData({ ...formData, cargo: value });
                validateField("cargo", value);
              }}
            />
            {renderError("cargo")}
          </div>

          {/* ÁREA TRABAJO */}
          <div>
            <Label>Área de trabajo</Label>
            <Input
              value={formData.area_trabajo}
              onChange={(e) => {
                const value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ0-9 ]/g, "");
                setFormData({ ...formData, area_trabajo: value });
                validateField("area_trabajo", value);
              }}
            />
            {renderError("area_trabajo")}
          </div>

          {/* IMPLEMENTOS */}
          <div>
            <Label>Implementos</Label>
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
          <div>
            <Label>Estado</Label>
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
          <div>
            <Label>Código (TRA-001)</Label>
            <Input
              maxLength={7}
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
          <div className="col-span-2 flex justify-end gap-2 pt-4">
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