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
import { Building2, Loader2 } from "lucide-react"
import { saveCompany, updateCompany, saveUser, type Company } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

interface CompanyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: Company | null
  onSuccess: () => void
}

export function CompanyDialog({ open, onOpenChange, company, onSuccess }: CompanyDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    plan: "Premium" as "Basic" | "Premium" | "Enterprise",
    status: "active" as "active" | "inactive",
    supervisorName: "",
    supervisorEmail: "",
    supervisorPassword: "",
  })

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        plan: company.plan,
        status: company.status,
        supervisorName: "",
        supervisorEmail: "",
        supervisorPassword: "",
      })
    } else {
      setFormData({
        name: "",
        plan: "Premium",
        status: "active",
        supervisorName: "",
        supervisorEmail: "",
        supervisorPassword: "",
      })
    }
  }, [company, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (company) {
        // Update existing company
        updateCompany(company.id, {
          name: formData.name,
          plan: formData.plan,
          status: formData.status,
        })

        toast({
          title: "Empresa actualizada",
          description: "La empresa se ha actualizado correctamente",
        })
      } else {
        // Create new company with supervisor
        const newCompany = saveCompany({
          name: formData.name,
          plan: formData.plan,
          status: formData.status,
          supervisorId: null,
          workers: 0,
          cameras: 0,
          zones: 0,
        })

        // Create supervisor user
        const supervisor = saveUser({
          name: formData.supervisorName,
          email: formData.supervisorEmail,
          password: formData.supervisorPassword,
          role: "supervisor",
          companyId: newCompany.id,
          company: newCompany.name,
          status: "active",
        })

        // Link supervisor to company
        updateCompany(newCompany.id, { supervisorId: supervisor.id })

        toast({
          title: "Empresa creada",
          description: "La empresa y su supervisor se han registrado correctamente",
        })
      }

      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la empresa",
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
            {company ? "Editar Empresa" : "Registrar Nueva Empresa"}
          </DialogTitle>
          <DialogDescription>
            {company ? "Actualiza los datos de la empresa" : "Registra una nueva empresa y su supervisor"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Empresa</Label>
              <Input
                id="name"
                placeholder="Ej: Constructora ABC"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <Select value={formData.plan} onValueChange={(value: any) => setFormData({ ...formData, plan: value })}>
                  <SelectTrigger id="plan">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!company && (
              <>
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-4">Datos del Supervisor</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="supervisorName">Nombre Completo</Label>
                      <Input
                        id="supervisorName"
                        placeholder="Ej: Juan Pérez"
                        value={formData.supervisorName}
                        onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supervisorEmail">Email</Label>
                      <Input
                        id="supervisorEmail"
                        type="email"
                        placeholder="supervisor@empresa.com"
                        value={formData.supervisorEmail}
                        onChange={(e) => setFormData({ ...formData, supervisorEmail: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supervisorPassword">Contraseña</Label>
                      <Input
                        id="supervisorPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.supervisorPassword}
                        onChange={(e) => setFormData({ ...formData, supervisorPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {company ? "Actualizar" : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
