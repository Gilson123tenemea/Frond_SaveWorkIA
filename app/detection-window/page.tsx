"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Shield, Camera, AlertCircle, CheckCircle2, Scan } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DetectionWindow() {
  const [workerCode, setWorkerCode] = useState("")
  const [isDetecting, setIsDetecting] = useState(false)
  const [showCloseDialog, setShowCloseDialog] = useState(false)
  const [supervisorEmail, setSupervisorEmail] = useState("")
  const [supervisorPassword, setSupervisorPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [detectionStarted, setDetectionStarted] = useState(false)

  // Prevenir cierre de ventana
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
      setShowCloseDialog(true)
      return ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    // Interceptar Alt+F4 y otros atajos
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key === "F4") || (e.ctrlKey && e.key === "w") || (e.ctrlKey && e.key === "W")) {
        e.preventDefault()
        setShowCloseDialog(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const handleStartDetection = () => {
    if (workerCode.trim()) {
      setIsDetecting(true)
      setDetectionStarted(true)
      // Aquí se iniciaría la detección real
      console.log("[v0] Iniciando detección para trabajador:", workerCode)
    }
  }

  const handleCloseWindow = () => {
    setShowCloseDialog(true)
  }

  const handleAuthenticateAndClose = () => {
    // Validar credenciales (usar las mismas que en el login)
    if (supervisorEmail === "supervisor@savework.com" && supervisorPassword === "super123") {
      window.removeEventListener("beforeunload", () => {})
      window.close()
    } else {
      setAuthError("Credenciales incorrectas")
    }
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
          <CardTitle className="text-2xl">Sistema de Detección IA</CardTitle>
          <CardDescription>Ingrese el código del trabajador para iniciar el monitoreo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!detectionStarted ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="workerCode">Código del Trabajador</Label>
                <div className="relative">
                  <Input
                    id="workerCode"
                    placeholder="Ej: TRB-2024-001"
                    value={workerCode}
                    onChange={(e) => setWorkerCode(e.target.value)}
                    className="pr-10 text-lg"
                    autoFocus
                  />
                  <Scan className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              <Button onClick={handleStartDetection} className="w-full" size="lg" disabled={!workerCode.trim()}>
                <Camera className="w-5 h-5 mr-2" />
                Iniciar Detección
              </Button>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Esta ventana permanecerá abierta durante el monitoreo. Requiere autenticación del supervisor para
                  cerrar.
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center animate-pulse">
                    <CheckCircle2 className="w-12 h-12 text-success" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-success/30 animate-ping" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-success">Detección Activa</h3>
                <p className="text-sm text-muted-foreground">Código: {workerCode}</p>
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estado del sistema:</span>
                  <span className="text-success font-medium">Operativo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cámaras activas:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tiempo transcurrido:</span>
                  <span className="font-medium">00:00</span>
                </div>
              </div>

              <Button onClick={handleCloseWindow} variant="outline" className="w-full bg-transparent">
                Cerrar Ventana
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Autenticación Requerida</DialogTitle>
            <DialogDescription>
              Para cerrar la ventana de detección, ingrese las credenciales del supervisor
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email del Supervisor</Label>
              <Input
                id="email"
                type="email"
                placeholder="supervisor@savework.com"
                value={supervisorEmail}
                onChange={(e) => {
                  setSupervisorEmail(e.target.value)
                  setAuthError("")
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={supervisorPassword}
                onChange={(e) => {
                  setSupervisorPassword(e.target.value)
                  setAuthError("")
                }}
              />
            </div>
            {authError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCloseDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAuthenticateAndClose}>Autenticar y Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
