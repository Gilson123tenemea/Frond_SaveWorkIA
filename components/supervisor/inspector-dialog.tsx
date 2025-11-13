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
import { registrarInspector, editarInspector } from "../../servicios/inspector";

interface InspectorDialogProps {
  open: boolean;
  onClose: () => void;
  inspector: any | null;
}

export function InspectorDialog({ open, onClose, inspector }: InspectorDialogProps) {
  const currentUser = getUser();
  const isEditing = Boolean(inspector);

  // 📋 Estado del formulario
  const [formData, setFormData] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    direccion: "",
    genero: "Masculino",
    fecha_nacimiento: "",
    contrasena: "",
    zona_asignada: "",
    frecuenciaVisita: "",
  });

  useEffect(() => {
    if (isEditing) {
      setFormData({
        cedula: inspector.cedula || "",
        nombre: inspector.nombre || "",
        apellido: inspector.apellido || "",
        telefono: inspector.telefono || "",
        correo: inspector.correo || "",
        direccion: inspector.direccion || "",
        genero: inspector.genero || "Masculino",
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
        genero: "Masculino",
        fecha_nacimiento: "",
        contrasena: "",
        zona_asignada: "",
        frecuenciaVisita: "",
      });
    }
  }, [inspector, isEditing]);

  // 🧠 Guardar datos en backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
          contrasena: formData.contrasena, 
        },
        zona_asignada: formData.zona_asignada,
        frecuenciaVisita: formData.frecuenciaVisita,
        id_supervisor_registro: supervisorId,
      };

      if (isEditing) {
        await editarInspector(inspector.id_inspector, datosInspector);
        toast.success("✔ Datos actualizados correctamente");
      } else {
        await registrarInspector(datosInspector);
        toast.success("✔ Inspector registrado correctamente");
      }

      onClose();
    } catch (error: any) {
      console.error("❌ Error al guardar inspector:", error);
      toast.error(error.message || "Error al guardar el inspector");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Inspector" : "Registrar Inspector"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica la información del inspector"
              : "Completa los datos para registrar un nuevo inspector"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Datos personales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Cédula bloqueada al editar */}
            <div>
              <Label>Cédula</Label>
              <Input
                value={formData.cedula}
                onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                required
                disabled={isEditing} // 🔥 BLOQUEADO
              />
            </div>

            <div>
              <Label>Teléfono</Label>
              <Input
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Nombre</Label>
              <Input
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Apellido</Label>
              <Input
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Correo</Label>
              <Input
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Dirección</Label>
              <Input
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Fecha de nacimiento</Label>
              <Input
                type="date"
                value={formData.fecha_nacimiento}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_nacimiento: e.target.value })
                }
                required
              />
            </div>

            {/* Contraseña bloqueada al editar */}
            <div>
              <Label>Contraseña</Label>
              <Input
                type="password"
                value={formData.contrasena}
                onChange={(e) =>
                  setFormData({ ...formData, contrasena: e.target.value })
                }
                required={!isEditing}   // 🔥 SOLO requerido al crear
                disabled={isEditing}    // 🔥 BLOQUEADO al editar
              />
            </div>
          </div>

          {/* Datos específicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Zona Asignada</Label>
              <Input
                value={formData.zona_asignada}
                onChange={(e) =>
                  setFormData({ ...formData, zona_asignada: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>Frecuencia de Visita</Label>
              <Input
                value={formData.frecuenciaVisita}
                onChange={(e) =>
                  setFormData({ ...formData, frecuenciaVisita: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Género</Label>
              <Select
                value={formData.genero}
                onValueChange={(value) => setFormData({ ...formData, genero: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Femenino">Femenino</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botones */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Guardar Cambios" : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
