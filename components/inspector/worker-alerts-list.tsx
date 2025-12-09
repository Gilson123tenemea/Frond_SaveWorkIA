"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";

import { obtenerIncumplimientosPorInspector } from "@/servicios/reporte_inspector_incumplimiento";
import { actualizarEvidenciaFallo } from "@/servicios/evidencia_fallo";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  AlertTriangle,
  Camera,
  Clock,
  HardHat,
  Shield,
  Glasses,
  Shirt,
  Plus,
} from "lucide-react";

// =============================================
// 🔥 ICONOS DE EPP
// =============================================
const ICON_MAP: any = {
  casco: HardHat,
  chaleco: Shirt,
  botas: Shield,
  guantes: Shield,
  lentes: Glasses,
};

// =============================================
// 🔥 MODELO UI
// =============================================
interface WorkerAlert {
  id: number;
  idEvidencia: number;   // ← 🔥 NECESARIO
  workerName: string;
  workerDni: string;
  camera: string;
  zoneName: string;
  violation: string;
  photoUrl: string;
  severity: "high" | "medium" | "low";
  timestamp: string;
  observations: string[];
  detections: any[];
  estado: boolean | null;
  observacionesTexto?: string | null;
}


export function WorkerAlertsList() {
  const user = getUser();
  const idInspector = user?.id_inspector ?? null;

  const [alerts, setAlerts] = useState<WorkerAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);
  const [observation, setObservation] = useState("");

  const [filter, setFilter] = useState<"todos" | "pendientes" | "revisados">(
    "todos"
  );

  // ===========================================================
  // 🔥 1. Obtener datos desde backend
  // ===========================================================
  useEffect(() => {
    if (!idInspector) return;

    async function cargar() {
      const data = await obtenerIncumplimientosPorInspector(idInspector as number);

      setAlerts(transformarDatos(data));
    }

    cargar();
  }, [idInspector]);

  // ===========================================================
  // 🔥 2. Transformar datos backend → UI
  // ===========================================================
  function transformarDatos(data: any[]): WorkerAlert[] {
    return data.map((item: any, index: number) => {
      const detalle = item.evidencia.detalle.toLowerCase();

      const detections = [
        { item: "Casco", key: "casco" },
        { item: "Chaleco", key: "chaleco" },
        { item: "Botas", key: "botas" },
        { item: "Guantes", key: "guantes" },
        { item: "Lentes", key: "lentes" },
      ].map((det) => ({
        item: det.item,
        key: det.key,
        icon: ICON_MAP[det.key],
        detected: !detalle.includes(det.key),
      }));

      const fails = detections.filter((d) => !d.detected).length;

      return {
        id: index + 1,
        idEvidencia: item.evidencia.id_evidencia,
        workerName: `${item.trabajador.nombre} ${item.trabajador.apellido}`,
        workerDni: item.trabajador.cedula,
        camera: item.camara.codigo,
        zoneName: item.camara.zona,
        violation: item.evidencia.detalle,
        photoUrl: `data:image/jpeg;base64,${item.evidencia.foto_base64}`,
        timestamp: item.fecha_registro,
        severity: fails >= 3 ? "high" : fails === 2 ? "medium" : "low",
        observations: item.evidencia.observaciones ? [item.evidencia.observaciones] : [],
        detections,
        estado: item.evidencia.estado,
        observacionesTexto: item.evidencia.observaciones,
      };

    });
  }

  // ===========================================================
  // 🔥 3. Guardar observación
  // ===========================================================
  async function agregarObservacion() {
    if (!selectedAlert || observation.trim() === "") return;

    const alert = alerts.find((a) => a.id === selectedAlert);
    if (!alert) return;

    const idEvidencia = alert.idEvidencia;

    const res = await actualizarEvidenciaFallo(idEvidencia, {
      observaciones: observation,
    });

    if (!res.error) {
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alert.id
            ? { ...a, observations: [...a.observations, observation] }
            : a
        )
      );
    }

    setObservation("");
    setSelectedAlert(null);
  }

  // ===========================================================
  // 🔥 4. Marcar Revisado
  // ===========================================================
  async function marcarRevisado(alert: WorkerAlert) {
    const idEvidencia = alert.idEvidencia;

    const res = await actualizarEvidenciaFallo(idEvidencia, {
      estado: false,
    });

    if (!res.error) {
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alert.id ? { ...a, estado: false } : a
        )
      );
    }
  }

  // ===========================================================
  // 🔥 5. Filtrar lista según estado
  // ===========================================================
  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "todos") return true;
    if (filter === "pendientes") return alert.estado === true || alert.estado === null;
    if (filter === "revisados") return alert.estado === false;
    return true;
  });

  // ===========================================================
  // 🔥 UI COMPLETA
  // ===========================================================
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Incumplimientos Detectados</CardTitle>
          <CardDescription>
            Reportes generados automáticamente para este inspector
          </CardDescription>

          {/* 🔥 BOTONES DE FILTRO */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant={filter === "todos" ? "default" : "outline"}
              onClick={() => setFilter("todos")}
            >
              Todos
            </Button>

            <Button
              variant={filter === "pendientes" ? "default" : "outline"}
              onClick={() => setFilter("pendientes")}
            >
              Pendientes
            </Button>

            <Button
              variant={filter === "revisados" ? "default" : "outline"}
              onClick={() => setFilter("revisados")}
            >
              Revisados
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {filteredAlerts.length === 0 && (
            <div className="py-12 text-center">
              <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-2">No se encontraron resultados</p>
            </div>
          )}

          <div className="space-y-6">
            {filteredAlerts.map((alert) => (
              <Card
                key={alert.id}
                className={`border ${alert.severity === "high"
                  ? "border-destructive"
                  : alert.severity === "medium"
                    ? "border-yellow-500"
                    : "border-border"
                  }`}
              >
                <CardContent className="p-4">
                  <div className="grid gap-4 md:grid-cols-[300px_1fr]">

                    {/* FOTO */}
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={alert.photoUrl}
                        className="w-full h-full object-cover"
                      />

                      <Badge
                        className="absolute top-2 right-2"
                        variant={alert.estado === false ? "default" : "secondary"}
                      >
                        {alert.estado === false ? "Revisado" : "Pendiente"}
                      </Badge>
                    </div>

                    {/* INFO */}
                    <div className="space-y-4">

                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{alert.workerName}</h4>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Camera className="w-3 h-3" />
                            {alert.camera} • {alert.zoneName}
                          </div>
                        </div>

                        <div className="text-xs flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                      </div>

                      {/* DETECCIONES */}
                      <div className="grid grid-cols-2 gap-3">
                        {alert.detections.map((det) => {
                          const Icon = det.icon;
                          return (
                            <div key={det.item} className={`flex items-center gap-3 p-2 rounded-lg border ${det.detected
                              ? "bg-green-50 border-green-400"
                              : "bg-red-50 border-red-400"
                              }`}>
                              <Icon className={`w-4 h-4 ${det.detected ? "text-green-600" : "text-red-600"}`} />

                              <div>
                                <p className="text-sm font-medium">{det.item}</p>
                                <p className={`text-xs ${det.detected ? "text-green-600" : "text-red-600"}`}>
                                  {det.detected ? "Detectado" : "No detectado"}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {/* 🔥 OBSERVACIÓN GUARDADA */}
                      {alert.observacionesTexto && (
                        <div className="mt-3 p-3 border rounded-lg bg-blue-50">
                          <p className="text-sm font-semibold text-blue-900">Observación del inspector:</p>
                          <p className="text-sm text-blue-800">{alert.observacionesTexto}</p>
                        </div>
                      )}


                      {/* ACCIONES */}
                      <div className="flex gap-2 mt-2">
                        {/* 🔥 Solo mostrar si NO tiene observación */}
                        {!alert.observacionesTexto && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setSelectedAlert(alert.id)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Observación
                          </Button>
                        )}


                        {(alert.estado === null || alert.estado === true) && (
                          <Button
                            size="sm"
                            className="flex-1 bg-blue-900 hover:bg-blue-900 text-white"
                            onClick={() => marcarRevisado(alert)}
                          >
                            Marcar Revisado
                          </Button>
                        )}
                      </div>

                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DIALOG OBSERVACIÓN */}
      <Dialog
        open={selectedAlert !== null}
        onOpenChange={() => setSelectedAlert(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Observación</DialogTitle>
            <DialogDescription>
              Añade un comentario sobre esta alerta.
            </DialogDescription>
          </DialogHeader>

          {alerts.find((a) => a.id === selectedAlert) && (
            <div className="space-y-4">
              <Textarea
                rows={4}
                placeholder="Describe la observación..."
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAlert(null)}>
              Cancelar
            </Button>
            <Button onClick={agregarObservacion} disabled={!observation.trim()}>
              Guardar Observación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
