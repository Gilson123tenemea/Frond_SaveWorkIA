"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, AlertCircle, CheckCircle2, Scan } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { obtenerTrabajadorPorCodigo } from "@/servicios/trabajador"
import { obtenerUrlStreamWebcamIA } from "@/servicios/camara_ia"

export default function DetectionWindow() {
  const [workerCode, setWorkerCode] = useState("")
  const [workerInfo, setWorkerInfo] = useState<string | null>(null)
  const [workerError, setWorkerError] = useState("")
  const [cameraStreamUrl, setCameraStreamUrl] = useState<string | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)

  const [companyId, setCompanyId] = useState<number | null>(null)

  // Cargar ID empresa del supervisor guardado en localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      const user = JSON.parse(stored)
      setCompanyId(user.id_empresa_supervisor ?? null)
    }
  }, [])

  const handleStartDetection = async () => {
    setWorkerError("")
    setWorkerInfo(null)
    setCameraStreamUrl(null)
    setIsDetecting(false)

    const codigo = workerCode.trim()

    if (!companyId) {
      setWorkerError("❌ No hay empresa vinculada al supervisor")
      return
    }

    const trabajador = await obtenerTrabajadorPorCodigo(codigo, companyId)

    if (!trabajador || trabajador?.error) {
      setWorkerError(trabajador?.error || "❌ Ese trabajador no pertenece a esta empresa")
      return
    }

    const nombreCompleto = `${trabajador.persona.nombre} ${trabajador.persona.apellido}`
    setWorkerInfo(nombreCompleto)

    const streamUrl = obtenerUrlStreamWebcamIA()
    setCameraStreamUrl(streamUrl)
    setIsDetecting(true)
    console.log("🎥 Webcam local con IA:", streamUrl)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-success/10 flex items-center justify-center p-4">

      {/* CARD PRINCIPAL */}
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Detección de Entrada</CardTitle>
          <CardDescription>Use la webcam del computador</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* ❌ ALERTA DE ERROR */}
          {workerError && (
            <Alert className="bg-red-100 border-red-500 text-red-600 text-xs text-center">
              <AlertCircle className="h-4 w-4 mr-1 inline-block" />
              <AlertDescription className="inline-block">{workerError}</AlertDescription>
            </Alert>
          )}

          {/* FORMULARIO (solo si NO ha iniciado la webcam) */}
          {!isDetecting && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="workerCode">Código del Trabajador</Label>
                <Input
                  id="workerCode"
                  value={workerCode}
                  onChange={(e) => setWorkerCode(e.target.value)}
                  placeholder="Ej: TRA-001"
                  className="text-center text-lg border-2 rounded-xl"
                  autoFocus
                />
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

          {/* 🎥 VISOR (con webcam prendida) */}
          {isDetecting && (
            <div className="text-center grid gap-2">
              <CheckCircle2 className="h-12 w-12 text-success animate-bounce mx-auto" />
              <p className="text-success font-bold text-lg">✅ Webcam Activa</p>
              <p className="text-md">{workerInfo}</p>

              <img
                src={cameraStreamUrl!}
                className="w-full rounded-xl border-2 mt-2 object-cover"
                style={{ height: "380px", objectFit: "cover" }}
              />

              {/* ✅ BOTÓN SOLO SI LA CÁMARA ESTÁ PRENDIDA */}
              <Button
                onClick={() => console.log("🧪 Prueba validar EPP:", workerCode)}
                size="lg"
                className="w-full sm:w-auto gap-2 mt-2 bg-blue-600 text-white rounded-xl shadow-md hover:scale-105"
              >
                <Scan className="w-5 h-5" />
                Validar (Prueba)
              </Button>

              {/* ❌ cancelar webcam */}
              <Button
                onClick={() => {
                  setIsDetecting(false)
                  setWorkerInfo(null)
                  setCameraStreamUrl(null)
                  setWorkerCode("")
                }}
                variant="outline"
                className="mt-2 border-red-500 text-red-600"
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
