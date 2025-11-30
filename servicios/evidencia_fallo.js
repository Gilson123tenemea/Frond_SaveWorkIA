import { BASE_URL } from "./api";

/**
 * Guarda evidencia cuando el trabajador NO cumple EPP
 * @param {object} evidencia
 *  {
 *    foto_url,
 *    detalle_fallo,
 *    id_registro
 *  }
 */
export async function guardarEvidenciaFallo(evidencia) {
  try {
    const res = await fetch(`${BASE_URL}/evidencias-fallo/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evidencia),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "❌ Error al guardar evidencia");
    }

    return await res.json();
  } catch (err) {
    console.error("❌ guardarEvidenciaFallo:", err.message);
    return { error: err.message };
  }
}
