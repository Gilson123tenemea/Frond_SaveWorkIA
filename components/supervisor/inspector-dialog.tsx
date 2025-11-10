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
import { saveInspector, updateInspector, getUsers, getCompanies, type Inspector } from "@/lib/storage"
import { getUser } from "@/lib/auth"

interface InspectorDialogProps {
  open: boolean
  onClose: () => void
  inspector: Inspector | null
}

export function InspectorDialog({ open, onClose, inspector }: InspectorDialogProps) {
  const currentUser = getUser()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active" as "active" | "inactive",
  })

  useEffect(() => {
    if (inspector) {
      setFormData({
        name: inspector.name,
        email: inspector.email,
        phone: inspector.phone,
        status: inspector.status,
      })
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        status: "active",
      })
    }
  }, [inspector])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Get supervisor's company
    const users = getUsers()
    const supervisorUser = users.find((u) => u.email === currentUser?.email)
    if (!supervisorUser?.companyId) {
      alert("No se pudo obtener la empresa del supervisor")
      return
    }

    const companies = getCompanies()
    const company = companies.find((c) => c.id === supervisorUser.companyId)

    if (inspector) {
      updateInspector(inspector.id, formData)
    } else {
      saveInspector({
        ...formData,
        companyId: supervisorUser.companyId,
        company: company?.name || "",
      })
    }

    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{inspector ? "Editar Inspector" : "Agregar Inspector"}</DialogTitle>
          <DialogDescription>
            {inspector ? "Modifica los datos del inspector" : "Completa los datos para registrar un nuevo inspector"}
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="inspector@empresa.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+51 999 999 999"
              required
            />
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
            <Button type="submit">{inspector ? "Guardar Cambios" : "Agregar Inspector"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
