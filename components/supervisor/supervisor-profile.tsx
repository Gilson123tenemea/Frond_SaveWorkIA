"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera } from "lucide-react"
import toast from "react-hot-toast"

import {
  obtenerPerfilSupervisor,
  actualizarPerfilSupervisor,
} from "@/servicios/supervisor"
import { actualizarFotoPersona } from "@/servicios/persona"

interface SupervisorProfileProps {
  open: boolean
  onClose: () => void
  idSupervisor?: number | null
}

export function SupervisorProfile({
  open,
  onClose,
  idSupervisor,
}: SupervisorProfileProps) {
  const [data, setData] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
  })

  useEffect(() => {
    if (open && idSupervisor) {
      obtenerPerfilSupervisor(idSupervisor).then((res) => {
        setData(res)
        setForm({
          nombre: res.nombre,
          correo: res.correo,
          telefono: res.telefono ?? "",
        })

        if (res.foto) {
          setProfileImage(`data:image/jpeg;base64,${res.foto}`)
        }
      })
    }
  }, [open, idSupervisor])

  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result as string
      setProfileImage(base64)

      try {
        await actualizarFotoPersona(data.id_persona, base64)
        toast.success("Foto actualizada")
      } catch {
        toast.error("Error al subir foto")
      }
    }
    reader.readAsDataURL(file)
  }

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (!form.nombre || !form.correo || !form.telefono) {
      return toast.error("Completa todos los campos")
    }

    try {
      await actualizarPerfilSupervisor(idSupervisor!, form)
      toast.success("Perfil actualizado")
      setData({ ...data, ...form })
      setEditMode(false)
    } catch {
      toast.error("Error al guardar")
    }
  }

  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0 rounded-xl">

        {/* HEADER */}
        <div className="bg-primary text-primary-foreground px-5 py-3">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Perfil del Supervisor
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-5 space-y-5">

          {/* FOTO + NOMBRE */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profileImage || "/default-avatar.png"}
                className="w-20 h-20 rounded-full object-cover border"
              />
              <label className="absolute -bottom-1 -right-1 bg-primary p-1 rounded-full cursor-pointer">
                <Camera className="w-4 h-4 text-white" />
                <input type="file" hidden onChange={handleImageUpload} />
              </label>
            </div>

            <div>
              {editMode ? (
                <Input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                />
              ) : (
                <h2 className="font-semibold text-lg">
                  {data.nombre} {data.apellido}
                </h2>
              )}
              <p className="text-sm text-muted-foreground">Supervisor</p>
            </div>
          </div>

          {/* INFO PERSONAL */}
          <section>
            <h3 className="font-semibold mb-2">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <Label>Correo</Label>
                {editMode ? (
                  <Input name="correo" value={form.correo} onChange={handleChange} />
                ) : (
                  <p>{data.correo}</p>
                )}
              </div>

              <div>
                <Label>Teléfono</Label>
                {editMode ? (
                  <Input
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{data.telefono}</p>
                )}
              </div>

              <div>
                <Label>Dirección</Label>
                <p>{data.direccion}</p>
              </div>

              <div>
                <Label>Género</Label>
                <p>{data.genero}</p>
              </div>
            </div>
          </section>

          {/* LABORAL */}
          <section>
            <h3 className="font-semibold mb-2">Información Laboral</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <Label>Especialidad</Label>
                <p>{data.especialidad_seguridad}</p>
              </div>
              <div>
                <Label>Experiencia</Label>
                <p>{data.experiencia} años</p>
              </div>
            </div>
          </section>

          {/* EMPRESA */}
          <section>
            <h3 className="font-semibold mb-2">Empresa</h3>
            <div className="bg-muted p-3 rounded text-sm space-y-1">
              <p><b>Nombre:</b> {data.empresa?.nombre}</p>
              <p><b>RUC:</b> {data.empresa?.ruc}</p>
              <p><b>Dirección:</b> {data.empresa?.direccion}</p>
              <p><b>Teléfono:</b> {data.empresa?.telefono}</p>
            </div>
          </section>

          {/* BOTONES */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cerrar
            </Button>

            {!editMode ? (
              <Button size="sm" onClick={() => setEditMode(true)}>
                Editar
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSave}
              >
                Guardar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
