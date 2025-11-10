"use client"

import type React from "react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveWorker, updateWorker, getUsers, getCompanies, getZones, type Worker } from "@/lib/storage"
import { getUser } from "@/lib/auth"

interface WorkerDialogProps {
  open: boolean
  onClose: () => void
  worker: Worker | null
}

export function WorkerDialog({ open, onClose, worker }: WorkerDialogProps) {
  const currentUser = getUser()
  const [zones, setZones] = useState<{ id: number; name: string }[]>([])
  const [formData, setFormData] = useState({
    name: "",
    dni: "",
    position: "",
    zoneId: null as number | null,
    shift: "Mañana" as "Mañana" | "Tarde" | "Noche",
    status: "active" as "active" | "inactive",
  })

  useEffect(() => {
    if (open) {
      // Load zones from supervisor's company
      const users = getUsers()
      const supervisorUser = users.find((u) => u.email === currentUser?.email)
      if (supervisorUser?.companyId) {
        const allZones = getZones()
        const companyZones = allZones.filter((z) => z.companyId === supervisorUser.companyId && z.status === "active")
        setZones(companyZones.map((z) => ({ id: z.id, name: z.name })))
      }
    }

    if (worker) {
      setFormData({
        name: worker.name,
        dni: worker.dni,
        position: worker.position,
        zoneId: worker.zoneId,
        shift: worker.shift,
        status: worker.status,
      })
    } else {
      setFormData({
        name: "",
        dni: "",
        position: "",
        zoneId: null,
        shift: "Mañana",
        status: "active",
      })
    }
  }, [worker, open, currentUser])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const users = getUsers()
    const supervisorUser = users.find((u) => u.email === currentUser?.email)
    if (!supervisorUser?.companyId) {
      alert("No se pudo obtener la empresa del supervisor")
      return
    }

    const companies = getCompanies()
    const company = companies.find((c) => c.id === supervisorUser.companyId)

    const allZones = getZones()
    const selectedZone = formData.zoneId ? allZones.find((z) => z.id === formData.zoneId) : null

    if (worker) {
      updateWorker(worker.id, {
        ...formData,
        zone: selectedZone?.name || null,
      })
    } else {
      saveWorker({
        ...formData,
        companyId: supervisorUser.companyId,
        company: company?.name || "",
        zone: selectedZone?.name || null,
      })
    }

    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{worker ? "Editar Trabajador" : "Agregar Trabajador"}</DialogTitle>
          <DialogDescription>
            {worker ? "Modifica los datos del trabajador" : "Completa los datos para registrar un nuevo trabajador"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dni">DNI</Label>
            <Input
              id="dni"
              value={formData.dni}
              onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
              placeholder="12345678"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Cargo</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="Operario, Técnico, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zone">Zona Asignada</Label>
            <Select
              value={formData.zoneId?.toString() || "none"}
              onValueChange={(value) =>
                setFormData({ ...formData, zoneId: value === "none" ? null : Number.parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar zona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin asignar</SelectItem>
                {zones.map((zone) => (
                  <SelectItem key={zone.id} value={zone.id.toString()}>
                    {zone.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shift">Turno</Label>
            <Select
              value={formData.shift}
              onValueChange={(value: "Mañana" | "Tarde" | "Noche") => setFormData({ ...formData, shift: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mañana">Mañana</SelectItem>
                <SelectItem value="Tarde">Tarde</SelectItem>
                <SelectItem value="Noche">Noche</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{worker ? "Guardar Cambios" : "Agregar Trabajador"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
