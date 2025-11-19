"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin,
  FileText,
  AlertTriangle,
  Shield,
  LogOut,
  Settings,
  Users,
  Camera,
} from "lucide-react";

import { logout, getUser } from "@/lib/auth";
import { ReportsList } from "./reports-list";
import { InspectorStats } from "./inspector-stats";
import { WorkerAlertsList } from "./worker-alerts-list";

import { obtenerZonasPorInspector } from "../../servicios/inspector";
import { NotificationsPopover } from "./notifications-popover";

// 🎯 Tipo local actualizado
type ZonaAsignada = {
  id_Zona: number;
  nombreZona: string;
  latitud: string;
  longitud: string;
  fecha_asignacion: string;
  total_trabajadores: number;
  total_camaras: number;
};

export function InspectorDashboard() {
  const user = getUser();

  if (!user) return <div>Cargando...</div>;

  const inspectorId = user.id_inspector ?? user.id ?? null;

  const [activeTab, setActiveTab] = useState("overview");
  const [assignedZones, setAssignedZones] = useState<ZonaAsignada[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!inspectorId) return;

    async function loadZones() {
      try {
        const data = await obtenerZonasPorInspector(inspectorId);
        setAssignedZones(data);
      } catch (error) {
        console.error("❌ Error cargando zonas:", error);
      } finally {
        setLoading(false);
      }
    }

    loadZones();
  }, [inspectorId]);

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* LOGO */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SaveWorkIA</h1>
                <p className="text-xs text-muted-foreground">Panel de Inspector</p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3">
              <NotificationsPopover unreadCount={5} />
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-3 pl-3 border-l">
                <div className="text-right">
                  <p className="text-sm font-medium">{user.nombre}</p>
                  <p className="text-xs text-muted-foreground">Inspector de Seguridad</p>
                </div>

                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.nombre?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* TABS */}
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="gap-2">
              <MapPin className="w-4 h-4" />
              Mi Zona
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="w-4 h-4" />
              Reportes
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Alertas
            </TabsTrigger>
          </TabsList>

          {/* ----------- TAB MI ZONA ----------- */}
          <TabsContent value="overview" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Mi Zona Asignada</h2>
              <p className="text-muted-foreground">Información de la zona bajo tu supervisión</p>
            </div>

            {/* CUADROS DE ARRIBA */}
            <InspectorStats zoneId={assignedZones[0]?.id_Zona ?? null} />

            {/* ZONA PRINCIPAL */}
            <div className="grid gap-6 lg:grid-cols-2">
              {loading ? (
                <Card className="lg:col-span-2">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Cargando zonas...</p>
                  </CardContent>
                </Card>
              ) : assignedZones.length > 0 ? (
                <Card className="lg:col-span-2 shadow-md">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <CardTitle>{assignedZones[0].nombreZona}</CardTitle>
                        <CardDescription>Zona asignada</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Latitud</p>
                        <p className="text-sm font-medium">{assignedZones[0].latitud}</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Longitud</p>
                        <p className="text-sm font-medium">{assignedZones[0].longitud}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">
                          Trabajadores: {assignedZones[0].total_trabajadores}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Camera className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">
                          Cámaras: {assignedZones[0].total_camaras}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground pt-2 border-t">
                      Asignado el: <strong>{assignedZones[0].fecha_asignacion}</strong>
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="lg:col-span-2 shadow-lg border bg-gradient-to-br from-gray-100 to-gray-50">
                  <CardContent className="py-14 text-center">
                    <MapPin className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700">
                      No tienes zonas asignadas
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mt-2">
                      Si crees que se trata de un error, comunícate con tu supervisor.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* REPORTES */}
          <TabsContent value="reports">
            <ReportsList />
          </TabsContent>

          {/* ALERTAS */}
          <TabsContent value="alerts">
            <WorkerAlertsList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
