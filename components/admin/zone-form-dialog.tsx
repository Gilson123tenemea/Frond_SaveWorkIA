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
import { MapPin, Loader2 } from "lucide-react"
import { saveZone, updateZone, getCompanies, type Zone } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { GoogleMapsPicker } from "@/components/maps/google-maps-picker"

interface ZoneFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  zone: Zone | null
  companyId: number | null
  onSuccess: () => void
}

export function ZoneFormDialog({ open, onOpenChange, zone, companyId, onSuccess }: ZoneFormDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    status: "active" as "active" | "inactive",
  })

  const company = getCompanies().find((c) => c.id === companyId)

  useEffect(() => {
    if (zone) {
      setFormData({
        name: zone.name,
        latitude: zone.latitude.toString(),
        longitude: zone.longitude.toString(),
        status: zone.status,
      })
    } else {
      setFormData({
        name: "",
        latitude: "",
        longitude: "",
        status: "active",
      })
    }
  }, [zone, open])

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData({
      ...formData,
      latitude: lat.toString(),
      longitude: lng.toString(),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const latitude = Number.parseFloat(formData.latitude)
      const longitude = Number.parseFloat(formData.longitude)

      if (isNaN(latitude) || isNaN(longitude)) {
        toast({
          title: "Error",
          description: "Las coordenadas deben ser números válidos",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (zone) {
        updateZone(zone.id, {
          name: formData.name,
          latitude,
          longitude,
          status: formData.status,
        })

        toast({
          title: "Zona actualizada",
          description: "La zona se ha actualizado correctamente",
        })
      } else {
        if (!companyId || !company) {
          toast({
            title: "Error",
            description: "No se pudo identificar la empresa",
            variant: "destructive",
          })
          setLoading(false)
          return
        }

        saveZone({
          name: formData.name,
          companyId,
          company: company.name,
          latitude,
          longitude,
          cameras: 0,
          status: formData.status,
        })

        toast({
          title: "Zona creada",
          description: "La zona se ha registrado correctamente",
        })
      }

      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la zona",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {zone ? "Editar Zona" : "Crear Nueva Zona"}
          </DialogTitle>
          <DialogDescription>
            {zone
              ? "Actualiza los datos de la zona"
              : "Registra una nueva zona de trabajo seleccionando su ubicación en el mapa"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Zona</Label>
              <Input
                id="name"
                placeholder="Ej: Zona A - Almacén Principal"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Ubicación de la Zona</Label>
              <p className="text-sm text-muted-foreground mb-2">Haz clic en el mapa para seleccionar la ubicación</p>
              <GoogleMapsPicker
                latitude={formData.latitude ? Number.parseFloat(formData.latitude) : -12.0464}
                longitude={formData.longitude ? Number.parseFloat(formData.longitude) : -77.0428}
                onLocationSelect={handleLocationSelect}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitud</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="-12.0464"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitud</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="-77.0428"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  required
                />
              </div>
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

            {!zone && company && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Empresa:</span> {company.name}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {zone ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
