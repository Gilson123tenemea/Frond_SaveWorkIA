import { BASE_URL } from "./api"

const WEBCAM_BASE_URL = `${BASE_URL}/webcam`

/**
 * Obtiene URL del stream de una cámara específica por ID
 * @param {number} idCamara - ID de la cámara en la BD
 * @returns {string} URL del stream
 */
export function obtenerUrlStreamWebcamIA(idCamara) {
  if (!idCamara) {
    console.error("❌ ID de cámara no proporcionado")
    return null
  }
  return `${WEBCAM_BASE_URL}/stream/${idCamara}`
}

/**
 * Inicia stream de webcam IA
 * @param {number} idCamara - ID de la cámara en la BD
 * @returns {Promise<Response|null>}
 */
export async function iniciarStreamWebcamIA(idCamara) {
  try {
    if (!idCamara) {
      throw new Error("ID de cámara es requerido")
    }

    const streamUrl = obtenerUrlStreamWebcamIA(idCamara)
    const response = await fetch(streamUrl, { method: "GET" })

    if (!response.ok) {
      console.error(`❌ Error en stream (${response.status}):`, response.statusText)
      return null
    }

    return response
  } catch (err) {
    console.error("❌ Error conectando webcam IA:", err)
    return null
  }
}

/**
 * Detiene el stream de una cámara específica
 * @param {number} idCamara - ID de la cámara en la BD
 * @returns {Promise<Object|null>}
 */
export async function detenerStreamWebcamIA(idCamara) {
  try {
    if (!idCamara) {
      throw new Error("ID de cámara es requerido")
    }

    const response = await fetch(`${WEBCAM_BASE_URL}/stop/${idCamara}`, {
      method: "GET"
    })

    if (!response.ok) {
      console.error(`❌ Error deteniendo stream (${response.status})`)
      return null
    }

    const data = await response.json()
    return data
  } catch (err) {
    console.error("❌ Error deteniendo webcam IA:", err)
    return null
  }
}

/**
 * Lista todas las cámaras activas
 * @returns {Promise<Object|null>}
 */
export async function listarCamarasActivas() {
  try {
    const response = await fetch(`${WEBCAM_BASE_URL}/camaras-activas`, {
      method: "GET"
    })

    if (!response.ok) {
      console.error(`❌ Error listando cámaras (${response.status})`)
      return null
    }

    const data = await response.json()
    return data
  } catch (err) {
    console.error("❌ Error obteniendo cámaras activas:", err)
    return null
  }
}