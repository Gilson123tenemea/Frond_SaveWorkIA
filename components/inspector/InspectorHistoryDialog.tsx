"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import {
  AlertTriangle,
  Camera,
  Calendar,
  CheckCircle2,
  Clock,
  HardHat,
  Shield,
  Glasses,
  Shirt,
} from "lucide-react";

// ========================================================
// MAPEO DE EPP CON NOMBRES E ICONOS
// ========================================================
const EPP_CONFIG = {
  casco: {
    nombre: "Casco",
    icon: HardHat,
  },
  chaleco: {
    nombre: "Chaleco",
    icon: Shirt,
  },
  guantes: {
    nombre: "Guantes",
    icon: Shield,
  },
  botas: {
    nombre: "Botas",
    icon: Shield,
  },
  lentes: {
    nombre: "Lentes",
    icon: Glasses,
  },
  gafas: {
    nombre: "Gafas",
    icon: Glasses,
  },
  mascarilla: {
    nombre: "Mascarilla",
    icon: Shield,
  },
};

// ========================================================
// NORMALIZAR TEXTO
// ========================================================
function normalizar(texto: string | null | undefined): string {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function InspectorHistoryDialog({
  open,
  onOpenChange,
  workerName,
  stats,
  historial,
}: any) {
 
  // ========================================================
  // TRANSFORMAR DETECCIONES - SOLO EPP DE LA ZONA
  // ========================================================
  function transformarDetecciones(record: any): any[] {
    
    const eppsZonaRequeridos = record.epps_zona || [];
    const deteccionesArray = record.detecciones || [];

  

    // 🔥 Si no viene epps_zona, retornar vacío (no mostrar nada)
    if (eppsZonaRequeridos.length === 0) {
      return [];
    }

    // 🔥 Normalizar array de detecciones para comparar
    const deteccionesNormalizadas = deteccionesArray.map((det: string) => 
      normalizar(det)
    );


    // 🔥 Crear detecciones SOLO para los EPP de la zona
    const resultado = eppsZonaRequeridos
      .map((eppKey: string) => {
        const config = EPP_CONFIG[eppKey as keyof typeof EPP_CONFIG];

        if (!config) {
          console.warn(`⚠️ EPP no configurado: ${eppKey}`);
          return null;
        }

        // 🔥 VERIFICAR SI ESTÁ EN EL ARRAY DE DETECCIONES
        const eppKeyNorm = normalizar(eppKey);
        const esFaltante = deteccionesNormalizadas.some((detNorm: string) => 
          detNorm.includes(eppKeyNorm)
        );


        return {
          item: config.nombre,
          key: eppKey,
          icon: config.icon,
          detected: !esFaltante, // verde si NO está en detecciones, rojo si está
        };
      })
      .filter((item: any): item is NonNullable<any> => item !== null);

    return resultado;
  }

  // ========================================================
  // TRANSFORMAR HISTORIAL - AGREGAR DETECCIONES Y TIMESTAMP
  // ========================================================
  const historialTransformado = historial.map((rec: any) => {
    const detections = transformarDetecciones(rec);
    const timestamp = rec.timestamp || new Date(rec.fecha_registro).toLocaleString("es-EC");
    
    return {
      ...rec,
      detections,
      timestamp,
    };
  });

  // Agrupar por fecha
  const grouped = historialTransformado.reduce((acc: any, rec: any) => {
    const [fecha] = rec.timestamp.split(",");
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(rec);
    return acc;
  }, {});

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] w-[95vw] rounded-2xl p-6 bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Historial de {workerName}
          </DialogTitle>
          <DialogDescription>
            Reportes detectados por este inspector
          </DialogDescription>
        </DialogHeader>

        <div className="max-w-[900px] mx-auto space-y-6">

          {/* === ESTADÍSTICAS === */}
          <div className="grid grid-cols-4 gap-4">
            <Card><CardContent className="pt-3 text-center">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent></Card>

            <Card><CardContent className="pt-3 text-center">
              <p className="text-xs text-muted-foreground">Revisados</p>
              <p className="text-2xl font-bold text-green-600">{stats.revisados}</p>
            </CardContent></Card>

            <Card><CardContent className="pt-3 text-center">
              <p className="text-xs text-muted-foreground">Pendientes</p>
              <p className="text-2xl font-bold text-red-600">{stats.pendientes}</p>
            </CardContent></Card>

            <Card><CardContent className="pt-3 text-center">
              <p className="text-xs text-muted-foreground">Tasa</p>
              <p className="text-2xl font-bold">{stats.tasa_revisado}%</p>
            </CardContent></Card>
          </div>

          {/* === HISTORIAL === */}
          <ScrollArea className="h-[350px] pr-3">
            {Object.entries(grouped).map(([fecha, records]: any) => (
              <div key={fecha} className="space-y-3 mb-4">

                {/* FECHA AGRUPADA */}
                <div className="flex items-center gap-2 py-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p className="font-semibold text-sm">{fecha}</p>
                </div>

                {/* REGISTROS */}
                {records.map((r: any, index: number) => {

                  // 🔥 YA VIENEN TRANSFORMADAS DESDE ARRIBA
                  const detections = r.detections;
                  const hasViolation = detections.some((d: any) => !d.detected);

                  return (
                      <Card key={`${fecha}-${index}`} className="border rounded-xl shadow-sm">
                      <CardContent className="p-4">
                        <div className="grid gap-4 md:grid-cols-[150px_1fr]">

                          {/* FOTO */}
                          <div className="relative rounded-lg overflow-hidden bg-muted h-[120px]">
                            <img
                              src={
                                r.evidencia?.foto_base64
                                  ? `data:image/jpeg;base64,${r.evidencia.foto_base64}`
                                  : r.image || "/placeholder.png"
                              }
                              className="w-full h-full object-cover"
                            />

                            <Badge
                              variant={hasViolation ? "destructive" : "default"}
                              className="absolute top-2 right-2 text-xs"
                            >
                              {hasViolation ? (
                                <>
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Incumplimiento
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Cumplimiento
                                </>
                              )}
                            </Badge>
                          </div>

                          {/* INFO */}
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {r.timestamp}
                              <span>•</span>
                              <Camera className="w-3 h-3" />
                              {r.camara?.codigo || r.camera}
                              <span>•</span>
                              {r.camara?.zona || r.zone}
                            </div>

                            {/* DETECCIONES */}
                            <div className="grid grid-cols-3 gap-2">
                              {detections.map((det: any) => {
                                const Icon = det.icon;

                                return (
                                  <div
                                    key={det.item}
                                    className={`flex items-center gap-1 px-2 py-1 rounded border text-xs ${
                                      det.detected
                                        ? "bg-green-50 border-green-200 text-green-600"
                                        : "bg-red-50 border-red-200 text-red-600"
                                    }`}
                                  >
                                    <Icon className="w-3 h-3" />
                                    {det.item}
                                  </div>
                                );
                              })}
                            </div>

                            {/* OBSERVACIÓN */}
                            {r.evidencia?.observaciones && (
                              <div className="mt-2 p-2 rounded bg-blue-50 border text-xs">
                                <strong>Observación:</strong> {r.evidencia.observaciones}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}