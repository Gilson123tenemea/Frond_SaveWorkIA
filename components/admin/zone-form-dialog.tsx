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
import { MapPin, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { crearZona, actualizarZona } from "@/servicios/zona"
import { GoogleMapsPicker } from "@/components/maps/google-maps-picker"

interface ZoneFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  zone: any | null
  companyId: number | null
  onSuccess: () => void
}

export function ZoneFormDialog({ open, onOpenChange, zone, companyId, onSuccess }: ZoneFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombreZona: "",
    latitud: "",
    longitud: "",
    estado: "active",
    id_empresa_zona: 0,
    id_administrador_zona: 0,
  })

  // 🔹 Inicializar datos del formulario
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null")
    const adminId = user?.id_administrador || parseInt(localStorage.getItem("adminId") || "0")

    if (zone) {
      setFormData({
        nombreZona: zone.nombreZona,
        latitud: zone.latitud,
        longitud: zone.longitud,
        estado: zone.borrado ? "active" : "inactive",
        id_empresa_zona: zone.id_empresa_zona,
        id_administrador_zona: zone.id_administrador_zona,
      })
    } else {
      setFormData({
        nombreZona: "",
        latitud: "",
        longitud: "",
        estado: "active",
        id_empresa_zona: companyId ?? 0,
        id_administrador_zona: adminId,
      })
    }
  }, [zone, open, companyId])

  // 🔹 Al seleccionar en el mapa
  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData({
      ...formData,
      latitud: lat.toString(),
      longitud: lng.toString(),
    })
  }

  // 🔹 Enviar datos
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const dataToSend = {
      nombreZona: formData.nombreZona.trim(),
      latitud: formData.latitud,
      longitud: formData.longitud,
      id_empresa_zona: formData.id_empresa_zona,
      id_administrador_zona: formData.id_administrador_zona,
      borrado: formData.estado === "active",
    }

    const promise = zone
      ? actualizarZona(zone.id_Zona, dataToSend)
      : crearZona(dataToSend)

    toast.promise(
      promise,
      {
        loading: zone ? "Actualizando zona..." : "Registrando zona...",
        success: zone
          ? `Zona "${formData.nombreZona}" actualizada con éxito`
          : `Zona "${formData.nombreZona}" registrada exitosamente`,
        error: (err) =>
          err?.message?.includes("Ya existe")
            ? "⚠️ Ya existe una zona con ese nombre en esta empresa"
            : "❌ Ocurrió un error al guardar la zona",
      },
      {
        style: {
          background: zone ? "#2563eb" : "#16a34a",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: 500,
          boxShadow: "0 2px 20px rgba(0, 0, 0, 0.2)",
        },
        iconTheme: {
          primary: "#fff",
          secondary: zone ? "#1e3a8a" : "#15803d",
        },
      }
    )

    setLoading(true)
    try {
      await promise
      onSuccess()
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {zone ? "Editar Zona" : "Registrar Nueva Zona"}
          </DialogTitle>
          <DialogDescription>
            {zone
              ? "Actualiza los datos de la zona seleccionada"
              : "Registra una nueva zona de trabajo seleccionando su ubicación en el mapa"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Nombre de zona */}
            <div className="space-y-2">
              <Label htmlFor="nombreZona">Nombre de la Zona</Label>
              <Input
                id="nombreZona"
                placeholder="Ej: Zona A - Almacén Principal"
                value={formData.nombreZona}
                onChange={(e) => setFormData({ ...formData, nombreZona: e.target.value })}
                required
              />
            </div>

            {/* Mapa */}
            <div className="space-y-2">
              <Label>Ubicación en el mapa</Label>
              <p className="text-sm text-muted-foreground">
                Haz clic en el mapa para seleccionar la ubicación de la zona
              </p>
              <GoogleMapsPicker
                latitude={formData.latitud ? parseFloat(formData.latitud) : -2.2038}
                longitude={formData.longitud ? parseFloat(formData.longitud) : -79.8975}
                onLocationSelect={handleLocationSelect}
              />
            </div>

            {/* Coordenadas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitud">Latitud</Label>
                <Input
                  id="latitud"
                  type="number"
                  step="any"
                  placeholder="-2.2038"
                  value={formData.latitud}
                  onChange={(e) => setFormData({ ...formData, latitud: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitud">Longitud</Label>
                <Input
                  id="longitud"
                  type="number"
                  step="any"
                  placeholder="-79.8975"
                  value={formData.longitud}
                  onChange={(e) => setFormData({ ...formData, longitud: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <select
                id="estado"
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Botones */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {zone ? "Actualizar" : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
