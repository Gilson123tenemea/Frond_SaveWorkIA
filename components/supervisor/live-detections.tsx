"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import { obtenerIncumplimientos } from "@/servicios/reporte_incumplimiento";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  HardHat,
  Shield,
  Glasses,
  Shirt,
  AlertTriangle,
  CheckCircle2,
  Camera,
  Clock,
  UserCheck,
} from "lucide-react";

const ICON_MAP: any = {
  casco: HardHat,
  chaleco: Shirt,
  botas: Shield,
  gafas: Glasses,
};

export function LiveDetections() {
  const [grouped, setGrouped] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const user = getUser();
        if (!user || !user.id_supervisor) return;

        const data = await obtenerIncumplimientos(user.id_supervisor);

        const transformado = data.map((item: any, index: number) => {
          const detalle = item.evidencia.detalle.toLowerCase();

          const detecciones = [
            { item: "Casco", key: "casco" },
            { item: "Chaleco", key: "chaleco" },
            { item: "Botas", key: "botas" },
            { item: "Gafas", key: "gafas" },
          ].map(det => {
            const detected = !detalle.includes(det.key);
            const Icon = ICON_MAP[det.key];
            return {
              item: det.item,
              detected,
              icon: Icon,
            };
          });

          let fails = detecciones.filter(d => !d.detected).length;
          let severity = fails >= 2 ? "high" : fails === 1 ? "medium" : "safe";

          return {
            id: index + 1,
            timestamp: new Date(item.fecha_registro).toLocaleString(),
            worker: `${item.trabajador.nombre} ${item.trabajador.apellido}`,
            camera: item.camara.codigo,
            zone: item.camara.zona,
            inspector: item.inspector.nombre
              ? `${item.inspector.nombre} ${item.inspector.apellido}`
              : "Sin inspector asignado",
            detections: detecciones,
            image: item.evidencia.foto_url,
            severity,
          };
        });

        // AGRUPAR POR ZONA
        const groupedByZone: any = {};

        transformado.forEach(item => {
          if (!groupedByZone[item.zone]) {
            groupedByZone[item.zone] = {
              inspector: item.inspector,
              registros: [],
            };
          }
          groupedByZone[item.zone].registros.push(item);
        });

        setGrouped(groupedByZone);
      } catch (err) {
        console.error("Error cargando incumplimientos:", err);
      }
      setLoading(false);
    }

    cargar();
  }, []);

  if (loading) return <p className="text-center">Cargando incumplimientos...</p>;

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([zona, data]: any) => (
        <Card key={zona}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Zona: {zona}
                </CardTitle>

                <CardDescription className="flex items-center gap-2 mt-2">
                  <UserCheck className="w-4 h-4" />
                  Inspector:{" "}
                  <span className="font-medium text-foreground">{data.inspector}</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {data.registros.map((detection: any) => (
                <Card
                  key={detection.id}
                  className={`${
                    detection.severity === "high"
                      ? "border-destructive"
                      : detection.severity === "medium"
                        ? "border-yellow-500"
                        : "border-border"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="grid gap-4 md:grid-cols-[300px_1fr]">
                      {/* IMG */}
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                        <img
                          src={detection.image}
                          alt="Evidencia"
                          className="w-full h-full object-cover"
                        />

                        <div className="absolute top-2 right-2">
                          <Badge
                            variant={
                              detection.severity === "high"
                                ? "destructive"
                                : detection.severity === "medium"
                                  ? "outline"
                                  : "default"
                            }
                          >
                            {detection.severity === "high" ? (
                              <>
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Alto Riesgo
                              </>
                            ) : detection.severity === "medium" ? (
                              <>
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Riesgo Medio
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Seguro
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>

                      {/* DETALLES */}
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{detection.worker}</h4>

                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Camera className="w-3 h-3" /> {detection.camera}
                              </span>
                              <span>•</span>
                              <span>{zona}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {detection.timestamp}
                          </div>
                        </div>

                        {/* LISTA DE EPP */}
                        <div className="grid grid-cols-2 gap-3">
                          {detection.detections.map((item: any) => {
                            const Icon = item.icon;
                            return (
                              <div
                                key={item.item}
                                className={`flex items-center gap-3 p-2 rounded-lg border ${
                                  item.detected
                                    ? "bg-success/5 border-success/20"
                                    : "bg-destructive/5 border-destructive/20"
                                }`}
                              >
                                <div
                                  className={`p-1.5 rounded ${
                                    item.detected ? "bg-success/10" : "bg-destructive/10"
                                  }`}
                                >
                                  <Icon
                                    className={`w-4 h-4 ${
                                      item.detected ? "text-success" : "text-destructive"
                                    }`}
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{item.item}</p>
                                  <p
                                    className={`text-xs ${
                                      item.detected ? "text-success" : "text-destructive"
                                    }`}
                                  >
                                    {item.detected ? "Detectado" : "No detectado"}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            Ver Historial
                          </Button>

                          {detection.severity !== "safe" && (
                            <Button size="sm" className="flex-1">
                              Notificar Trabajador
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
      ))}
    </div>
  );
}
