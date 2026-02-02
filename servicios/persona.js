import { BASE_URL } from "./api";

const PERSONA_URL = `${BASE_URL}/personas`;

// ============================
// 📌 Obtener persona por ID
// ============================
export async function obtenerPersona(idPersona) {
  const res = await fetch(`${PERSONA_URL}/${idPersona}`);

  if (!res.ok) {
    const err = await res.text();
    console.error("❌ Error obtenerPersona:", err);
    throw new Error("Error obteniendo persona");
  }

  return res.json();
}

// ============================
// 📌 Actualizar FOTO de persona
// ============================
export async function actualizarFotoPersona(idPersona, fotoBase64) {
  try {

    const res = await fetch(`${PERSONA_URL}/foto/${idPersona}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fotoBase64 }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("❌ Error actualizarFotoPersona:", err);
      throw new Error("Error al actualizar la foto");
    }

    return res.json();
  } catch (error) {
    console.error("❌ actualizarFotoPersona ERROR:", error);
    throw error;
  }
}
  
// ============================
// 🔍 Buscar persona por correo
// ============================
export async function buscarPersonaPorCorreo(correo) {
  try {
    const res = await fetch(
      `${PERSONA_URL}/buscar-por-correo?correo=${encodeURIComponent(correo)}`
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Persona no encontrada con ese correo");
    }

    return res.json();
  } catch (error) {
    console.error("❌ Error buscarPersonaPorCorreo:", error);
    throw error;
  }
}