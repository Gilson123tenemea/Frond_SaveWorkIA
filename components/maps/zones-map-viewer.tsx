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

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const avgLat = zones.reduce((a, z) => a + parseFloat(z.latitud), 0) / zones.length;
    const avgLng = zones.reduce((a, z) => a + parseFloat(z.longitud), 0) / zones.length;

    const map = L.map(mapRef.current).setView([avgLat, avgLng], 15);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    zones.forEach((zone) => {
      const lat = parseFloat(zone.latitud);
      const lng = parseFloat(zone.longitud);

      L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: "#22c55e",
        fillOpacity: 0.8,
        color: "#fff",
        weight: 2,
      })
        .addTo(map)
        .bindPopup(`<strong>${zone.nombreZona}</strong>`);

      const square = generarCuadrado(lat, lng);
      L.polygon(square as any, {
        color: "#0ea5e9",
        fillColor: "#0ea5e9",
        fillOpacity: 0.15,
        weight: 2,
      })
        .addTo(map)
        .bindTooltip(zone.nombreZona);
    });
  }, [zones]);

  return <div ref={mapRef} className="w-full h-[500px] rounded-lg border shadow-sm" />;
}
