"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface Zone {
  nombreZona: string;
  latitud: string;
  longitud: string;
  total_camaras: number;
  total_trabajadores: number;
}

interface ZonesMapCoreProps {
  zones: Zone[];
}

const generarCuadrado = (lat: number, lng: number, dist = 40) => {
  const delta = dist / 111320;
  return [
    [lat + delta, lng - delta],
    [lat + delta, lng + delta],
    [lat - delta, lng + delta],
    [lat - delta, lng - delta],
  ] as [number, number][];
};

export default function ZonesMapCore({ zones }: ZonesMapCoreProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || zones.length === 0) return;

    // ⛔ NO volver a crear el mapa si ya existe
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // ➤ Eliminar zonas duplicadas por nombreZona
    const uniqueZones = zones.reduce((acc: Zone[], current) => {
      const exists = acc.find((z) => z.nombreZona === current.nombreZona);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    // ➤ Calcular centro
    const avgLat =
      uniqueZones.reduce((sum: number, z) => sum + parseFloat(z.latitud), 0) /
      uniqueZones.length;
    const avgLng =
      uniqueZones.reduce((sum: number, z) => sum + parseFloat(z.longitud), 0) /
      uniqueZones.length;

    // ✅ Crear mapa
    const map = L.map(mapRef.current).setView([avgLat, avgLng], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    mapInstanceRef.current = map;

    // ➤ Renderizar zonas (primero los cuadrados, luego los marcadores)
    uniqueZones.forEach((zone) => {
      const lat = parseFloat(zone.latitud);
      const lng = parseFloat(zone.longitud);

      // 1️⃣ Dibujar el cuadrado PRIMERO (abajo en el z-index)
      const square = generarCuadrado(lat, lng);
      const polygon = L.polygon(square, {
        color: "#2563eb",
        fillColor: "#3b82f6",
        fillOpacity: 0.15,
        weight: 2,
      }).addTo(map);

      const popupContent = `
        <div style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 12px;
          min-width: 200px;
        ">
          <div style="
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e2e8f0;
          ">
            <strong style="
              font-size: 15px;
              color: #0f172a;
              font-weight: 600;
            ">${zone.nombreZona}</strong>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 13px; color: #64748b;">📷 Cámaras</span>
              <span style="font-size: 15px; color: #0f172a; font-weight: 600;">${zone.total_camaras}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 13px; color: #64748b;">👷 Trabajadores</span>
              <span style="font-size: 15px; color: #0f172a; font-weight: 600;">${zone.total_trabajadores}</span>
            </div>
          </div>
        </div>
      `;

      // ✨ Tooltip simple y limpio
      const tooltipContent = `
        <div style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 4px 10px;
          color: #1e293b;
        ">${zone.nombreZona}</div>
      `;

      // 2️⃣ Dibujar el marcador DESPUÉS (arriba en el z-index)
      const marker = L.circleMarker([lat, lng], {
        radius: 12,
        fillColor: "#2563eb",
        fillOpacity: 0.9,
        color: "#ffffff",
        weight: 3,
      })
        .addTo(map)
        .bindPopup(popupContent, {
          maxWidth: 250,
          closeButton: true,
          autoClose: true,
        })
        .bindTooltip(tooltipContent, {
          permanent: false,
          direction: "top",
          offset: [0, -15],
          opacity: 0.95,
        });

      // 3️⃣ Eventos mejorados
      marker.on("mouseover", () => {
        marker.setStyle({
          radius: 14,
          fillOpacity: 1,
        });
      });

      marker.on("mouseout", () => {
        marker.setStyle({
          radius: 12,
          fillOpacity: 0.9,
        });
      });

      // NO agregar popup al polígono para evitar duplicados
      // Solo el marcador tiene popup
    });

    // Cleanup cuando el componente se desmonta
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [zones]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[500px] rounded-lg border shadow-sm overflow-hidden"
    />
  );
}