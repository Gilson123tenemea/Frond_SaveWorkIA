"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Camera,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface WorkerHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workerName: string;
  history: any[];
}

export function WorkerHistoryDialog({
  open,
  onOpenChange,
  workerName,
  history,
}: WorkerHistoryDialogProps) {
  const total = history.length;
  const violations = history.filter((h: any) =>
    h.detections.some((d: any) => !d.detected)
  ).length;
  const compliant = total - violations;
  const rate = total ? ((compliant / total) * 100).toFixed(1) : "0";

  // Agrupar por fecha
  const grouped = history.reduce((acc: any, rec: any) => {
    const [fecha] = rec.timestamp.split(",");
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(rec);
    return acc;
  }, {});

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-w-[900px]
          w-[95vw]
          rounded-2xl
          p-6
          bg-white
        "
      >
        {/* TITULO */}
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Historial de {workerName}
          </DialogTitle>
          <DialogDescription>
            Registro completo de detecciones y cumplimiento de EPP
          </DialogDescription>
        </DialogHeader>

        {/* CONTENIDO CENTRADO */}
        <div className="max-w-[900px] mx-auto space-y-6">

          {/* ESTADÍSTICAS */}
          <div className="grid grid-cols-4 gap-4">

            <Card>
              <CardContent className="pt-3">
                <p className="text-xs text-muted-foreground text-left whitespace-normal break-words leading-tight">
                  Total
                </p>
                <p className="text-2xl font-bold">{total}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-3">
                <p className="text-xs text-muted-foreground text-left whitespace-normal break-words leading-tight">
                  Cumplimientos
                </p>
                <p className="text-2xl font-bold text-green-600">{compliant}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-3">
                <p className="text-xs text-muted-foreground text-left whitespace-normal break-words leading-tight">
                  Incumplimientos
                </p>
                <p className="text-2xl font-bold text-red-600">{violations}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-3">
                <p className="text-xs text-muted-foreground text-left whitespace-normal break-words leading-tight">
                  Tasa
                </p>
                <p className="text-2xl font-bold">{rate}%</p>
              </CardContent>
            </Card>

          </div>

          {/* LISTA DEL HISTORIAL */}
          <ScrollArea className="h-[350px] pr-3">

            {Object.entries(grouped).map(([fecha, records]: any) => (
              <div key={fecha} className="space-y-3 mb-4">

                {/* FECHA */}
                <div className="flex items-center gap-2 py-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p className="font-semibold text-sm">{fecha}</p>
                </div>

                {/* REGISTROS */}
                {records.map((r: any) => {
                  const hasViolation = r.detections.some((d: any) => !d.detected);

                  return (
                    <Card
                      key={r.id}
                      className="border rounded-xl shadow-sm"
                    >
                      <CardContent className="p-4">

                        <div className="grid gap-4 md:grid-cols-[150px_1fr]">

                          {/* IMAGEN */}
                          <div className="relative rounded-lg overflow-hidden bg-muted h-[120px]">
                            <img
                              src={
                                r.image?.startsWith("data:image")
                                  ? r.image
                                  : r.image
                                    ? `data:image/jpeg;base64,${r.image}`
                                    : "/placeholder.png"
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

                          {/* INFORMACIÓN */}
                          <div className="space-y-2">

                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
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

                                // 🔥 IDENTIFICAR SI ES GAFAS
                                const isGafas =
                                  det.item.toLowerCase() === "gafas" ||
                                  det.key?.toLowerCase() === "lentes";

                                // 🔥 LÓGICA DE COLORES
                                const classes = det.detected
                                  ? "bg-green-50 border-green-200 text-green-600"
                                  : isGafas
                                    ? "bg-yellow-50 border-yellow-400 text-yellow-700"
                                    : "bg-red-50 border-red-200 text-red-600";

                                return (
                                  <div
                                    key={det.item}
                                    className={`
                                      flex items-center gap-1 px-2 py-1 rounded border text-xs
                                      ${classes}
                                    `}
                                  >
                                    <Icon className="w-3 h-3" />
                                    {det.item}
                                  </div>
                                );
                              })}
                            </div>

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
