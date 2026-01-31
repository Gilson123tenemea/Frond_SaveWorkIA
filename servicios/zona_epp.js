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
  const url = getSecureUrl('/zonas-epp');
  console.log('🚨 DEBUG crearEppZona - URL:', url);
  
  // VERSIÓN CORREGIDA
  const bodyData = {
    id_zona: idZona,        // ← CON GUÍÓN BAJO
    tipo_epp: tipoEpp,      // ← CON GUÍÓN BAJO
    obligatorio: obligatorio,
  };
  
  console.log('📦 DEBUG crearEppZona - Body Data (CORREGIDO):', bodyData);
  console.log('📦 DEBUG crearEppZona - Body JSON:', JSON.stringify(bodyData));
  
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(bodyData),
    });

    console.log('🔍 DEBUG crearEppZona - Status:', resp.status);
    console.log('🔍 DEBUG crearEppZona - Status Text:', resp.statusText);
    
    const responseText = await resp.text();
    console.log('🔍 DEBUG crearEppZona - Response:', responseText);
    
    if (!resp.ok) {
      throw new Error(`Error ${resp.status}: ${responseText}`);
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error('❌ ERROR crearEppZona:', error);
    throw error;
  }
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