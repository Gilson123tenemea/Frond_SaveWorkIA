"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, AlertCircle, CheckCircle2, Scan } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { BASE_URL } from "@/servicios/api";

import { obtenerTrabajadorPorCodigo } from "@/servicios/trabajador";
import { registrarAsistencia } from "@/servicios/registro_asistencia";

import { iniciarStreamWebcamIA, obtenerUrlStreamWebcamIA } from "@/servicios/camara_ia";

export default function DetectionWindow() {
  const [workerCode, setWorkerCode] = useState("");
  const [workerInfo, setWorkerInfo] = useState<string | null>(null);
  const [workerError, setWorkerError] = useState("");
  const [cameraStreamUrl, setCameraStreamUrl] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [companyId, setCompanyId] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setCompanyId(user.id_empresa_supervisor ?? null);
    }

    return () => {
      detenerCamara();
    };
  }, []);

  const detenerCamara = async () => {
    setIsDetecting(false);
    setCameraStreamUrl(null);
    setWorkerInfo(null);
    setWorkerCode("");

    try {
      await fetch(`${BASE_URL}/webcam/stream/stop`, { method: "POST" });
      console.log("✅ Stream detenido en backend");
    } catch (err) {
      console.error("⚠ Error deteniendo stream:", err);
    }
  };

  const handleStartDetection = async () => {
    setWorkerError("");
    setWorkerInfo(null);
    setCameraStreamUrl(null);

    if (!workerCode.trim()) return;
    if (!companyId) {
      setWorkerError("❌ No hay empresa vinculada al supervisor");
      return;
    }

    const codigo = workerCode.trim();

    // 1. Obtener trabajador por código + empresa
    const trabajador = await obtenerTrabajadorPorCodigo(codigo, companyId);
    if (!trabajador || trabajador.error) {
      setWorkerError(trabajador?.error || "❌ Trabajador no pertenece a esta empresa");
      return;
    }

    const nombreCompleto = `${trabajador.persona.nombre} ${trabajador.persona.apellido}`;
    setWorkerInfo(nombreCompleto);

    // 2. Registrar asistencia en BD
    const resRegistro = await registrarAsistencia(
      codigo,
      trabajador.camara.id_camara,
      {
        id_trabajador: trabajador.id_trabajador,
        id_empresa: trabajador.id_empresa,
        id_zona: trabajador.id_zona,
        id_supervisor: trabajador.id_supervisor_trabajador,
        id_camara: trabajador.camara.id_camara,
        id_inspector: trabajador.id_inspector ?? null,
      },
      {
        id_supervisor: trabajador.id_supervisor_trabajador,
        id_empresa_supervisor: companyId,
      }
    );

    if (resRegistro.error) {
      setWorkerError(resRegistro.error);
      return;
    }

    // 3. Iniciar stream desde backend
    setIsDetecting(true);

    const resp = await iniciarStreamWebcamIA();
    if (!resp) {
      setWorkerError("❌ No se pudo iniciar el stream desde backend IA");
      setIsDetecting(false);
      return;
    }

    const streamUrl = obtenerUrlStreamWebcamIA();
    setCameraStreamUrl(streamUrl);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = streamUrl;
    }

    console.log("🎥 Stream IA activo:", streamUrl);
  };


  const validarIA = async () => {
    console.log("🧪 Botón de prueba validar IA");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-success/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Detección de Entrada</CardTitle>
          <CardDescription>Stream desde backend con YOLO</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-center">

          {/* ❌ Error */}
          {workerError && (
            <Alert className="bg-red-100 border-red-500 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              <AlertDescription className="inline">{workerError}</AlertDescription>
            </Alert>
          )}

          {/* Formulario */}
          {!isDetecting && (
            <>
              <div className="grid gap-2">
                <Label className="text-sm">Código del Trabajador</Label>
                <Input
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
                className="w-full rounded-xl shadow-md hover:scale-105 transition"
              >
                Iniciar Detección
              </Button>
            </>
          )}

          {/* 🎥 Mostrar video en tiempo real + YOLO */}
          {/* 🎥 Mostrar stream MJPEG + detecciones YOLO en tiempo real ✅ */}
          {isDetecting && cameraStreamUrl && (
            <div className="grid gap-2">
              <CheckCircle2 className="w-10 h-10 text-success mx-auto animate-bounce" />
              <p className="text-success font-bold">✅ Cámara IA Activa</p>
              <p className="font-semibold">{workerInfo}</p>

              {/* 🔥 USAMOS <img> porque el backend transmite MJPEG */}
              <img
                src={cameraStreamUrl}
                className="w-full rounded-xl border-2 mt-2 object-cover"
                style={{ height: "380px", objectFit: "cover" }}
                alt="stream webcam IA"
              />

              {/* Botón validar prueba */}
              <Button onClick={validarIA} size="lg" className="w-full mt-2 bg-blue-600 text-white rounded-xl">
                <Scan className="w-4 h-4 mr-2 inline" />
                Validar (Prueba)
              </Button>

              {/* ❌ Cancelar detección (ya para el stream correctamente) */}
              <Button
                onClick={detenerCamara}
                variant="outline"
                size="sm"
                className="mt-2 border-red-500 text-red-600"
              >
                Cancelar detección
              </Button>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
