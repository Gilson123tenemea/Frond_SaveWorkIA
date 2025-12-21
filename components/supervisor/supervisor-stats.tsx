"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle2, AlertTriangle, Camera as CameraIcon } from "lucide-react";
import { obtenerZonasYCamarasPorEmpresa } from "@/servicios/monitorio";
import { obtenerDashboardSupervisor } from "@/servicios/dashboardSupervisor";
import { getUser } from "@/lib/auth";

export function SupervisorStats() {
  const [loading, setLoading] = useState(true);
  const [monitoreo, setMonitoreo] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [cameraVideoOpen, setCameraVideoOpen] = useState<number | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const user = getUser();
        if (!user || !user.id_empresa_supervisor) {
          console.error("❌ No hay empresa asociada al supervisor");
          return;
        }

        const dataMonitoreo = await obtenerZonasYCamarasPorEmpresa(user.id_empresa_supervisor);
        setMonitoreo(dataMonitoreo);

        const dataStats = await obtenerDashboardSupervisor(user.id_empresa_supervisor);
        setStats(dataStats);

      } catch (err) {
        console.error("❌ Error cargando datos del supervisor:", err);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  if (loading) return <p>Cargando información...</p>;
  if (!monitoreo || !stats) return <p>No hay datos disponibles.</p>;

  return (
    <div className="space-y-8">

      {/* 🔹 TARJETAS ESTADÍSTICAS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Trabajadores Activos</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.trabajadores_activos}</div>
            <p className="text-xs text-muted-foreground mt-1">
              De {stats.trabajadores_registrados} registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">EPP Completo</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.epp_completo}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.porcentaje_epp}% cumplimiento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.alertas_activas}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cámaras Activas</CardTitle>
            <CameraIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.camaras_activas}/{stats.camaras_totales}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Estado general</p>
          </CardContent>
        </Card>

      </div>

      {/* 🔹 ZONAS EN GRID ORDENADO */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Zonas de Monitoreo</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {monitoreo?.zonas?.map((zona: any, index: number) => (
            <Card key={`zona_${index}_${zona.id_Zona}`} className="flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CameraIcon className="w-5 h-5 text-blue-500" />
                  {zona.nombreZona}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1">
                {zona.camaras.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay cámaras</p>
                ) : (
                  <div className="space-y-3">
                    {zona.camaras.map((cam: any) => (
                      <div 
                        key={`cam_${zona.id_Zona}_${cam.id_camara}`} 
                        className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{cam.codigo}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{cam.tipo}</p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium ${
                              cam.estado === "activa"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {cam.estado}
                          </span>
                        </div>

                        {cameraVideoOpen === cam.id_camara && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="aspect-video bg-black rounded-md overflow-hidden">
                              <img 
                                src={cam.ipAddress} 
                                alt={`Video de ${cam.codigo}`} 
                                className="w-full h-full object-contain" 
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Transmisión en vivo
                            </p>
                          </div>
                        )}

                        <Button
                          size="sm"
                          variant={cameraVideoOpen === cam.id_camara ? "default" : "outline"}
                          onClick={() =>
                            setCameraVideoOpen((prev) =>
                              prev === cam.id_camara ? null : cam.id_camara
                            )
                          }
                          disabled={cam.estado !== "activa"}
                          className="w-full mt-2"
                        >
                          {cameraVideoOpen === cam.id_camara ? "Ocultar transmisión" : "Ver transmisión"}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}