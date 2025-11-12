"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { Loader2, AlertTriangle } from "lucide-react"

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface Zone {
  id: number
  name: string
  latitude: number
  longitude: number
  cameras: number
  status: string
  totalWorkers: number
  nonCompliantWorkers: number
}

interface ZonesMapViewerProps {
  companyId: number
  zones: Zone[]
}

export function ZonesMapViewer({ companyId, zones }: ZonesMapViewerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mapRef.current || zones.length === 0) {
      setError("No hay zonas registradas para esta empresa.")
      setIsLoading(false)
      return
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    const avgLat = zones.reduce((sum, z) => sum + z.latitude, 0) / zones.length
    const avgLng = zones.reduce((sum, z) => sum + z.longitude, 0) / zones.length

    const map = L.map(mapRef.current).setView([avgLat, avgLng], 14)
    mapInstanceRef.current = map

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map)

    zones.forEach((zone) => {
      const color = zone.nonCompliantWorkers > 0 ? "#ef4444" : "#22c55e"

      const marker = L.circleMarker([zone.latitude, zone.longitude], {
        radius: 10,
        color: "#ffffff",
        fillColor: color,
        fillOpacity: 0.9,
        weight: 2,
      }).addTo(map)

      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="margin: 0; font-size: 14px; font-weight: bold;">${zone.name}</h3>
          <hr style="margin: 6px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="margin: 4px 0; font-size: 13px;">📷 Cámaras: <strong>${zone.cameras}</strong></p>
          <p style="margin: 4px 0; font-size: 13px;">👷‍♂️ Trabajadores: <strong>${zone.totalWorkers}</strong></p>
          <p style="margin: 4px 0; font-size: 13px;">🚫 Incumplimientos: 
            <strong style="color:${color};">${zone.nonCompliantWorkers}</strong>
          </p>
          <span style="display:inline-block;margin-top:6px;padding:2px 8px;border-radius:6px;font-size:12px;background-color:${zone.status === "active" ? "#dcfce7" : "#fee2e2"};color:${zone.status === "active" ? "#166534" : "#991b1b"};">
            ${zone.status === "active" ? "Activa" : "Inactiva"}
          </span>
        </div>
      `

      marker.bindPopup(popupContent)
    })

    setIsLoading(false)
  }, [zones])

  if (error) {
    return (
      <div className="w-full h-[500px] bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[500px] bg-muted rounded-lg overflow-hidden border">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />

      {/* Leyenda */}
      <div className="absolute bottom-4 right-4 bg-card border rounded-lg shadow-lg p-3 z-10">
        <p className="text-xs font-semibold mb-2">Leyenda</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs">Sin incumplimientos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs">Con incumplimientos</span>
          </div>
        </div>
      </div>
    </div>
  )
}
