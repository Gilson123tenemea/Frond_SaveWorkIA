// src/servicios/monitorio.js
import { BASE_URL } from "./api";

const MONITOREO_URL = `${BASE_URL}/monitoreo`;

// ============================================================
// 📌 Obtener zonas + cámaras por empresa
// ============================================================
export async function obtenerZonasYCamarasPorEmpresa(empresaId) {
  try {
    const response = await fetch(
      `${MONITOREO_URL}/empresa/${empresaId}/zonas-camaras`,
      {
        method: "GET",
      }
    );

    let data = {};
    try {
      data = await response.json();
    } catch (err) {
      console.error("❌ Error al parsear JSON:", err);
    }

    if (!response.ok) {
      throw new Error(data.detail || "Error al obtener datos de monitoreo");
    }

    return data; // retorna el objeto {empresa_id, empresa_nombre, zonas, total_camaras}
  } catch (error) {
    console.error("❌ Error en obtenerZonasYCamarasPorEmpresa:", error);
    throw error;
  }
}
