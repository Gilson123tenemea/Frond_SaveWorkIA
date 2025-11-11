"use client"

import { useState, useEffect } from "react"
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
import { Building2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Importa los servicios del backend
import { crearEmpresa, actualizarEmpresa } from "../../servicios/empresa"

interface EmpresaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  empresa: any | null
  onSuccess: () => void
}

export function EmpresaDialog({ open, onOpenChange, empresa, onSuccess }: EmpresaDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    nombreEmpresa: "",
    ruc: "",
    direccion: "",
    telefono: "",
    correo: "",
    sector: "",
    id_administrador_empresa: 1, // valor fijo por ahora (puedes enlazarlo luego al login del admin)
  })

  useEffect(() => {
    if (empresa) {
      setFormData({
        nombreEmpresa: empresa.nombreEmpresa,
        ruc: empresa.ruc,
        direccion: empresa.direccion,
        telefono: empresa.telefono,
        correo: empresa.correo,
        sector: empresa.sector,
        id_administrador_empresa: empresa.id_administrador_empresa,
      })
    } else {
      setFormData({
        nombreEmpresa: "",
        ruc: "",
        direccion: "",
        telefono: "",
        correo: "",
        sector: "",
        id_administrador_empresa: 1,
      })
    }
  }, [empresa, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (empresa) {
        // Actualizar empresa
        await actualizarEmpresa(empresa.id_Empresa, formData)

        toast({
          title: "Empresa actualizada",
          description: "La empresa se actualizó correctamente.",
        })
      } else {
        // Crear empresa
        await crearEmpresa(formData)

        toast({
          title: "Empresa registrada",
          description: "La empresa fue registrada exitosamente.",
        })
      }

      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al guardar la empresa",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {empresa ? "Editar Empresa" : "Registrar Nueva Empresa"}
          </DialogTitle>
          <DialogDescription>
            {empresa ? "Actualiza los datos de la empresa" : "Registra una nueva empresa en el sistema"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombreEmpresa">Nombre de la Empresa</Label>
              <Input
                id="nombreEmpresa"
                placeholder="Ej: Constructora ABC"
                value={formData.nombreEmpresa}
                onChange={(e) => setFormData({ ...formData, nombreEmpresa: e.target.value })}
                required
              />
            </div>

            {/* RUC */}
            <div className="space-y-2">
              <Label htmlFor="ruc">RUC</Label>
              <Input
                id="ruc"
                placeholder="Ej: 1790012345001"
                value={formData.ruc}
                onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                required
              />
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                placeholder="Ej: Av. Loja y Remigio Crespo"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                required
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                placeholder="0998887766"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
              />
            </div>

            {/* Correo */}
            <div className="space-y-2">
              <Label htmlFor="correo">Correo Electrónico</Label>
              <Input
                id="correo"
                type="email"
                placeholder="contacto@empresa.com"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                required
              />
            </div>

            {/* Sector */}
            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Input
                id="sector"
                placeholder="Ej: Construcción / Tecnología / Legal"
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
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
  )
}
