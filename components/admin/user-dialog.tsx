"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Shield, Loader2, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { registrarSupervisor, obtenerEmpresasDisponibles } from "../../servicios/supervisor"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function UserDialog({ open, onOpenChange, onSuccess }: UserDialogProps) {
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [empresas, setEmpresas] = useState<any[]>([])
  const [showPassword, setShowPassword] = useState(false)

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
      setShowPassword(false)
    }
  }, [open])

  const cargarEmpresas = async () => {
    try {
      const data = await obtenerEmpresasDisponibles()
      setEmpresas(data)
    } catch (error) {
      console.error("Error al cargar empresas:", error)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const payload = {
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

      await registrarSupervisor(payload)

      toast({
        title: "Supervisor registrado",
        description: "El supervisor fue registrado correctamente.",
      })

      onSuccess()
      onOpenChange(false)
    } catch (e: any) {
      toast({
        title: "Error",
        description: String(e.message),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl">

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Registrar Supervisor
          </DialogTitle>
          <DialogDescription>
            Completa la información requerida
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">

          {/* CÉDULA */}
          <div className="flex flex-col gap-1">
            <Label>Cédula <span className="text-muted-foreground font-normal">(Ej: 0102030405)</span></Label>
            <Input
              value={formData.cedula}
              onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
              required
            />
          </div>

          {/* NOMBRE */}
          <div className="flex flex-col gap-1">
            <Label>Nombre <span className="text-muted-foreground font-normal">(Ej: David)</span></Label>
            <Input
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>

          {/* APELLIDO */}
          <div className="flex flex-col gap-1">
            <Label>Apellido <span className="text-muted-foreground font-normal">(Ej: López)</span></Label>
            <Input
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              required
            />
          </div>

          {/* TELÉFONO */}
          <div className="flex flex-col gap-1">
            <Label>Teléfono <span className="text-muted-foreground font-normal">(Ej: 0991234567)</span></Label>
            <Input
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              required
            />
          </div>

          {/* CORREO */}
          <div className="flex flex-col gap-1">
            <Label>Correo <span className="text-muted-foreground font-normal">(Ej: usuario@gmail.com)</span></Label>
            <Input
              type="email"
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              required
            />
          </div>

          {/* DIRECCIÓN */}
          <div className="flex flex-col gap-1">
            <Label>Dirección <span className="text-muted-foreground font-normal">(Ej: Av. Central)</span></Label>
            <Input
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              required
            />
          </div>

          {/* GÉNERO */}
          <div className="flex flex-col gap-1">
            <Label>Género</Label>
            <Select
              value={formData.genero}
              onValueChange={(value) => setFormData({ ...formData, genero: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Femenino">Femenino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* FECHA NACIMIENTO */}
          <div className="flex flex-col gap-1">
            <Label>Fecha de nacimiento <span className="text-muted-foreground font-normal">(Ej: 1998-05-21)</span></Label>
            <Input
              type="date"
              value={formData.fecha_nacimiento}
              onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
              required
            />
          </div>

          {/* CONTRASEÑA */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <Label>Contraseña <span className="text-muted-foreground font-normal">(Ej: Abc123@)</span></Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.contrasena}
                onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                required
                className="pr-10"
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* ESPECIALIDAD */}
          <div className="flex flex-col gap-1">
            <Label>Especialidad <span className="text-muted-foreground font-normal">(Ej: Prevención de Riesgos)</span></Label>
            <Input
              value={formData.especialidad_seguridad}
              onChange={(e) =>
                setFormData({ ...formData, especialidad_seguridad: e.target.value })
              }
              required
            />
          </div>

          {/* EMPRESA */}
          <div className="flex flex-col gap-1">
            <Label>Empresa</Label>
            <Select
              value={formData.id_empresa_supervisor}
              onValueChange={(value) =>
                setFormData({ ...formData, id_empresa_supervisor: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar empresa" />
              </SelectTrigger>
              <SelectContent>
                {empresas.map((e) => (
                  <SelectItem key={e.id_Empresa} value={e.id_Empresa.toString()}>
                    {e.nombreEmpresa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* EXPERIENCIA */}
          <div className="flex flex-col gap-1">
            <Label>Experiencia (años) <span className="text-muted-foreground font-normal">(Ej: 5)</span></Label>
            <Input
              type="number"
              value={formData.experiencia}
              onChange={(e) =>
                setFormData({ ...formData, experiencia: e.target.value })
              }
              required
            />
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>

          <Button disabled={loading} onClick={handleSubmit}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Guardar
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}