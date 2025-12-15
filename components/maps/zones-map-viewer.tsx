"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

import { listarZonasPorEmpresa } from "@/servicios/zona";
import { obtenerEppPorZona } from "@/servicios/zona_epp";

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
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // 1️⃣ Zonas base
        const data = await listarZonasPorEmpresa(companyId);

        // 2️⃣ Agregar EPP a cada zona
        const zonasConEpp = await Promise.all(
          data.map(async (z: any) => {
            try {
              const eppsResp = await obtenerEppPorZona(z.id_Zona);

              return {
                ...z,
                epps: eppsResp
                  .filter((e: any) => e.activo)
                  .map((e: any) => e.tipo_epp),
              };
            } catch {
              return {
                ...z,
                epps: [],
              };
            }
          })
        );

        setZones(zonasConEpp);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [companyId]);

  if (loading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-muted rounded-lg">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return <DynamicZonesMap zones={zones} />;
}
