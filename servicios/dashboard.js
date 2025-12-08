import { BASE_URL } from "./api"

export async function obtenerDashboardOverview() {
  const res = await fetch(`${BASE_URL}/dashboard/overview`)
  return res.json()
}
