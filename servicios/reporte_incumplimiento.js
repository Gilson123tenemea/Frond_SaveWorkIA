// src/servicios/reporte_incumplimiento.js

import { BASE_URL } from "./api";

/**
 * Obtiene todos los incumplimientos filtrados por supervisor.
 * 
 * @param {number} idSupervisor - ID del supervisor autenticado.
 * @returns {Promise<Array>} Lista de incumplimientos.
 */
export async function obtenerIncumplimientos(idSupervisor) {
  try {
    const response = await fetch(
      `${BASE_URL}/reportes/incumplimientos?id_supervisor=${idSupervisor}`
    );

    if (!response.ok) {
      throw new Error("Error al obtener los incumplimientos");
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("❌ Error en obtenerIncumplimientos:", error);
    throw error;
  }
}


/**
 * Obtiene el historial de incumplimientos de un trabajador
 * filtrando por cédula, código o ID.
 * 
 * @param {Object} filtros - Objeto con al menos uno de los filtros:
 *                           { cedula, codigo_trabajador, id_trabajador }
 * @returns {Promise<{
 *   estadisticas: {
 *     total: number,
 *     cumple: number,
 *     incumple: number,
 *     tasa: number
 *   },
 *   historial: any[]
 * }>}

 */
export async function obtenerHistorialTrabajador(filtros) {
  try {
    const params = new URLSearchParams();

    if (filtros.cedula) params.append("cedula", filtros.cedula);
    if (filtros.codigo_trabajador) params.append("codigo_trabajador", filtros.codigo_trabajador);
    if (filtros.id_trabajador) params.append("id_trabajador", filtros.id_trabajador);

    const response = await fetch(
      `${BASE_URL}/reportes/incumplimientos/trabajador?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Error al obtener historial del trabajador");
    }

    const data = await response.json();
    return data; // AHORA retorna { estadisticas, historial }

  } catch (error) {
    console.error("❌ Error en obtenerHistorialTrabajador:", error);
    throw error;
  }
}

export async function obtenerInspectores(idEmpresa) {
  try {
    const response = await fetch(
      `${BASE_URL}/reportes/incumplimientos/inspectores?id_empresa=${idEmpresa}`
    );

    if (!response.ok) {
      throw new Error("Error al obtener inspectores");
    }

    const data = await response.json();
    return data; // [{ id, nombre, apellido }]
  } catch (error) {
    console.error("❌ Error en obtenerInspectores:", error);
    throw error;
  }
}

export async function obtenerZonas(idEmpresa, idInspector)
 {
  try {
    const params = new URLSearchParams();
    params.append("id_empresa", idEmpresa);

    if (idInspector) {
      params.append("id_inspector", idInspector);
    }

    const response = await fetch(
      `${BASE_URL}/reportes/incumplimientos/zonas?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Error al obtener zonas");
    }

    const data = await response.json();
    return data; // [{ id, nombre }]
  } catch (error) {
    console.error("❌ Error en obtenerZonas:", error);
    throw error;
  }
}

export async function obtenerDeteccionesFiltradas(filtros) {
  try {
    const params = new URLSearchParams();

    params.append("id_empresa", filtros.id_empresa);

    if (filtros.fecha_desde) params.append("fecha_desde", filtros.fecha_desde);
    if (filtros.fecha_hasta) params.append("fecha_hasta", filtros.fecha_hasta);
    if (filtros.id_inspector) params.append("id_inspector", filtros.id_inspector);
    if (filtros.id_zona) params.append("id_zona", filtros.id_zona);

    const response = await fetch(
      `${BASE_URL}/reportes/incumplimientos/detecciones?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Error al obtener detecciones filtradas");
    }

    const data = await response.json();
    return data; // array de IncumplimientoResponse

  } catch (error) {
    console.error("❌ Error en obtenerDeteccionesFiltradas:", error);
    throw error;
  }
}
