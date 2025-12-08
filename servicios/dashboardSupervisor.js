import { BASE_URL } from "./api"

export async function obtenerDashboardSupervisor(idEmpresa) {
  const res = await fetch(`${BASE_URL}/dashboard-supervisor/${idEmpresa}`)
  if (!res.ok) throw new Error("Error obteniendo dashboard del supervisor")
  return res.json()
}
