"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, AlertCircle, Scan } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { obtenerTrabajadorPorCodigo } from "@/servicios/trabajador";
import { obtenerUrlStreamWebcamIA, detenerStreamWebcamIA } from "@/servicios/camara_ia";
import { verificarEPP } from "@/servicios/verificar_epp";

export default function DetectionWindow() {
  const [workerCode, setWorkerCode] = useState("");
  const [workerInfo, setWorkerInfo] = useState<string | null>(null);
  const [workerError, setWorkerError] = useState("");

  const [cameraStreamUrl, setCameraStreamUrl] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [idCamaraActiva, setIdCamaraActiva] = useState<number | null>(null);

  const [cargandoAnalisis, setCargandoAnalisis] = useState(false);

  const videoRef = useRef<HTMLImageElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Inicializar datos del supervisor
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setCompanyId(user.id_empresa_supervisor ?? null);
    }

    return () => {
      detenerCamara();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Función para apagar la cámara y limpiar estados
  const detenerCamara = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (idCamaraActiva) {
      await detenerStreamWebcamIA(idCamaraActiva);
      setIdCamaraActiva(null);
    }

    setIsDetecting(false);
    setWorkerInfo(null);
    setWorkerCode("");
    setCameraStreamUrl(null);
    setCargandoAnalisis(false);

    console.log("🔌 Cámara apagada, modelo detenido, formulario reiniciado.");
  };

  // Inicio detección
  const handleStartDetection = async () => {
    setWorkerError("");
    setWorkerInfo(null);
    setCameraStreamUrl(null);

    if (!workerCode.trim()) {
      setWorkerError("⚠ Ingresa el código del trabajador");
      return;
    }

    if (!companyId) {
      setWorkerError("❌ No hay empresa vinculada al supervisor");
      return;
    }

    const codigo = workerCode.trim();

    try {
      const trabajador = await obtenerTrabajadorPorCodigo(codigo, companyId);

      if (!trabajador || trabajador.error) {
        setWorkerError(trabajador?.error || "❌ Trabajador no encontrado");
        return;
      }

      const nombreCompleto = `${trabajador.persona.nombre} ${trabajador.persona.apellido}`;
      setWorkerInfo(nombreCompleto);

      const idCamara = trabajador.camara?.id_camara;
      if (!idCamara) {
        setWorkerError("❌ El trabajador no tiene cámara asignada");
        return;
      }

      setIsDetecting(true);
      setIdCamaraActiva(idCamara);

      const streamUrl = obtenerUrlStreamWebcamIA(idCamara);

      fetch(streamUrl, { method: "GET" }).catch(() => {});
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setCameraStreamUrl(streamUrl);
      if (videoRef.current) {
        videoRef.current.src = streamUrl;
      }

      console.log("🎥 Cámara activa, iniciando captura...");

      setCargandoAnalisis(true);

      timerRef.current = setTimeout(async () => {
        await verificarEPPDelTrabajador(idCamara, codigo, trabajador);
      }, 3000);

    } catch (error: any) {
      setWorkerError("❌ Error: " + error.message);
      setIsDetecting(false);
      setIdCamaraActiva(null);
    }
  };

  // Llamar al backend para verificar EPP
  const verificarEPPDelTrabajador = async (idCamara: number, codigo: string, datosTrabajador: any) => {
    try {
      console.log("🤖 Analizando EPP…");

      await verificarEPP(idCamara, codigo, datosTrabajador);

      console.log("🏁 Análisis completado");

    } catch (error: any) {
      setWorkerError("⚠ Error analizando EPP");
    }

    // 🔥 APAGAR MODELO AUTOMÁTICAMENTE Y VOLVER AL FORMULARIO
    await detenerCamara();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-success/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl rounded-2xl shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Detección de Entrada</CardTitle>
          <CardDescription>Análisis de EPP con YOLO en tiempo real</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* ERROR */}
          {workerError && (
            <Alert className="bg-red-100 border-red-500 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{workerError}</AlertDescription>
            </Alert>
          )}

          {/* FORMULARIO */}
          {!isDetecting && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Código del Trabajador</Label>
              <Input
                value={workerCode}
                onChange={(e) => setWorkerCode(e.target.value)}
                placeholder="Ej: TRA-001"
                className="text-center text-lg border-2 rounded-xl"
                autoFocus
                onKeyPress={(e) => e.key === "Enter" && handleStartDetection()}
              />

              <Button
                onClick={handleStartDetection}
                size="lg"
                className="w-full rounded-xl shadow-md hover:scale-105 transition"
                disabled={!workerCode.trim() || !companyId}
              >
                <Scan className="w-4 h-4 mr-2" />
                Iniciar Detección
              </Button>
            </div>
          )}

          {/* ANIMACIÓN SCAN */}
          {isDetecting && (
            <div className="py-8">

              {/* Estado */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                <p className="text-sm font-semibold text-blue-700">
                  Escaneando EPP…
                </p>
              </div>

              {/* Nombre */}
              {workerInfo && (
                <p className="text-sm font-semibold text-center mb-4">{workerInfo}</p>
              )}

              {/* ANIMACIÓN */}
              <div className="relative w-full h-80 flex items-center justify-center overflow-hidden">

                {/* GRID */}
                <div className="absolute inset-0 
                  bg-[linear-gradient(rgba(59,130,246,0.10)_1px,transparent_1px),
                  linear-gradient(90deg,rgba(59,130,246,0.10)_1px,transparent_1px)]
                  bg-[size:22px_22px]" />

                {/* PERSONA GIRANDO */}
                <div className="relative w-32 h-56 animate-[spin_3s_linear]">
                  <svg viewBox="0 0 100 150" className="w-full h-full">
                    <circle cx="50" cy="20" r="12" fill="none" stroke="rgb(59,130,246)" strokeWidth="2" />
                    <line x1="50" y1="32" x2="50" y2="80" stroke="rgb(59,130,246)" strokeWidth="2" />
                    <line x1="50" y1="45" x2="30" y2="65" stroke="rgb(59,130,246)" strokeWidth="2" />
                    <line x1="50" y1="45" x2="70" y2="65" stroke="rgb(59,130,246)" strokeWidth="2" />
                    <line x1="50" y1="80" x2="35" y2="120" stroke="rgb(59,130,246)" strokeWidth="2" />
                    <line x1="50" y1="80" x2="65" y2="120" stroke="rgb(59,130,246)" strokeWidth="2" />
                  </svg>
                </div>

                {/* LÁSER */}
                <div
                  className="absolute left-0 right-0 h-1 
                  bg-gradient-to-r from-transparent via-primary to-transparent 
                  animate-[scanLine_3s_ease-in-out]"
                />

                {/* TEXTO */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-primary font-mono text-sm animate-pulse">ANALIZANDO…</p>
                  <p className="text-xs text-muted-foreground mt-1">Código: {workerCode}</p>
                </div>
              </div>

            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
