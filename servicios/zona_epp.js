// En zona_epp.js - AGREGAR LOGS DE DEPURACIÓN
import { BASE_URL } from "./api";

// Función que siempre devuelve URL segura
const getSecureUrl = (path) => {
  const secureBase = BASE_URL.startsWith('http:') 
    ? BASE_URL.replace('http:', 'https:') 
    : BASE_URL;
  
  // LOG IMPORTANTE: Ver qué URL estamos usando
  console.log('📡 DEBUG getSecureUrl:');
  console.log('  - BASE_URL original:', BASE_URL);
  console.log('  - secureBase:', secureBase);
  console.log('  - path:', path);
  console.log('  - URL final:', `${secureBase}${path}`);
  
  return `${secureBase}${path}`;
};

export async function crearEppZona({ idZona, tipoEpp, obligatorio = true }) {
  // LOG para ver qué está pasando exactamente
  console.log('🚨 DEBUG crearEppZona llamado con:');
  console.log('  - idZona:', idZona);
  console.log('  - tipoEpp:', tipoEpp);
  
  const url = getSecureUrl('/zonas-epp');
  console.log('  - URL a usar:', url);
  
  const resp = await fetch(url, {
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
    console.error('❌ Error en crearEppZona:', err);
    throw new Error(err.detail || "Error al crear EPP");
  }

  return await resp.json();
}

export async function obtenerEppPorZona(idZona) {
  // LOG también para obtener
  console.log('📥 DEBUG obtenerEppPorZona llamado con idZona:', idZona);
  const url = getSecureUrl(`/zonas-epp/${idZona}`);
  console.log('  - URL a usar:', url);
  
  const resp = await fetch(url);
  if (!resp.ok) throw new Error("Error al obtener EPP");
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