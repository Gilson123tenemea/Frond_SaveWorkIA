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
