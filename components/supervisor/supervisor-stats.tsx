"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle2, AlertTriangle, Camera as CameraIcon } from "lucide-react";
import { obtenerZonasYCamarasPorEmpresa } from "@/servicios/monitorio";
import { getUser } from "@/lib/auth";

export function SupervisorStats() {
  const [loading, setLoading] = useState(true);
  const [monitoreo, setMonitoreo] = useState<any>(null);

  // 🔥 Estado para mostrar video por cámara
  const [cameraVideoOpen, setCameraVideoOpen] = useState<number | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const user = getUser();
        if (!user || !user.id_empresa_supervisor) {
          console.error("❌ No hay empresa asociada al supervisor");
          return;
        }

        const data = await obtenerZonasYCamarasPorEmpresa(user.id_empresa_supervisor);
        setMonitoreo(data);
      } catch (err) {
        console.error("❌ Error cargando monitoreo:", err);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  if (loading) return <p>Cargando información...</p>;
  if (!monitoreo) return <p>No hay datos de monitoreo disponibles.</p>;

  return (
    <div className="space-y-8">

      {/* ╔════════════════════════════╗ */}
      {/*  🔹 TARJETAS DE ESTADÍSTICAS  */}
      {/* ╚════════════════════════════╝ */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Trabajadores Activos</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground mt-1">De 32 registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">EPP Completo</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">26</div>
            <p className="text-xs text-muted-foreground mt-1">92.8% cumplimiento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">2</div>
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
              {monitoreo.totalCamarasActivas}/{monitoreo.totalCamaras}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Estado general</p>
          </CardContent>
        </Card>
      </div>

      {/* ╔════════════════════════════╗ */}
      {/*   🔹 ZONAS Y SUS CÁMARAS     */}
      {/* ╚════════════════════════════╝ */}
      <div className="space-y-6">
        {monitoreo?.zonas?.map((zona: any, index: number) => (
          <Card key={`zona_${index}_${zona.id_Zona}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CameraIcon className="w-5 h-5" />
                Zona: {zona.nombreZona}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {zona.camaras.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay cámaras en esta zona.</p>
              ) : (
                <ul className="space-y-4">
                  {zona.camaras.map((cam: any) => (
                    <li
                      key={`cam_${zona.id_Zona}_${cam.id_camara}`}
                      className="border p-3 rounded-md space-y-2"
                    >

                      {/* 🔥 Información de la cámara */}
                      <div className="flex justify-between items-center gap-4">
                        <div>
                          <strong>{cam.codigo}</strong> — {cam.tipo}
                          <p className="text-xs text-muted-foreground">
                            {cam.ipAddress}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm px-2 py-1 rounded ${cam.estado === "activa"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-700"
                              }`}
                          >
                            {cam.estado}
                          </span>

                          {/* 🔘 BOTÓN PARA VER VIDEO */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setCameraVideoOpen((prev) =>
                                prev === cam.id_camara ? null : cam.id_camara
                              )
                            }
                            disabled={cam.estado !== "activa"}
                          >
                            {cameraVideoOpen === cam.id_camara
                              ? "Ocultar video"
                              : "Ver video"}
                          </Button>
                        </div>
                      </div>

                      {/* 🔴 VIDEO STREAM DEBAJO */}
                      {cameraVideoOpen === cam.id_camara && (
                        <div className="mt-2">
                          <div className="aspect-video bg-black rounded-md overflow-hidden">
                            <img
                              src={cam.ipAddress}
                              alt={`Video de ${cam.codigo}`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Transmisión en vivo desde la cámara
                          </p>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
