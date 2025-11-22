"use client";

import { useEffect, useRef, useState } from "react";
import { listarZonasPorEmpresa } from "@/servicios/zona";

// Leaflet solo se carga en cliente
let L: any = null;
if (typeof window !== "undefined") {
  L = require("leaflet");

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png",
  });
}

export function ZonesMapViewer({ companyId }: { companyId: number }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [zones, setZones] = useState<any[]>([]);

  const generarCuadrado = (lat: number, lng: number, dist = 40) => {
    const delta = dist / 111320;
    return [
      [lat + delta, lng - delta],
      [lat + delta, lng + delta],
      [lat - delta, lng + delta],
      [lat - delta, lng - delta],
    ];
  };

  useEffect(() => {
    const load = async () => {
      const data = await listarZonasPorEmpresa(companyId);
      setZones(data);
    };
    load();
  }, [companyId]);

  useEffect(() => {
    if (!mapRef.current || !L || zones.length === 0) return;

    // ➤ Resetear el mapa si existe
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // ➤ Calcular centro
    const avgLat =
      zones.reduce((sum, z) => sum + parseFloat(z.latitud), 0) / zones.length;
    const avgLng =
      zones.reduce((sum, z) => sum + parseFloat(z.longitud), 0) / zones.length;

    const map = L.map(mapRef.current).setView([avgLat, avgLng], 15);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    // ➤ Renderizar zonas
    zones.forEach((zone) => {
      const lat = parseFloat(zone.latitud);
      const lng = parseFloat(zone.longitud);

      const popupContent = `
        <div style="font-family: Arial; padding: 5px 0;">
          <strong style="font-size: 16px;">📍 ${zone.nombreZona}</strong><br/>
          <span style="font-size: 14px;">📷 Cámaras: <b>${zone.total_camaras}</b></span><br/>
          <span style="font-size: 14px;">👷 Trabajadores: <b>${zone.total_trabajadores}</b></span>
        </div>
      `;

      const tooltipContent = `
        <strong>${zone.nombreZona}</strong><br/>
        Cámaras: ${zone.total_camaras} | Trabajadores: ${zone.total_trabajadores}
      `;

      // Marcador circular
      const marker = L.circleMarker([lat, lng], {
        radius: 9,
        fillColor: "#2563eb",
        fillOpacity: 0.9,
        color: "#ffffff",
        weight: 2,
      })
        .addTo(map)
        .bindPopup(popupContent)
        .bindTooltip(tooltipContent, {
          permanent: false,
          direction: "top",
          offset: [0, -8],
        });

      // 🔵 Mostrar popup al hacer clic
      marker.on("click", () => {
        marker.openPopup();
      });


      // Cuadrado delimitador
      const square = generarCuadrado(lat, lng);
      L.polygon(square as any, {
        color: "#2563eb",
        fillColor: "#3b82f6",
        fillOpacity: 0.2,
        weight: 2,
      }).addTo(map);
    });
  }, [zones]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[500px] rounded-lg border shadow-sm"
    />
  );
}
