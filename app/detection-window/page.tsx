"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, AlertCircle, Scan, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { obtenerTrabajadorPorCodigo } from "@/servicios/trabajador";
import { obtenerUrlStreamWebcamIA, detenerStreamWebcamIA } from "@/servicios/camara_ia";
import { verificarEPP } from "@/servicios/verificar_epp";
import { obtenerEppPorZona } from "@/servicios/zona_epp";

export default function DetectionWindow() {
  const [workerCode, setWorkerCode] = useState("");
  const [workerInfo, setWorkerInfo] = useState<string | null>(null);
  const [workerError, setWorkerError] = useState("");

  const [cameraStreamUrl, setCameraStreamUrl] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [idCamaraActiva, setIdCamaraActiva] = useState<number | null>(null);

  const [cargandoAnalisis, setCargandoAnalisis] = useState(false);

  const [eppZona, setEppZona] = useState<string[]>([]);

  const videoRef = useRef<HTMLImageElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamImgRef = useRef<HTMLImageElement | null>(null); 

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

    // 🔥 Limpiar la imagen que consume el stream
    if (streamImgRef.current) {
      streamImgRef.current.src = "";
      streamImgRef.current = null;
    }

    if (idCamaraActiva) {
      await detenerStreamWebcamIA(idCamaraActiva);
      setIdCamaraActiva(null);
    }

    setIsDetecting(false);
    setWorkerInfo(null);
    setWorkerCode("");
    setCameraStreamUrl(null);
    setCargandoAnalisis(false);
    setEppZona([]);

    console.log("🔌 Cámara apagada, modelo detenido, formulario reiniciado.");
  };

  // 🔥 NUEVO: Notificar a la ventana padre que hay un nuevo reporte
  const notificarNuevoReporte = () => {
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(
        {
          type: "NUEVO_REPORTE_CREADO",
          timestamp: new Date().toISOString(),
        },
        "*"
      );
      console.log("📢 Notificación enviada a la ventana padre");
    }
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
      const idZona = trabajador.camara?.zona?.id_Zona;

      if (!idCamara) {
        setWorkerError("❌ El trabajador no tiene cámara asignada");
        return;
      }

      // OBTENER EPP DE LA ZONA
      if (idZona) {
        const epps = await obtenerEppPorZona(idZona);
        setEppZona(epps.map((e: any) => e.tipo_epp));
      }

      setIsDetecting(true);
      setIdCamaraActiva(idCamara);

      const streamUrl = obtenerUrlStreamWebcamIA(idCamara);

      // 🔥 Conectar stream con Image para que el backend pueda llenando el buffer
      const streamImg = new Image();
      streamImgRef.current = streamImg;
      streamImg.src = streamUrl;

      await new Promise<void>((resolve) => {
        streamImg.onload = () => {
          console.log("✅ Stream conectado, buffer del backend activo");
          resolve();
        };
        setTimeout(resolve, 3000);
      });

      setCameraStreamUrl(streamUrl);
      if (videoRef.current) {
        videoRef.current.src = streamUrl;
      }

      console.log("🎥 Cámara activa, iniciando captura...");

      setCargandoAnalisis(true);

      // Esperar a que el buffer tenga varios frames
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Ahora llamar a verificar EPP
      await verificarEPPDelTrabajador(idCamara, codigo, trabajador);

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

      // 🔥 Notificar a la ventana padre que hay un nuevo reporte
      notificarNuevoReporte();

      // 🔥 Esperar un poco y luego limpiar para la siguiente detección
      setTimeout(() => {
        detenerCamara();
      }, 1000);

    } catch (error: any) {
      setWorkerError("⚠ Error analizando EPP");
      await detenerCamara();
    }
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
            <div className="py-8 space-y-4">

              {/* Estado */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                <p className="text-sm font-semibold text-blue-700">
                  Escaneando EPP…
                </p>
              </div>

              {/* Nombre */}
              {workerInfo && (
                <p className="text-sm font-semibold text-center">{workerInfo}</p>
              )}

              {/* EPP DE LA ZONA */}
              {eppZona.length > 0 && (
                <div className="border rounded-lg p-3 bg-muted">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    EPP requeridos en esta zona
                  </p>

                  <ul className="list-disc ml-6 text-sm mt-2">
                    {eppZona.map((epp) => (
                      <li key={epp}>{epp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ANIMACIÓN CON IMAGEN Y LÍNEA DE ESCANEO */}
              <div className="relative w-full h-80 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 
                  bg-[linear-gradient(rgba(59,130,246,0.10)_1px,transparent_1px),
                  linear-gradient(90deg,rgba(59,130,246,0.10)_1px,transparent_1px)]
                  bg-[size:22px_22px]" />

                <div className="relative w-40 h-[300px] flex items-center justify-center">
                  <img
                    src="/cuerpo_escaneo.png"
                    alt="Escaneo de cuerpo"
                    className="w-full h-full object-contain drop-shadow-lg"
                  />

                  {/* Línea de escaneo que baja en 3 segundos y sube */}
                  <div
                    className="absolute left-0 right-0 h-1 
                    bg-gradient-to-b from-transparent via-primary to-transparent 
                    shadow-lg"
                    style={{
                      animation: 'scanLineLoop 3s ease-in-out infinite'
                    }}
                  />
                </div>
              </div>

              <style>{`
                @keyframes scanLineLoop {
                  0% {
                    top: 0%;
                  }
                  100% {
                    top: 100%;
                  }
                }
              `}</style>

            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}