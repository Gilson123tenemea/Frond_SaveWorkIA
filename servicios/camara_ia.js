import { BASE_URL } from "./api"

const WEBCAM_STREAM_URL = `${BASE_URL}/webcam/stream`

export async function iniciarStreamWebcamIA() {
  try {
    const response = await fetch(WEBCAM_STREAM_URL, { method: "GET" })
    if (!response.ok) return null
    return response
  } catch (err) {
    console.error("Error conectando webcam IA:", err)
    return null
  }
}

export function obtenerUrlStreamWebcamIA() {
  return WEBCAM_STREAM_URL
}
