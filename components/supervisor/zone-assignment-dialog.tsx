"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

import toast from "react-hot-toast"

import { getUser } from "@/lib/auth"
import { listarZonasPorEmpresa } from "@/servicios/zona"
import { listarTrabajadoresPorSupervisor } from "@/servicios/trabajador"
import { crearAsignacionInspectorZona } from "@/servicios/zona_inspector"

interface ZoneAssignFormProps {
  open: boolean
  onClose: () => void
}

export function ZoneAssignForm({ open, onClose }: ZoneAssignFormProps) {
  const [zonas, setZonas] = useState<any[]>([])
  const [trabajadores, setTrabajadores] = useState<any[]>([])

  const [zonaSeleccionada, setZonaSeleccionada] = useState("")
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState("")

  useEffect(() => {
    if (!open) return

    const user = getUser()
    const empresaId = user?.id_empresa_supervisor
    const supervisorId = user?.id_supervisor

    if (!empresaId || !supervisorId) {
      console.error("⚠ Datos inválidos del usuario logueado")
      return
    }

    // 🔥 Cargar Zonas
    listarZonasPorEmpresa(empresaId)
      .then(setZonas)
      .catch((err) => console.error("❌ Error cargando zonas:", err))

    // 🔥 Cargar Trabajadores
    listarTrabajadoresPorSupervisor(supervisorId)
      .then(setTrabajadores)
      .catch((err) => console.error("❌ Error cargando trabajadores:", err))

  }, [open])

  const handleSubmit = async () => {
    try {
      if (!zonaSeleccionada || !trabajadorSeleccionado) {
        toast.error("Debe seleccionar zona y trabajador")
        return
      }

      const payload = {
        id_inspector_inspectorzona: trabajadorSeleccionado,
        id_zona_inspectorzona: zonaSeleccionada
      }

      console.log("📤 Enviando asignación:", payload)

      const response = await crearAsignacionInspectorZona(payload)

      console.log("📥 Respuesta del backend:", response)

      toast.success("Asignación creada correctamente")

      // Resetear formulario
      setZonaSeleccionada("")
      setTrabajadorSeleccionado("")
      onClose()

    } catch (error) {
      console.error("❌ Error al crear asignación:", error)
      toast.error("No se pudo crear la asignación")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Asignar Trabajador a una Zona</DialogTitle>
          <DialogDescription>
            Selecciona la zona y el trabajador para continuar.
          </DialogDescription>
        </DialogHeader>

        {/* SELECT DE ZONAS */}
        <div className="space-y-2 mt-4">
          <Label className="font-semibold">Zona</Label>

          <Select value={zonaSeleccionada} onValueChange={setZonaSeleccionada}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una zona" />
            </SelectTrigger>

            <SelectContent>
              {zonas.length === 0 ? (
                <div className="text-muted-foreground p-3 text-center">
                  No hay zonas registradas
                </div>
              ) : (
                zonas.map((zona) => (
                  <SelectItem key={zona.id_zona} value={String(zona.id_zona)}>
                    {zona.nombreZona}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* SELECT DE TRABAJADORES */}
        <div className="space-y-2 mt-4">
          <Label className="font-semibold">Trabajador</Label>

          <Select
            value={trabajadorSeleccionado}
            onValueChange={setTrabajadorSeleccionado}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un trabajador" />
            </SelectTrigger>

            <SelectContent>
              {trabajadores.length === 0 ? (
                <div className="text-muted-foreground p-3 text-center">
                  No hay trabajadores disponibles
                </div>
              ) : (
                trabajadores.map((t) => (
                  <SelectItem key={t.id_trabajador} value={String(t.id_trabajador)}>
                    {t.persona?.nombre} {t.persona?.apellido}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!zonaSeleccionada || !trabajadorSeleccionado}
          >
            Guardar Asignación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
