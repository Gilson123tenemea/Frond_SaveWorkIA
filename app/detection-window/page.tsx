"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, AlertCircle, Scan, ShieldCheck, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { obtenerTrabajadorPorCodigo } from "@/servicios/trabajador";
import { obtenerEppPorZona } from "@/servicios/zona_epp";
import { 
  flujoCompletoAnalisisEPP,
  verificarSoporteCamara 
} from "@/servicios/analisis_epp_directo";

// Importar tipos
import type { 
  TrabajadorResponse, 
  EppZona, 
  ResultadoAnalisis 
} from "@/types/types";

// ============================================
// TIPOS LOCALES
// ============================================

interface WorkerInfo {
  nombre: string;
  codigo: string;
}

export default function DetectionWindow() {
  const [workerCode, setWorkerCode] = useState<string>("");
  const [workerInfo, setWorkerInfo] = useState<WorkerInfo | null>(null);
  const [workerError, setWorkerError] = useState<string>("");
  
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [companyId, setCompanyId] = useState<number | null>(null);
  
  const [eppZona, setEppZona] = useState<string[]>([]);
  const [resultado, setResultado] = useState<ResultadoAnalisis | null>(null);
  
  const [estadoAnalisis, setEstadoAnalisis] = useState<string>("");

  // Inicializar datos del supervisor
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setCompanyId(user.id_empresa_supervisor ?? null);
    }
    
    // Verificar soporte de cámara
    if (!verificarSoporteCamara()) {
      setWorkerError("⚠️ Tu navegador no soporta acceso a cámara");
    }
  }, []);

  // Función para reiniciar el formulario
  const reiniciarFormulario = () => {
    setWorkerInfo(null);
    setWorkerCode("");
    setWorkerError("");
    setIsAnalyzing(false);
    setEppZona([]);
    setResultado(null);
    setEstadoAnalisis("");
    console.log("🔄 Formulario reiniciado");
  };

  // 🔥 Notificar a la ventana padre sobre nuevo reporte
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

  // Inicio del análisis EPP
  const handleStartDetection = async () => {
    setWorkerError("");
    setWorkerInfo(null);
    setResultado(null);
    setEstadoAnalisis("");

    if (!workerCode.trim()) {
      setWorkerError("⚠️ Ingresa el código del trabajador");
      return;
    }

    if (!companyId) {
      setWorkerError("❌ No hay empresa vinculada al supervisor");
      return;
    }

    const codigo = workerCode.trim();

    try {
      setEstadoAnalisis("🔍 Validando trabajador...");
      
      // 1. Obtener datos del trabajador
      const trabajador = await obtenerTrabajadorPorCodigo(codigo, companyId) as TrabajadorResponse;

      if (!trabajador || trabajador.error) {
        setWorkerError(trabajador?.error || "❌ Trabajador no encontrado");
        return;
      }

      const nombreCompleto = `${trabajador.persona.nombre} ${trabajador.persona.apellido}`;
      setWorkerInfo({
        nombre: nombreCompleto,
        codigo: codigo,
      });

      // ✅ ZONA VIENE DIRECTAMENTE DEL TRABAJADOR
      const idZona = trabajador.zona?.id_Zona;

      if (!idZona) {
        setWorkerError("❌ El trabajador no tiene zona asignada. Por favor, asigna una zona en la gestión de trabajadores.");
        return;
      }

      console.log(`✅ Zona encontrada: ${trabajador.zona?.nombreZona} (ID: ${idZona})`);
      console.log(`✅ Cámara encontrada: ID ${trabajador.camara?.id_camara}`);

      // 2. Obtener EPP de la zona
      setEstadoAnalisis("📋 Cargando EPP requeridos...");
      const epps = await obtenerEppPorZona(idZona) as EppZona[];
      setEppZona(epps.map((e) => e.tipo_epp));

      setIsAnalyzing(true);
      
      // 3. Iniciar análisis completo
      setEstadoAnalisis("📸 Accediendo a cámara...");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setEstadoAnalisis("🎯 Capturando imagen...");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setEstadoAnalisis("🤖 Analizando EPP con IA...");
      
      const resultadoAnalisis = await flujoCompletoAnalisisEPP({
        codigo_trabajador: codigo,
        id_empresa: trabajador.id_empresa,
        id_zona: idZona,
        id_trabajador: trabajador.id_trabajador,
        id_supervisor_trabajador: trabajador.id_supervisor_trabajador,
        id_inspector: trabajador.id_inspector || null,
        persona: trabajador.persona,
        camara: trabajador.camara,  // ✅ ESTO FALTABA - pasa la cámara del backend
      });

      console.log("📊 Resultado del análisis:", resultadoAnalisis);

      if (resultadoAnalisis.error) {
        setWorkerError(resultadoAnalisis.mensaje);
        setIsAnalyzing(false);
        return;
      }

      setResultado(resultadoAnalisis);
      setEstadoAnalisis("✅ Análisis completado");
      
      // Notificar nuevo reporte
      notificarNuevoReporte();

      // Auto-reiniciar después de 5 segundos
      setTimeout(() => {
        reiniciarFormulario();
      }, 5000);

    } catch (error: any) {
      console.error("❌ Error:", error);
      setWorkerError(`❌ Error: ${error.message}`);
      setIsAnalyzing(false);
      setEstadoAnalisis("");
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
          <CardDescription>
            Análisis de EPP con IA en tiempo real
          </CardDescription>
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
          {!isAnalyzing && !resultado && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">
                Código del Trabajador
              </Label>
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
                Iniciar Análisis
              </Button>
            </div>
          )}

          {/* ESTADO DE ANÁLISIS */}
          {isAnalyzing && !resultado && (
            <div className="py-8 space-y-4">
              
              {/* Estado actual */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                <p className="text-sm font-semibold text-blue-700">
                  {estadoAnalisis}
                </p>
              </div>

              {/* Nombre del trabajador */}
              {workerInfo && (
                <p className="text-sm font-semibold text-center">
                  {workerInfo.nombre}
                </p>
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

              {/* ANIMACIÓN DE ESCANEO */}
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

                  {/* Línea de escaneo animada */}
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
                  0% { top: 0%; }
                  100% { top: 100%; }
                }
              `}</style>
            </div>
          )}

          {/* RESULTADO DEL ANÁLISIS */}
          {resultado && (
            <div className="space-y-4">
              
              {/* Estado del resultado */}
              <Alert className={resultado.cumpleEpp 
                ? "bg-green-100 border-green-500" 
                : "bg-red-100 border-red-500"
              }>
                <div className="flex items-center gap-2">
                  {resultado.cumpleEpp ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <AlertDescription className={resultado.cumpleEpp 
                    ? "text-green-700 font-semibold" 
                    : "text-red-700 font-semibold"
                  }>
                    {resultado.mensaje}
                  </AlertDescription>
                </div>
              </Alert>

              {/* Información del trabajador */}
              {workerInfo && (
                <div className="border rounded-lg p-3 bg-muted">
                  <p className="text-sm font-semibold">
                    👤 {workerInfo.nombre}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Código: {workerInfo.codigo}
                  </p>
                </div>
              )}

              {/* Detalles del fallo */}
              {!resultado.cumpleEpp && resultado.detallesFallo.length > 0 && (
                <div className="border border-red-300 rounded-lg p-3 bg-red-50">
                  <p className="text-sm font-semibold text-red-700 mb-2">
                    EPP Faltante:
                  </p>
                  <ul className="list-disc ml-6 text-sm text-red-600">
                    {resultado.detallesFallo.map((detalle, idx) => (
                      <li key={idx}>{detalle}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Foto de evidencia */}
              {resultado.evidencia?.fotoBase64 && (
                <div className="border rounded-lg overflow-hidden">
                  <img 
                    src={resultado.evidencia.fotoBase64} 
                    alt="Evidencia"
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* Botón para nuevo análisis */}
              <Button
                onClick={reiniciarFormulario}
                variant="outline"
                className="w-full rounded-xl"
              >
                Nuevo Análisis
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                El formulario se reiniciará automáticamente en 5 segundos
              </p>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}