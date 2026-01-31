// En el servicio de zonas-epp
import { BASE_URL } from "./api";

// Función que siempre devuelve URL segura
const getSecureUrl = (path) => {
  const secureBase = BASE_URL.startsWith('http:') 
    ? BASE_URL.replace('http:', 'https:') 
    : BASE_URL;
  return `${secureBase}${path}`;
};

export async function obtenerEppPorZona(idZona) {
  const resp = await fetch(getSecureUrl(`/zonas-epp/${idZona}`));
  if (!resp.ok) throw new Error("Error al obtener EPP");
  return await resp.json();
}

export async function crearEppZona({ idZona, tipoEpp, obligatorio = true }) {
  const resp = await fetch(getSecureUrl('/zonas-epp'), {
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
  const resp = await fetch(getSecureUrl(`/zonas-epp/zona/${idZona}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      epps: epps,
    }),
  });

  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.detail || "Error al actualizar EPP");
  }

  return await resp.json();
}