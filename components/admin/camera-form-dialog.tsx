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
import { Camera, Loader2 } from "lucide-react"
import { saveCamera, updateCamera, getZones, type Camera as CameraType } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

interface CameraFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  camera: CameraType | null
  zoneId: number | null
  onSuccess: () => void
}

export function CameraFormDialog({ open, onOpenChange, camera, zoneId, onSuccess }: CameraFormDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    resolution: "1080p" as "720p" | "1080p" | "4K",
    status: "online" as "online" | "offline" | "maintenance",
  })

  const zone = getZones().find((z) => z.id === zoneId)

  useEffect(() => {
    if (camera) {
      setFormData({
        name: camera.name,
        location: camera.location,
        resolution: camera.resolution,
        status: camera.status,
      })
    } else {
      setFormData({
        name: "",
        location: "",
        resolution: "1080p",
        status: "online",
      })
    }
  }, [camera, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (camera) {
        updateCamera(camera.id, {
          name: formData.name,
          location: formData.location,
          resolution: formData.resolution,
          status: formData.status,
        })

        toast({
          title: "Cámara actualizada",
          description: "La cámara se ha actualizado correctamente",
        })
      } else {
        if (!zoneId || !zone) {
          toast({
            title: "Error",
            description: "No se pudo identificar la zona",
            variant: "destructive",
          })
          setLoading(false)
          return
        }

        saveCamera({
          name: formData.name,
          zoneId,
          zone: zone.name,
          companyId: zone.companyId,
          company: zone.company,
          location: formData.location,
          resolution: formData.resolution,
          status: formData.status,
        })

        toast({
          title: "Cámara creada",
          description: "La cámara se ha registrado correctamente",
        })
      }

      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la cámara",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            {camera ? "Editar Cámara" : "Crear Nueva Cámara"}
          </DialogTitle>
          <DialogDescription>
            {camera ? "Actualiza los datos de la cámara" : "Registra una nueva cámara de seguridad"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Cámara</Label>
              <Input
                id="name"
                placeholder="Ej: CAM-A01"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación Específica</Label>
              <Input
                id="location"
                placeholder="Ej: Entrada Principal"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resolution">Resolución</Label>
                <Select
                  value={formData.resolution}
                  onValueChange={(value: any) => setFormData({ ...formData, resolution: value })}
                >
                  <SelectTrigger id="resolution">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="720p">720p</SelectItem>
                    <SelectItem value="1080p">1080p</SelectItem>
                    <SelectItem value="4K">4K</SelectItem>
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
                    <SelectItem value="online">En línea</SelectItem>
                    <SelectItem value="offline">Fuera de línea</SelectItem>
                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!camera && zone && (
              <div className="p-3 bg-muted rounded-lg space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Zona:</span> {zone.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Empresa:</span> {zone.company}
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
              {camera ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
