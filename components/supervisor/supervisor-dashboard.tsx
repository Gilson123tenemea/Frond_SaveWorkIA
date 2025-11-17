"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Users, Camera, MapPin, Shield, LogOut, Settings,
  Eye, UserCheck, UserCog, Map,
} from "lucide-react";

import { logout, getUser } from "@/lib/auth";
import { WorkersTable } from "./workers-table";
import { ZonesGrid } from "./zones-grid";
import { LiveDetections } from "./live-detections";
import { SupervisorStats } from "./supervisor-stats";
import { InspectorsTable } from "./inspectors-table";
import { ZoneAssignmentsTable } from "./zone-assignments-table";
import { ZonesMapViewer } from "@/components/maps/zones-map-viewer";

export function SupervisorDashboard() {

  /* 🔥 Hook 1 - Solución al hydration mismatch */
  const [mounted, setMounted] = useState(false);

  /* 🔥 Hook 2 - Activar montaje */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ❌ AÚN NO PONGAS RETURN AQUÍ */
  /* PRIMERO deben declararse TODOS los hooks */

  /* 🔥 Hook 3 - Obtener usuario */
  const user = mounted ? getUser() : null;

  /* 🔥 Hook 4 - Tabs */
  const [activeTab, setActiveTab] = useState("overview");

  /* 🔥 ID de empresa del supervisor */
  const companyId = user?.id_empresa_supervisor ?? null;

  /* 🔥 AHORA sí podemos retornar */
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      
      {/* HEADER */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SaveWorkIA</h1>
                <p className="text-xs text-muted-foreground">Panel de Supervisor</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-3 pl-3 border-l">
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">Supervisor</p>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.charAt(0)}
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

      {/* CONTENIDO */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

          {/* TABS */}
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview"><Eye className="w-4 h-4" /> Monitoreo</TabsTrigger>
            <TabsTrigger value="map"><Map className="w-4 h-4" /> Mapa</TabsTrigger>
            <TabsTrigger value="inspectors"><UserCheck className="w-4 h-4" /> Inspectores</TabsTrigger>
            <TabsTrigger value="assignments"><UserCog className="w-4 h-4" /> Asignaciones</TabsTrigger>
            <TabsTrigger value="workers"><Users className="w-4 h-4" /> Trabajadores</TabsTrigger>
            <TabsTrigger value="zones"><MapPin className="w-4 h-4" /> Zonas</TabsTrigger>
            <TabsTrigger value="detections"><Camera className="w-4 h-4" /> Detecciones IA</TabsTrigger>
          </TabsList>

          {/* TAB MAPA */}
          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5" /> Mapa de Zonas
                </CardTitle>
                <CardDescription>Visualiza todas las zonas de la empresa</CardDescription>
              </CardHeader>

              <CardContent>
                {companyId ? (
                  <ZonesMapViewer companyId={companyId} />
                ) : (
                  <div className="w-full h-[500px] rounded bg-muted flex items-center justify-center">
                    <p>No hay empresa asignada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview"><SupervisorStats /></TabsContent>
          <TabsContent value="inspectors"><InspectorsTable /></TabsContent>
          <TabsContent value="assignments"><ZoneAssignmentsTable /></TabsContent>
          <TabsContent value="workers"><WorkersTable /></TabsContent>
          <TabsContent value="zones"><ZonesGrid /></TabsContent>
          <TabsContent value="detections"><LiveDetections /></TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
