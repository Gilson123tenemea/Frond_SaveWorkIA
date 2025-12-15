import { BASE_URL } from "./api";

export async function obtenerEppPorZona(idZona) {
  const resp = await fetch(`${BASE_URL}/zonas-epp/${idZona}`);
  if (!resp.ok) throw new Error("Error al obtener EPP");
  return await resp.json();
}

export async function crearEppZona({ idZona, tipoEpp, obligatorio = true }) {
  const resp = await fetch(`${BASE_URL}/zonas-epp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id_zona: idZona,
      tipo_epp: tipoEpp,
      obligatorio,
    }),
  });

  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.detail || "Error al crear EPP");
  }

  return await resp.json();
}

export async function actualizarEppZona(idZona, epps) {
  const resp = await fetch(`${BASE_URL}/zonas-epp/zona/${idZona}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      epps: epps, // 👈 List[str] EXACTO como espera FastAPI
    }),
  });

  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.detail || "Error al actualizar EPP");
  }

  return await resp.json();
}
