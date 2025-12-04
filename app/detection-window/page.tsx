"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, AlertCircle, CheckCircle2, Scan, X, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { BASE_URL } from "@/servicios/api";
import { obtenerTrabajadorPorCodigo } from "@/servicios/trabajador";
import { obtenerUrlStreamWebcamIA, detenerStreamWebcamIA } from "@/servicios/camara_ia";
import { verificarEPP, formatearResultadoEPP, obtenerUrlFoto } from "@/servicios/verificar_epp";

export default function DetectionWindow() {
  // Estados básicos
  const [workerCode, setWorkerCode] = useState("");
  const [workerInfo, setWorkerInfo] = useState<string | null>(null);
  const [workerError, setWorkerError] = useState("");
  const [cameraStreamUrl, setCameraStreamUrl] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [idCamaraActiva, setIdCamaraActiva] = useState<number | null>(null);

  // Estados de verificación EPP
  const [isVerifying, setIsVerifying] = useState(false);
  const [resultadoEPP, setResultadoEPP] = useState<any>(null);
  const [cargandoAnalisis, setCargandoAnalisis] = useState(false);

  const videoRef = useRef<HTMLImageElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup al desmontar
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

  // Detener cámara y limpiar estados
  const detenerCamara = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (idCamaraActiva) {
      await detenerStreamWebcamIA(idCamaraActiva);
      setIdCamaraActiva(null);
    }

    setIsDetecting(false);
    setIsVerifying(false);
    setResultadoEPP(null);
    setCameraStreamUrl(null);
    setWorkerInfo(null);
    setWorkerCode("");
    setCargandoAnalisis(false);

    if (videoRef.current) {
      videoRef.current.src = "";
    }

    console.log("✅ Stream detenido correctamente");
  };

  // Iniciar detección y stream
  const handleStartDetection = async () => {
    setWorkerError("");
    setWorkerInfo(null);
    setCameraStreamUrl(null);
    setResultadoEPP(null);

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
      // 1️⃣ OBTENER TRABAJADOR
      console.log("📋 Obteniendo datos del trabajador...");
      const trabajador = await obtenerTrabajadorPorCodigo(codigo, companyId);

      if (!trabajador || trabajador.error) {
        setWorkerError(trabajador?.error || "❌ Trabajador no encontrado");
        return;
      }

      const nombreCompleto = `${trabajador.persona.nombre} ${trabajador.persona.apellido}`;
      setWorkerInfo(nombreCompleto);

      // 2️⃣ OBTENER ID DE CÁMARA
      const idCamara = trabajador.camara?.id_camara;
      if (!idCamara) {
        setWorkerError("❌ El trabajador no tiene cámara asignada");
        return;
      }

      // 3️⃣ INICIAR STREAM
      console.log("🎥 Iniciando stream...");
      setIsDetecting(true);
      setIdCamaraActiva(idCamara);

      const streamUrl = obtenerUrlStreamWebcamIA(idCamara);
      if (!streamUrl) {
        setWorkerError("❌ No se pudo generar URL del stream");
        setIsDetecting(false);
        return;
      }

      // 🔥 IMPORTANTE: Iniciar stream en el backend (sin esperar respuesta)
      console.log("🚀 Activando stream en backend...");
      fetch(streamUrl, { method: "GET" }).catch((err) => {
        console.warn("⚠ Stream iniciado en background:", err);
      });

      // Pequeña pausa para que el backend prepare la cámara
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setCameraStreamUrl(streamUrl);
      if (videoRef.current) {
        videoRef.current.src = streamUrl;
      }

      console.log(`🎥 Stream IA activo para cámara ${idCamara}`);

      // 4️⃣ ESPERAR 2 SEGUNDOS Y LUEGO VERIFICAR EPP
      setCargandoAnalisis(true);
      console.log("⏳ Esperando 2 segundos para capturar frames...");

      timerRef.current = setTimeout(async () => {
        await verificarEPPDelTrabajador(idCamara, codigo, trabajador);
      }, 3000);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      setWorkerError(`❌ Error: ${errorMessage}`);
      setIsDetecting(false);
      setIdCamaraActiva(null);
    }
  };

  // Verificar EPP (se llama automáticamente después de 3 segundos)
  const verificarEPPDelTrabajador = async (idCamara: number, codigo: string, datosTrabajador: any) => {
    try {
      console.log("🤖 Analizando EPP con YOLO...");
      setIsVerifying(true);

      const resultado = await verificarEPP(idCamara, codigo, datosTrabajador);
      if (resultado && typeof resultado === 'object' && 'error' in resultado && resultado.error) {
        setWorkerError(`❌ ${resultado.error}`);
        setIsVerifying(false);
        return;
      }

      // Formatear resultado para UI
      const resultadoFormateado = formatearResultadoEPP(resultado);
      setResultadoEPP(resultadoFormateado);

      console.log("✅ Análisis completado");
      console.log(resultadoFormateado);

      setIsVerifying(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      setWorkerError(`❌ Error analizando EPP: ${errorMessage}`);
      setIsVerifying(false);
    } finally {
      setCargandoAnalisis(false);
    }
  };

  // Reintentar análisis manual
  const reintentar = async () => {
    if (!idCamaraActiva || !workerCode || !workerInfo) return;

    // Obtener datos del trabajador nuevamente
    const trabajador = await obtenerTrabajadorPorCodigo(workerCode.trim(), companyId!);
    if (!trabajador || trabajador.error) return;

    setResultadoEPP(null);
    // @ts-ignore - TypeScript cache issue, función acepta 3 parámetros
    await verificarEPPDelTrabajador(idCamaraActiva, workerCode.trim(), trabajador);
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
          {/* ❌ ERROR ALERT */}
          {workerError && (
            <Alert className="bg-red-100 border-red-500 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{workerError}</AlertDescription>
            </Alert>
          )}

          {/* 📋 FORMULARIO ENTRADA */}
          {!isDetecting && !resultadoEPP && (
            <div className="space-y-3">
              <div className="grid gap-2">
                <Label className="text-sm font-semibold">Código del Trabajador</Label>
                <Input
                  value={workerCode}
                  onChange={(e) => setWorkerCode(e.target.value)}
                  placeholder="Ej: TRA-001"
                  className="text-center text-lg border-2 rounded-xl"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleStartDetection();
                  }}
                />
              </div>

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

          {/* 🎥 STREAM ACTIVO + ANÁLISIS EN PROCESO */}
          {isDetecting && cameraStreamUrl && !resultadoEPP && (
            <div className="grid gap-3">
              {/* Indicador de estado */}
              <div className="flex items-center justify-center gap-2">
                {cargandoAnalisis ? (
                  <>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                    <p className="text-sm font-semibold text-yellow-600">
                      ⏳ Analizando EPP...
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-sm font-semibold text-green-600">
                      ✅ Cámara activa
                    </p>
                  </>
                )}
              </div>

              {/* Info trabajador */}
              {workerInfo && (
                <p className="text-sm font-semibold text-center">{workerInfo}</p>
              )}

              {/* Video stream */}
              <div className="relative w-full rounded-xl border-2 overflow-hidden bg-black" style={{ height: "380px" }}>
                <img
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  alt="stream webcam IA"
                  onError={() => console.error("❌ Error cargando stream")}
                />

                {/* Overlay indicador análisis */}
                {cargandoAnalisis && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-2" />
                      <p className="text-white text-sm">Capturando y analizando...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Botón cancelar */}
              <Button
                onClick={detenerCamara}
                variant="outline"
                size="sm"
                className="mt-2 border-red-500 text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          )}

          {/* ✅/❌ RESULTADO EPP */}
          {resultadoEPP && (
            <div className="grid gap-3">
              {/* Estado general */}
              <div
                className={`p-4 rounded-xl text-center ${resultadoEPP.cumpleEpp
                  ? "bg-green-100 border-2 border-green-500"
                  : "bg-red-100 border-2 border-red-500"
                  }`}
              >
                {resultadoEPP.cumpleEpp ? (
                  <>
                    <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-green-700 text-lg">✅ CUMPLE EPP</p>
                    <p className="text-sm text-green-600 mt-1">Entrada permitida</p>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-2" />
                    <p className="font-bold text-red-700 text-lg">❌ NO CUMPLE EPP</p>
                    <p className="text-sm text-red-600 mt-1">
                      {resultadoEPP.mensaje}
                    </p>
                  </>
                )}
              </div>

              {/* Detecciones */}
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <p className="text-sm font-semibold text-gray-700">Detecciones:</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(resultadoEPP.detecciones).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${value ? "bg-green-500" : "bg-red-500"
                          }`}
                      />
                      <span className="text-sm capitalize">
                        {key}: {value ? "✓" : "✗"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detalles de fallos */}
              {resultadoEPP.detallesFallo && resultadoEPP.detallesFallo.length > 0 && (
                <Alert className="bg-orange-100 border-orange-500 text-orange-700">
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    <p className="font-semibold mb-1">Implementos faltantes:</p>
                    <ul className="list-disc list-inside text-sm">
                      {resultadoEPP.detallesFallo.map((detalle: string, i: number) => (
                        <li key={i}>{detalle}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Foto de evidencia si no cumple */}
              {!resultadoEPP.cumpleEpp && resultadoEPP.fotoUrl && (
                <div className="border-2 border-red-300 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    📸 Foto de incumplimiento:
                  </p>
                  <img
                    src={obtenerUrlFoto(resultadoEPP.fotoUrl) || ""}
                    alt="Evidencia fallo EPP"
                    className="w-full h-48 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ccc' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3ENo disponible%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-2">{resultadoEPP.fotoUrl}</p>
                </div>
              )}

              {/* Botones finales */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={reintentar}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  🔄 Reintentar
                </Button>
                <Button
                  onClick={detenerCamara}
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  ✅ Finalizar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}