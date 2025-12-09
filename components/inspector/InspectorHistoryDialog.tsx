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

import {
  AlertTriangle,
  Camera,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";

export function InspectorHistoryDialog({
  open,
  onOpenChange,
  workerName,
  stats,
  historial,
}: any) {
  const grouped = historial.reduce((acc: any, rec: any) => {
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

                  const hasViolation = r.detections.some((d: any) => !d.detected);

                  return (
                      <Card key={`${fecha}-${index}`} className="border rounded-xl shadow-sm">
                      <CardContent className="p-4">
                        <div className="grid gap-4 md:grid-cols-[150px_1fr]">

                          {/* FOTO */}
                          <div className="relative rounded-lg overflow-hidden bg-muted h-[120px]">
                            <img
                              src={r.image}
                              className="w-full h-full object-cover"
                            />

                            <span
                              className={`absolute top-2 right-2 text-xs px-2 py-1 rounded ${
                                hasViolation
                                  ? "bg-red-500 text-white"
                                  : "bg-green-500 text-white"
                              }`}
                            >
                              {hasViolation ? "Incumplimiento" : "Cumplimiento"}
                            </span>
                          </div>

                          {/* INFO */}
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {r.timestamp}
                              <span>•</span>
                              <Camera className="w-3 h-3" />
                              {r.camera}
                              <span>•</span>
                              {r.zone}
                            </div>

                            {/* DETECCIONES */}
                            <div className="grid grid-cols-3 gap-2">
                              {r.detections.map((det: any) => {
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
                            {r.observacionesTexto && (
                              <div className="mt-2 p-2 rounded bg-blue-50 border text-xs">
                                <strong>Observación:</strong> {r.observacionesTexto}
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
