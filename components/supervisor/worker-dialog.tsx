"use client";

import React, { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

import { registrarTrabajador, editarTrabajador } from "../../servicios/trabajador";
import { obtenerEmpresaPorSupervisor } from "../../servicios/supervisor";

import { getUser } from "@/lib/auth";

export function WorkerDialog({ open, onClose, worker }: any) {
  const { toast } = useToast();
  const currentUser = getUser();
  const isEditing = Boolean(worker); 

  const [loading, setLoading] = useState(false);

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

  // ===========================
  // 🔵 PRE-CARGA DEL FORMULARIO
  // ===========================
  useEffect(() => {
    async function cargarEmpresa() {
      try {
        if (currentUser?.id_supervisor) {
          const empresa = await obtenerEmpresaPorSupervisor(currentUser.id_supervisor);

           setFormData((prev) => ({
            ...prev,
            id_empresa: empresa.id_Empresa,
            id_supervisor_trabajador: currentUser?.id_supervisor ?? 0,
          }));
        }
      } catch (err) {
        console.error("Error cargando empresa:", err);
      }
    }

    if (isEditing) {
      // 🔵 EDICIÓN
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
    } else {
      // 🔵 NUEVO
      setFormData((prev) => ({
        ...prev,
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
      }));

      cargarEmpresa();
    }
  }, [worker, open]);

  // ===========================
  // 🔵 ENVIAR FORMULARIO
  // ===========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        contrasena: formData.contrasena, // 🔥 vacío si es edición
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
        await editarTrabajador(worker.id_trabajador, body);
        toast({ title: "Trabajador actualizado" });
      } else {
        await registrarTrabajador(body);
        toast({ title: "Trabajador registrado" });
      }

      onClose();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Error inesperado",
      });
    }

    setLoading(false);
  };

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
              value={formData.cedula}
              disabled={isEditing}       // 🔥 BLOQUEADO
              required
              onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
            />
          </div>

          {/* NOMBRE */}
          <div>
            <Label>Nombre</Label>
            <Input
              value={formData.nombre}
              required
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
          </div>

          {/* APELLIDO */}
          <div>
            <Label>Apellido</Label>
            <Input
              value={formData.apellido}
              required
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
            />
          </div>

          {/* TELÉFONO */}
          <div>
            <Label>Teléfono</Label>
            <Input
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            />
          </div>

          {/* CORREO */}
          <div>
            <Label>Correo</Label>
            <Input
              type="email"
              value={formData.correo}
              required
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
            />
          </div>

          {/* DIRECCIÓN */}
          <div>
            <Label>Dirección</Label>
            <Input
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            />
          </div>

          {/* GÉNERO */}
          <div>
            <Label>Género</Label>
            <Select
              value={formData.genero}
              onValueChange={(value) => setFormData({ ...formData, genero: value })}
            >
              <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Femenino">Femenino</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* FECHA NACIMIENTO */}
          <div>
            <Label>Fecha de nacimiento</Label>
            <Input
              type="date"
              required
              value={formData.fecha_nacimiento}
              onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
            />
          </div>

          {/* CONTRASEÑA — SOLO NUEVO */}
          {!isEditing && (
            <div>
              <Label>Contraseña</Label>
              <Input
                type="password"
                required
                value={formData.contrasena}
                onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
              />
            </div>
          )}

          {/* CARGO */}
          <div>
            <Label>Cargo</Label>
            <Input
              required
              value={formData.cargo}
              onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
            />
          </div>

          {/* ÁREA */}
          <div>
            <Label>Área de trabajo</Label>
            <Input
              required
              value={formData.area_trabajo}
              onChange={(e) => setFormData({ ...formData, area_trabajo: e.target.value })}
            />
          </div>

          {/* IMPLEMENTOS */}
          <div>
            <Label>Implementos de seguridad</Label>
            <Select
              value={formData.implementos_requeridos}
              onValueChange={(value) => setFormData({ ...formData, implementos_requeridos: value })}
            >
              <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Entregado">Entregado</SelectItem>
                <SelectItem value="No Entregado">No Entregado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ESTADO */}
          <div>
            <Label>Estado</Label>
            <Select
              value={formData.estado ? "active" : "inactive"}
              onValueChange={(value) =>
                setFormData({ ...formData, estado: value === "active" })
              }
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* CÓDIGO */}
          <div>
            <Label>Código trabajador</Label>
            <Input
              required
              value={formData.codigo_trabajador}
              onChange={(e) => setFormData({ ...formData, codigo_trabajador: e.target.value })}
            />
          </div>

          {/* BOTONES */}
          <div className="col-span-2 flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : isEditing ? "Guardar cambios" : "Registrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
