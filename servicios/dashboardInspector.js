import { BASE_URL } from "./api"

/**
 * Obtiene el dashboard del inspector
 * @param {number} idInspector - ID del inspector logueado
 * @returns {Promise<Object>} Datos del dashboard
 */
export async function obtenerDashboardInspector(idInspector) {
  const res = await fetch(`${BASE_URL}/dashboard-inspector/${idInspector}`)

  if (!res.ok) {
    throw new Error("Error obteniendo dashboard del inspector")
  }

  return res.json()
}