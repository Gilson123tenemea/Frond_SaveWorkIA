"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, AlertTriangle } from "lucide-react"
import { getZones, getZoneWorkerStats } from "@/lib/storage"

interface ZonesMapViewerProps {
  companyId: number
}

export function ZonesMapViewer({ companyId }: ZonesMapViewerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mapInstanceRef = useRef<any | null>(null)
  const markersRef = useRef<any[]>([])
  const infoWindowsRef = useRef<any[]>([])

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          initMap()
          return
        }

        // Load Google Maps script
        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&libraries=places`
        script.async = true
        script.defer = true
        script.onload = () => {
          initMap()
        }
        script.onerror = () => {
          setError("Error al cargar Google Maps")
          setIsLoading(false)
        }
        document.head.appendChild(script)
      } catch (err) {
        setError("Error al inicializar el mapa")
        setIsLoading(false)
      }
    }

    const initMap = () => {
      if (!mapRef.current) return

      const zones = getZones().filter((z) => z.companyId === companyId)
      const stats = getZoneWorkerStats()

      if (zones.length === 0) {
        setError("No hay zonas registradas para esta empresa")
        setIsLoading(false)
        return
      }

      // Calculate center point from all zones
      const centerLat = zones.reduce((sum, z) => sum + z.latitude, 0) / zones.length
      const centerLng = zones.reduce((sum, z) => sum + z.longitude, 0) / zones.length

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom: 14,
        mapTypeId: "hybrid",
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      })

      mapInstanceRef.current = map

      // Clear existing markers and info windows
      markersRef.current.forEach((marker) => marker.setMap(null))
      infoWindowsRef.current.forEach((infoWindow) => infoWindow.close())
      markersRef.current = []
      infoWindowsRef.current = []

      // Add markers for each zone with info windows
      zones.forEach((zone) => {
        const zoneStats = stats.find((s) => s.zoneId === zone.id)
        const nonCompliant = zoneStats?.nonCompliantWorkers || 0
        const totalWorkers = zoneStats?.totalWorkers || 0

        // Choose marker color based on compliance
        const markerColor = nonCompliant > 0 ? "#ef4444" : "#22c55e"

        const marker = new google.maps.Marker({
          position: { lat: zone.latitude, lng: zone.longitude },
          map: map,
          title: zone.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: markerColor,
            fillOpacity: 0.9,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        })

        // Create info window content
        const infoContent = `
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #0f172a;">
              ${zone.name}
            </h3>
            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Total Trabajadores:</span>
                <span style="font-weight: 500; color: #0f172a;">${totalWorkers}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Incumplimientos Hoy:</span>
                <span style="font-weight: 600; color: ${nonCompliant > 0 ? "#ef4444" : "#22c55e"};">
                  ${nonCompliant}
                </span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Cámaras:</span>
                <span style="font-weight: 500; color: #0f172a;">${zone.cameras}</span>
              </div>
              <div style="margin-top: 4px; padding-top: 8px; border-top: 1px solid #e2e8f0;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; background-color: ${zone.status === "active" ? "#dcfce7" : "#fee2e2"}; color: ${zone.status === "active" ? "#166534" : "#991b1b"};">
                  ${zone.status === "active" ? "Activa" : "Inactiva"}
                </span>
              </div>
            </div>
          </div>
        `

        const infoWindow = new google.maps.InfoWindow({
          content: infoContent,
        })

        marker.addListener("click", () => {
          // Close all other info windows
          infoWindowsRef.current.forEach((iw) => iw.close())
          infoWindow.open(map, marker)
        })

        markersRef.current.push(marker)
        infoWindowsRef.current.push(infoWindow)
      })

      setIsLoading(false)
    }

    loadGoogleMaps()
  }, [companyId])

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

      {/* Legend */}
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
