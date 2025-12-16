// src/servicios/reporte_inspector_incumplimiento.js

import { BASE_URL } from "./api";

/**
 * Obtener incumplimientos filtrados por inspector
 * 
 * @param {number} idInspector - ID del inspector (obligatorio)
 * @param {string|null} fechaDesde - Fecha inicial (YYYY-MM-DD)
 * @param {string|null} fechaHasta - Fecha final (YYYY-MM-DD)
 * @param {number|null} idZona - ID de zona opcional
 * @returns {Promise<any[]>}
 */
// src/servicios/reporte_inspector_incumplimiento.js

export async function obtenerIncumplimientosPorInspector(
  idInspector,
  fechaDesde = null,
  fechaHasta = null,
  idZona = null
) {
  try {
    const params = new URLSearchParams();

    if (!idInspector) {
      throw new Error("❌ idInspector es obligatorio");
    }

    params.append("id_inspector", idInspector);

    if (fechaDesde) params.append("fecha_desde", fechaDesde);
    if (fechaHasta) params.append("fecha_hasta", fechaHasta);
    if (idZona) params.append("id_zona", idZona);

    const url = `${BASE_URL}/reportes/inspectores/?${params.toString()}`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Error en la API: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Error obteniendo incumplimientos del inspector:", error);
    throw error;
  }
}


export async function obtenerIncumplimientosPorCedula(cedula) {
  try {
    if (!cedula) {
      throw new Error("❌ La cédula es obligatoria");
    }

    const params = new URLSearchParams();
    params.append("cedula", cedula);

    const url = `${BASE_URL}/reportes/inspectores/trabajador?${params.toString()}`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`❌ Error en la API: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Error obteniendo incumplimientos por cédula:", error);
    throw error;
  }
}

export async function obtenerZonasPorInspector(idInspector) {
  try {
    if (!idInspector) {
      throw new Error("❌ idInspector es obligatorio");
    }

    const params = new URLSearchParams();
    params.append("id_inspector", idInspector);

    const url = `${BASE_URL}/reportes/inspectores/zonas?${params.toString()}`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`❌ Error en la API al obtener zonas: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Error obteniendo zonas del inspector:", error);
    throw error;  
  }
}