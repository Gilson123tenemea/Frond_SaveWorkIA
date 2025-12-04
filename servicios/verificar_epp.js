// app/servicios/verificar_epp.js
/**
 * Servicio para verificar EPP y crear registros de asistencia
 * Orquesta: obtener frame → analizar EPP → crear registros + evidencias
 */

import { BASE_URL } from "./api";

/**
 * Verifica EPP del trabajador capturando frame de la cámara
 * Crea automáticamente RegistroAsistencia y EvidenciaFallo si es necesario
 *
 * @param {number} idCamara - ID de la cámara
 * @param {string} codigoTrabajador - Código del trabajador (ej: "TRA-001")
 * @param {Object} [datosTrabajador] - Datos del trabajador (opcional)
 * @returns {Promise<Object>} Resultado del análisis con detecciones y evidencia
 *
 * Retorna:
 * {
 *   status: "✅ CUMPLE EPP" | "❌ NO CUMPLE EPP",
 *   mensaje: string,
 *   registro: {
 *     id_registro: number,
 *     trabajador: { id, codigo, nombre },
 *     cumple_epp: boolean,
 *     fecha_hora: string (ISO)
 *   },
 *   detecciones: {
 *     casco: boolean,
 *     chaleco: boolean,
 *     guantes: boolean,
 *     botas: boolean,
 *     lentes: boolean
 *   },
 *   evidencia: {
 *     tiene_fallo: boolean,
 *     foto_url: string | null,
 *     detalle: string
 *   }
 * }
 */
export async function verificarEPP(idCamara, codigoTrabajador, datosTrabajador = null) {
  try {
    if (!idCamara || !codigoTrabajador) {
      throw new Error("ID de cámara y código de trabajador son requeridos");
    }

    console.log(`🔍 Verificando EPP: Cámara ${idCamara}, Código ${codigoTrabajador}`);

    // Construir URL solo con parámetros básicos
    const url = new URL(`${BASE_URL}/registros-asistencia/verificar-epp/${idCamara}`);
    url.searchParams.append("codigo_trabajador", codigoTrabajador);

    console.log(`📤 Enviando objeto trabajador completo...`);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosTrabajador),  // 🔥 Enviar objeto completo del trabajador
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.detail || `Error verificando EPP (${response.status})`
      );
    }

    const data = await response.json();
    console.log(`📊 Resultado EPP:`, data);

    return data;
  } catch (error) {
    console.error("❌ Error verificando EPP:", error.message);
    return { error: error.message };
  }
}

/**
 * Convierte respuesta del backend a formato más legible para UI
 * @param {Object} respuestaBackend - Respuesta de verificarEPP()
 * @returns {Object} Datos formateados para mostrar en UI
 */
export function formatearResultadoEPP(respuestaBackend) {
  if (respuestaBackend.error) {
    return {
      cumpleEpp: false,
      mensaje: respuestaBackend.error,
      detecciones: null,
      fotoUrl: null,
      detallesFallo: null,
    };
  }

  const cumpleEpp = respuestaBackend.status.includes("✅");

  // Generar lista de detalles si no cumple
  let detallesFallo = [];
  if (!cumpleEpp) {
    const det = respuestaBackend.detecciones;
    if (!det.casco) detallesFallo.push("Falta casco");
    if (!det.chaleco) detallesFallo.push("Falta chaleco");
    if (!det.guantes) detallesFallo.push("Falta guantes");
    if (!det.botas) detallesFallo.push("Falta botas");
    if (!det.lentes) detallesFallo.push("Falta lentes");
  }

  return {
    cumpleEpp,
    mensaje: respuestaBackend.mensaje,
    detecciones: respuestaBackend.detecciones,
    fotoUrl: respuestaBackend.evidencia?.foto_url || null,
    detallesFallo,
    idRegistro: respuestaBackend.registro?.id_registro,
    trabajador: respuestaBackend.registro?.trabajador,
  };
}

/**
 * Obtiene URL completa para ver foto de evidencia (si existe)
 * @param {string} fotoUrl - Ruta relativa guardada en BD
 * @returns {string} URL completa para descargar/ver foto
 */
export function obtenerUrlFoto(fotoUrl) {
  if (!fotoUrl || fotoUrl === "pendiente") return null;
  // Ajusta según cómo sirvas archivos estáticos
  return `${BASE_URL}/${fotoUrl}`;
}