import { BASE_URL } from "./api"

export async function obtenerDashboardInspector(idZona) {
  const res = await fetch(`${BASE_URL}/dashboard-inspector/${idZona}`)

  if (!res.ok) {
    throw new Error("Error obteniendo dashboard del inspector")
  }

  return res.json()
}
