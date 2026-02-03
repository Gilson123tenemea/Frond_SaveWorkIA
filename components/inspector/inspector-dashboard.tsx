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
 
import { obtenerZonasPorInspector } from "@/servicios/inspector";
import { NotificationsPopover } from "./notifications-popover";
import { InspectorProfile } from "./inspector-profile";
import Image from "next/image";
import logo from "@/components/imagenes/logo_web.png";
 
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
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
 
  const [activeTab, setActiveTab] = useState("overview");
  const [assignedZones, setAssignedZones] = useState<ZonaAsignada[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
 
  useEffect(() => {
    setMounted(true);
    const u = getUser();
    setUser(u);
  }, []);
 
  useEffect(() => {
    if (!mounted || !user) return;
 
    const inspectorId = user.id_inspector ?? user.id;
 
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
  }, [mounted, user]);
 
  if (!mounted) {
    return <div className="min-h-screen bg-background"></div>;
  }
 
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        Cargando...
      </div>
    );
  }
 
  const inspectorId = user.id_inspector ?? user.id ?? null;
 
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
 
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src={logo}
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold">SaveWorkIA</h1>
                <p className="text-xs text-muted-foreground">Panel de Inspector</p>
              </div>
            </div>
 
            <div className="flex items-center gap-3">
              {inspectorId && (
                <NotificationsPopover idInspector={inspectorId} />
              )}
 
              <Button variant="ghost" size="icon" onClick={() => setProfileOpen(true)}>
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
                <LogOut className="w-4 h-4 mr-2" /> Salir
              </Button>
            </div>
          </div>
        </div>
      </header>
 
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="gap-2">
              <MapPin className="w-4 h-4" /> Mi Zona
            </TabsTrigger>
 
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="w-4 h-4" /> Reportes
            </TabsTrigger>
 
            <TabsTrigger value="alerts" className="gap-2">
              <AlertTriangle className="w-4 h-4" /> Alertas
            </TabsTrigger>
          </TabsList>
 
          <TabsContent value="overview" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Mis Zonas Asignadas</h2>
              <p className="text-muted-foreground">
                Información de las zonas bajo tu supervisión
              </p>
            </div>
 
            {/* ✅ CAMBIO AQUÍ: Pasar inspectorId en lugar de zoneId */}
            <InspectorStats inspectorId={inspectorId} />
 
            <div className="grid gap-6 lg:grid-cols-2">
              {loading ? (
                <Card className="lg:col-span-2">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Cargando zonas...</p>
                  </CardContent>
                </Card>
              ) : assignedZones.length === 0 ? (
                <Card className="lg:col-span-2">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No tienes zonas asignadas.</p>
                  </CardContent>
                </Card>
              ) : (
                assignedZones.map((zona) => (
                  <Card key={zona.id_Zona} className="lg:col-span-2 shadow-md">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-success" />
                        </div>
                        <div>
                          <CardTitle>{zona.nombreZona}</CardTitle>
                          <CardDescription>Zona asignada</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
 
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Latitud</p>
                          <p className="font-medium">{zona.latitud}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Longitud</p>
                          <p className="font-medium">{zona.longitud}</p>
                        </div>
                      </div>
 
                      <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          <p className="font-medium">
                            {zona.total_trabajadores} trabajadores
                          </p>
                        </div>
 
                        <div className="flex items-center gap-2">
                          <Camera className="w-5 h-5 text-primary" />
                          <p className="font-medium">
                            {zona.total_camaras} cámaras
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
 
 
          <TabsContent value="reports">
            <ReportsList />
          </TabsContent>
 
          <TabsContent value="alerts">
            <WorkerAlertsList />
          </TabsContent>
        </Tabs>
      </main>
 
      <InspectorProfile
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        idInspector={inspectorId}
      />
    </div>
  );
}
 