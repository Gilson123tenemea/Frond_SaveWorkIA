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
  id_Zona: number;
  nombreZona: string;
  latitud: string;
  longitud: string;
  total_camaras?: number;
  total_trabajadores?: number;
  epps?: string[]; // 👈 EPP activos de la zona
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
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current || zones.length === 0) return;

    // =====================================================
    // 🗺️ Crear mapa SOLO UNA VEZ
    // =====================================================
    if (!mapInstanceRef.current) {
      const avgLat =
        zones.reduce((s, z) => s + parseFloat(z.latitud), 0) / zones.length;
      const avgLng =
        zones.reduce((s, z) => s + parseFloat(z.longitud), 0) / zones.length;

      const map = L.map(mapRef.current).setView([avgLat, avgLng], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    // =====================================================
    // 🧹 Limpiar capas anteriores (NO el mapa)
    // =====================================================
    layerGroupRef.current?.clearLayers();

    // =====================================================
    // 📍 Dibujar zonas
    // =====================================================
    zones.forEach((zone) => {
      const lat = parseFloat(zone.latitud);
      const lng = parseFloat(zone.longitud);

      // 🟦 Polígono zona
      const square = generarCuadrado(lat, lng);
      L.polygon(square, {
        color: "#2563eb",
        fillColor: "#3b82f6",
        fillOpacity: 0.15,
        weight: 2,
      }).addTo(layerGroupRef.current!);

      // =====================================================
      // 📦 Popup HTML
      // =====================================================
      const eppHtml =
        zone.epps && zone.epps.length > 0
          ? zone.epps
              .map((e) => `<div style="margin:4px 0;">✔ ${e}</div>`)
              .join("")
          : `<span style="color:#64748b;">Sin EPP configurado</span>`;

      const popupContent = `
        <div style="font-family: system-ui; padding:12px; min-width:230px;">
          <strong style="font-size:15px;">${zone.nombreZona}</strong>
          <hr style="margin:8px 0;" />

          <div style="margin-bottom:8px;">
            📷 Cámaras: <b>${zone.total_camaras ?? 0}</b>
          </div>

          <div style="margin-bottom:8px;">
            👷 Trabajadores: <b>${zone.total_trabajadores ?? 0}</b>
          </div>

          <div style="margin-top:8px;">
            <b>EPP requeridos:</b>
            <div style="margin-top:6px;">${eppHtml}</div>
          </div>
        </div>
      `;

      // =====================================================
      // 🔵 Marker
      // =====================================================
      const marker = L.circleMarker([lat, lng], {
        radius: 12,
        fillColor: "#2563eb",
        fillOpacity: 0.9,
        color: "#ffffff",
        weight: 3,
      })
        .addTo(layerGroupRef.current!)
        .bindPopup(popupContent)
        // 🏷️ Tooltip nombre
        .bindTooltip(zone.nombreZona, {
          direction: "top",
          offset: [0, -14],
          opacity: 0.95,
        });

      // ✨ Hover efecto
      marker.on("mouseover", () => {
        marker.setStyle({ radius: 15, fillOpacity: 1 });
      });

      marker.on("mouseout", () => {
        marker.setStyle({ radius: 12, fillOpacity: 0.9 });
      });
    });
  }, [zones]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[500px] rounded-lg border shadow-sm overflow-hidden"
    />
  );
}
