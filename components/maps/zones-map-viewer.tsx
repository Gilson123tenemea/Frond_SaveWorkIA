"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { listarZonasPorEmpresa } from "@/servicios/zona";

// ✅ Carga dinámica del mapa solo en cliente
const DynamicZonesMap = dynamic(() => import("./zones-map-core"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center bg-muted rounded-lg">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  ),
});

interface ZonesMapViewerProps {
  companyId: number;
}

export function ZonesMapViewer({ companyId }: ZonesMapViewerProps) {
  const [mounted, setMounted] = useState(false);
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await listarZonasPorEmpresa(companyId);
        setZones(data);
      } catch (error) {
        console.error("Error cargando zonas:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [companyId]);

  if (!mounted || loading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-muted rounded-lg">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (zones.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-muted rounded-lg border">
        <p className="text-muted-foreground">No hay zonas disponibles para mostrar</p>
      </div>
    );
  }

  return <DynamicZonesMap zones={zones} />;
}