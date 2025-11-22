"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { registrarSupervisor } from "../../servicios/supervisor"
import { useEffect } from "react"
import { obtenerEmpresasDisponibles } from "../../servicios/supervisor"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function UserDialog({ open, onOpenChange, onSuccess }: UserDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [empresas, setEmpresas] = useState<any[]>([])
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
    especialidad_seguridad: "",
    experiencia: "",
    id_empresa_supervisor: "",
  })

  useEffect(() => {
    if (open) {
      cargarEmpresas()
    }
  }, [open])

  const cargarEmpresas = async () => {
    try {
      const data = await obtenerEmpresasDisponibles();
      setEmpresas(data);
    } catch (error) {
      console.error("Error al cargar empresas disponibles:", error);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const datosSupervisor = {
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
        especialidad_seguridad: formData.especialidad_seguridad,
        experiencia: Number(formData.experiencia),
        id_empresa_supervisor: Number(formData.id_empresa_supervisor),
      }

      await registrarSupervisor(datosSupervisor)

      toast({
        title: "Supervisor registrado",
        description: "El supervisor fue registrado correctamente.",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: "Error al registrar",
        description: error.message || "Ocurrió un error al registrar el supervisor.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Registrar Supervisor
          </DialogTitle>
          <DialogDescription>
            Completa los datos personales y laborales del supervisor
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cedula">Cédula</Label>
            <Input
              id="cedula"
              placeholder="0102030405"
              value={formData.cedula}
              onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="David"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellido">Apellido</Label>
            <Input
              id="apellido"
              placeholder="López"
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              placeholder="0991234567"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="correo">Correo</Label>
            <Input
              id="correo"
              type="email"
              placeholder="david@gmail.com"
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              placeholder="Av. Central"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genero">Género</Label>
            <Select
              value={formData.genero}
              onValueChange={(value) => setFormData({ ...formData, genero: value })}
            >
              <SelectTrigger id="genero">
                <SelectValue placeholder="Seleccionar género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Femenino">Femenino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
            <Input
              id="fecha_nacimiento"
              type="date"
              value={formData.fecha_nacimiento}
              onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contrasena">Contraseña</Label>
            <Input
              id="contrasena"
              type="password"
              placeholder="•••••••"
              value={formData.contrasena}
              onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
              required
            />
          </div>

          {/* 👇 Pega aquí */}
          <div className="space-y-2">
            <Label htmlFor="empresa">Empresa</Label>
            <Select
              value={formData.id_empresa_supervisor || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, id_empresa_supervisor: value })
              }
            >
              <SelectTrigger id="empresa">
                <SelectValue placeholder="Seleccionar empresa" />
              </SelectTrigger>
              <SelectContent>
                {empresas.length > 0 ? (
                  empresas.map((empresa) => (
                    <SelectItem
                      key={empresa.id_Empresa}
                      value={empresa.id_Empresa.toString()}
                    >
                      {empresa.nombreEmpresa}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="">
                    No hay empresas activas
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="especialidad_seguridad">Especialidad</Label>
            <Input
              id="especialidad_seguridad"
              placeholder="Prevención de Riesgos Laborales"
              value={formData.especialidad_seguridad}
              onChange={(e) => setFormData({ ...formData, especialidad_seguridad: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experiencia">Años de experiencia</Label>
            <Input
              id="experiencia"
              type="number"
              placeholder="5"
              value={formData.experiencia}
              onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
              required
            />
          </div>




          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Registrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
