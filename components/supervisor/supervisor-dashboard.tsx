"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Users, Camera, MapPin, Shield, LogOut, Settings,
  Eye, UserCheck, UserCog, Map, Play
} from "lucide-react";

import { logout, getUser } from "@/lib/auth";
import { WorkersTable } from "./workers-table";
import { ZonesGrid } from "./zones-grid";
import { LiveDetections } from "./live-detections";
import { SupervisorStats } from "./supervisor-stats";
import { InspectorsTable } from "./inspectors-table";
import { SupervisorProfile } from "./supervisor-profile"; // ✅ corregido
import { ZoneAssignmentsTable } from "./zone-assignments-table";
import { ZonesMapViewer } from "@/components/maps/zones-map-viewer";

export function SupervisorDashboard() {

  /* 🔥 Evitar hydration mismatch */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* 🔥 Obtener usuario */
  const user = mounted ? getUser() : null;

  /* 🔥 Tabs */
  const [activeTab, setActiveTab] = useState("overview");

  /* 🔥 ID empresa */
  const companyId = user?.id_empresa_supervisor ?? null;

  /* 🔥 Perfil modal */
  const [openProfile, setOpenProfile] = useState(false);

  if (!mounted) return null;

  /* ✅ Función para abrir ventana de detección */
  const openDetectionWindow = () => {
    const width = 600;
    const height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
      "/detection-window",
      "DetectionWindow",
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=no,resizable=no,status=no`
    );
  };

  return (
    <div className="min-h-screen bg-background">

      {/* HEADER */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">

            {/* Logo y título */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SaveWorkIA</h1>
                <p className="text-xs text-muted-foreground">Panel de Supervisor</p>
              </div>
            </div>

            {/* Perfil, nombre, logout */}
            <div className="flex items-center gap-3">

              {/* ⚙️ Botón Perfil */}
              <Button variant="ghost" size="icon" onClick={() => setOpenProfile(true)}>
                <Settings className="w-5 h-5" />
              </Button>

              {/* Avatar + nombre */}
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

              {/* Salir */}
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

          {/* NAV TABS */}
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview"><Eye className="w-4 h-4" /> Monitoreo</TabsTrigger>
            <TabsTrigger value="map"><Map className="w-4 h-4" /> Mapa</TabsTrigger>
            <TabsTrigger value="inspectors"><UserCheck className="w-4 h-4" /> Inspectores</TabsTrigger>
            <TabsTrigger value="assignments"><UserCog className="w-4 h-4" /> Asignaciones</TabsTrigger>
            <TabsTrigger value="workers"><Users className="w-4 h-4" /> Trabajadores</TabsTrigger>
            <TabsTrigger value="zones"><MapPin className="w-4 h-4" /> Zonas</TabsTrigger>
            <TabsTrigger value="detections"><Camera className="w-4 h-4" /> Detecciones IA</TabsTrigger>
          </TabsList>

          {/* TAB MONITOREO */}
          <TabsContent value="overview"><SupervisorStats /></TabsContent>
          <TabsContent value="inspectors"><InspectorsTable /></TabsContent>
          <TabsContent value="assignments"><ZoneAssignmentsTable /></TabsContent>
          <TabsContent value="workers"><WorkersTable /></TabsContent>
          <TabsContent value="zones"><ZonesGrid /></TabsContent>

          {/* ✅ TAB Detección IA + BOTÓN FUNCIONAL */}
          <TabsContent value="detections" className="space-y-4">
            <Button
              onClick={openDetectionWindow}
              size="lg"
              className="gap-2 w-full sm:w-auto rounded-xl shadow-md hover:shadow-xl transition-all"
            >
              <Play className="w-5 h-5" />
              Iniciar Detección
            </Button>

            {/* contenido */}
            <LiveDetections />
          </TabsContent>

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

        </Tabs>
      </main>

      {/* MODAL PERFIL */}
      <SupervisorProfile
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        idSupervisor={user?.id_supervisor}
      />

    </div>
  );
}
