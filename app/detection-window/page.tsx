"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Camera, AlertCircle, CheckCircle2, Scan } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// → constante nueva para este componente
const BASE_URL = "http://127.0.0.1:8000"
const CAMARA_IA_URL = `${BASE_URL}/ia/camaras`  // ✔ ya existe aquí
const CAMARA_STREAM_ENDPOINT = (id: number) => `${CAMARA_IA_URL}/${id}/stream`

import { obtenerTrabajadorPorCodigo } from "@/servicios/trabajador"
// Usamos el servicio para validar conexión si quieres usarlo luego:
import { iniciarStreamCamaraIA } from "@/servicios/camara_ia"

export default function DetectionWindow() {
  const [workerCode, setWorkerCode] = useState<string>("")
  const [isDetecting, setIsDetecting] = useState(false)
  const [workerInfo, setWorkerInfo] = useState<string | null>(null)
  const [workerError, setWorkerError] = useState("")
  const [cameraStreamUrl, setCameraStreamUrl] = useState<string | null>(null)

  const handleStartDetection = async () => {
    setWorkerError("")
    setWorkerInfo(null)
    setCameraStreamUrl(null)
    setIsDetecting(false)

    const trabajador = await obtenerTrabajadorPorCodigo(workerCode.trim())

    if (!trabajador) {
      setWorkerError("❌ No existe trabajador con ese código")
      return
    }

    // ✅ EXTRAER EL ID DE LA CÁMARA DESDE EL JSON
    const idCamara = trabajador.camara.id_camara

    // ✅ ARMAR EL ENDPOINT REAL DEL BACK
    const urlStream = `${CAMARA_IA_URL}/${idCamara}/stream`

    setWorkerInfo(`${trabajador.persona.nombre} ${trabajador.persona.apellido}`)
    setCameraStreamUrl(urlStream)
    setIsDetecting(true)

    console.log("🎥 Encendiendo cámara con IA:", urlStream)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-success/10 flex items-center justify-center p-4">

      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Detección de Entrada (Zona)</CardTitle>
          <CardDescription>Ingrese el código del trabajador</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* ❌ ERROR */}
          {workerError && (
            <Alert className="bg-red-100 border-red-500 text-red-600 text-xs text-center">
              <AlertCircle className="h-4 w-4 mr-1 inline-block" />
              <AlertDescription className="inline-block">{workerError}</AlertDescription>
            </Alert>
          )}

          {/* ✅ FORMULARIO */}
          {!isDetecting && (
            <>
              <div className="space-y-2">
                <Label htmlFor="workerCode">Código del Trabajador</Label>
                <div className="relative">
                  <Input
                    id="workerCode"
                    value={workerCode}
                    onChange={(e) => setWorkerCode(e.target.value)}
                    placeholder="Ej: TRA-001"
                    className="text-center text-lg border-2 rounded-xl"
                    autoFocus
                  />
                  <Scan className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <Button
                onClick={handleStartDetection}
                size="lg"
                className="w-full rounded-2xl border-2 border-primary shadow-lg hover:scale-105 transition-transform"
                disabled={!workerCode.trim()}
              >
                <Camera className="w-5 h-5 mr-2" />
                Iniciar Detección
              </Button>
            </>
          )}

          {/* 🎥 VISOR MJPEG DE IA (solo si existe trabajador y cámara está asignada por zona) */}
          {isDetecting && workerInfo && cameraStreamUrl && (
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <CheckCircle2 className="h-12 w-12 text-success animate-bounce" />
              </div>
              <p className="text-success font-bold text-lg">✅ Detección Activa</p>
              <p className="text-md">{workerInfo}</p>
              <p className="text-xs text-green-600 font-medium">📷 Transmisión en tiempo real</p>

              {/* ✔ Visor correcto MJPEG desde tu backend */}
              <img
                src={cameraStreamUrl}
                className="w-full max-w-md rounded-xl border-2 mt-3"
                style={{ objectFit: "cover" }}
              />

              <Button
                onClick={() => {
                  setIsDetecting(false)
                  setCameraStreamUrl(null)
                  setWorkerInfo(null)
                  setWorkerCode("")
                }}
                variant="outline"
                className="mt-3 border-red-500 text-red-600"
                size="sm"
              >
                Cancelar detección
              </Button>
            </div>
          )}

        </CardContent>
      </Card>

    </div>
  )
}

// Ya no lo usas por ahora en UI, pero lo dejamos nuevo para evitar error:
function handleCloseWindow(e: Event) {
  e.preventDefault()
}
