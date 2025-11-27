
import { BASE_URL } from "./api"

const CAMARA_IA_URL = `${BASE_URL}/ia/camaras`

// =======================================
// 📌 Obtener STREAM de IA de la cámara por ID de zona
// =======================================
export async function iniciarStreamCamaraIA(idCamara) {
  try {
    const response = await fetch(`${CAMARA_IA_URL}/${idCamara}/stream`, {
      method: "GET",
    })
    if (!response.ok) return null
    return response
  } catch {
    return null
  }
}
