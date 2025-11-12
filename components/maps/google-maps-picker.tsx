"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

// ✅ Carga dinámica del mapa solo en cliente
const DynamicMap = dynamic(() => import("./map-core"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center bg-muted rounded-lg">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  ),
})

interface MapPickerProps {
  latitude: number
  longitude: number
  onLocationSelect: (lat: number, lng: number) => void
}

export function MapPicker({ latitude, longitude, onLocationSelect }: MapPickerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted)
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-muted rounded-lg">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )

  return (
    <DynamicMap latitude={latitude} longitude={longitude} onLocationSelect={onLocationSelect} />
  )
}
