"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"


interface GoogleMapsPickerProps {
  latitude: number
  longitude: number
  onLocationSelect: (lat: number, lng: number) => void
}

export function GoogleMapsPicker({ latitude, longitude, onLocationSelect }: GoogleMapsPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mapInstanceRef = useRef<any | null>(null)
  const markerRef = useRef<any | null>(null)

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

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
        mapTypeId: "hybrid",
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
      })

      mapInstanceRef.current = map

      // Create initial marker
      const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        draggable: true,
        title: "Ubicación de la zona",
      })

      markerRef.current = marker

      // Update location when marker is dragged
      marker.addListener("dragend", () => {
        const position = marker.getPosition()
        if (position) {
          onLocationSelect(position.lat(), position.lng())
        }
      })

      // Update location when map is clicked
      map.addListener("click", (e: any) => {
        if (e.latLng) {
          marker.setPosition(e.latLng)
          onLocationSelect(e.latLng.lat(), e.latLng.lng())
        }
      })

      setIsLoading(false)
    }

    loadGoogleMaps()
  }, [])

  // Update marker position when props change
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      const newPosition = { lat: latitude, lng: longitude }
      markerRef.current.setPosition(newPosition)
      mapInstanceRef.current.panTo(newPosition)
    }
  }, [latitude, longitude])

  if (error) {
    return (
      <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[400px] bg-muted rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}
