"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { obtenerPerfilSupervisor, actualizarPerfilSupervisor } from "@/servicios/supervisor";
import { Camera } from "lucide-react";
import { actualizarFotoPersona } from "@/servicios/persona";
import toast from "react-hot-toast";

interface SupervisorProfileProps {
  open: boolean;
  onClose: () => void;
  idSupervisor?: number | null;
}

export function SupervisorProfile({ open, onClose, idSupervisor }: SupervisorProfileProps) {
  const [data, setData] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Campos editables
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
  });

  // ==============================
  // 🔵 Obtener perfil completo
  // ==============================
  useEffect(() => {
    if (open && idSupervisor) {
      obtenerPerfilSupervisor(idSupervisor)
        .then((res) => {
          setData(res);

          setForm({
            nombre: res.nombre,
            correo: res.correo,
            telefono: res.telefono ?? "",
          });

          if (res.foto) {
            setProfileImage(`data:image/jpeg;base64,${res.foto}`);
          }
        })
        .catch(console.error);
    }
  }, [open, idSupervisor]);

  // ==============================
  // 🔵 SUBIR FOTO
  // ==============================
  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setProfileImage(base64);

      try {
        await actualizarFotoPersona(data.id_persona, base64);
        toast.success("Foto actualizada correctamente");
      } catch {
        toast.error("Error al actualizar la foto");
      }
    };
    reader.readAsDataURL(file);
  };

  // ==============================
  // 🔵 Manejar cambios
  // ==============================
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ==============================
  // 🔵 Guardar cambios en Backend
  // ==============================
  const handleSave = async () => {
    if (!idSupervisor) return;

    // Validación simple
    if (!form.nombre.trim()) return toast.error("El nombre es obligatorio");
    if (!form.correo.trim()) return toast.error("El correo es obligatorio");
    if (!form.telefono.trim()) return toast.error("El teléfono es obligatorio");

    try {
      await actualizarPerfilSupervisor(idSupervisor, form);
      toast.success("Perfil actualizado correctamente");

      // Refrescar datos visuales
      setData({ ...data, ...form });

      setEditMode(false);
    } catch {
      toast.error("Error al actualizar el perfil");
    }
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-xl">
        
        {/* ==============================
            HEADER
        ============================== */}
        <div className="bg-primary text-primary-foreground px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-wide">
              Perfil del Supervisor
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6">

          {/* ==============================
              FOTO + NOMBRE
          ============================== */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <img
                src={profileImage || "/default-avatar.png"}
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 shadow"
                alt="profile"
              />

              <label className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer">
                <Camera className="w-4 h-4" />
                <input type="file" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>

            <div>
              {editMode ? (
                <>
                  <Label>Nombre</Label>
                  <Input name="nombre" value={form.nombre} onChange={handleChange} />
                </>
              ) : (
                <h2 className="text-xl font-bold">
                  {data?.nombre} {data?.apellido}
                </h2>
              )}

              <p className="text-sm text-gray-500">Supervisor</p>
            </div>
          </div>

          {/* ==============================
              INFORMACIÓN PERSONAL
          ============================== */}
          <h3 className="text-lg font-semibold mb-3">Información Personal</h3>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <Label>Correo</Label>
              {editMode ? (
                <Input name="correo" value={form.correo} onChange={handleChange} />
              ) : (
                <p>{data?.correo}</p>
              )}
            </div>

            <div>
              <Label>Teléfono</Label>
              {editMode ? (
                <Input name="telefono" value={form.telefono} onChange={handleChange} />
              ) : (
                <p>{data?.telefono}</p>
              )}
            </div>

            <div>
              <Label>Dirección</Label>
              <p>{data?.direccion}</p>
            </div>

            <div>
              <Label>Género</Label>
              <p>{data?.genero}</p>
            </div>

            <div>
              <Label>Fecha Nacimiento</Label>
              <p>{data?.fecha_nacimiento}</p>
            </div>
          </div>

          {/* ==============================
              INFORMACIÓN LABORAL
          ============================== */}
          <h3 className="text-lg font-semibold mt-6 mb-3">Información Laboral</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Especialidad</Label>
              <p>{data?.especialidad_seguridad}</p>
            </div>

            <div>
              <Label>Experiencia</Label>
              <p>{data?.experiencia} años</p>
            </div>
          </div>

          {/* ==============================
              EMPRESA
          ============================== */}
          <h3 className="text-lg font-semibold mt-6 mb-3">Empresa</h3>

          <div className="bg-gray-50 p-4 rounded-lg border">
            <p><strong>Nombre:</strong> {data?.empresa?.nombre}</p>
            <p><strong>RUC:</strong> {data?.empresa?.ruc}</p>
            <p><strong>Dirección:</strong> {data?.empresa?.direccion}</p>
            <p><strong>Teléfono:</strong> {data?.empresa?.telefono}</p>
          </div>

          {/* ==============================
              BOTONES
          ============================== */}
          <div className="flex justify-end mt-6 gap-3">
            <Button variant="outline" onClick={onClose}>Cerrar</Button>

            {!editMode ? (
              <Button variant="default" onClick={() => setEditMode(true)}>
                Editar Perfil
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                Guardar Cambios
              </Button>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
