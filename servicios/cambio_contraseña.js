// servicios/cambio_contraseña.js

import { BASE_URL } from "./api";

const AUTH_URL = `${BASE_URL}/auth`;

// ============================
// 📧 PASO 1: Solicitar token
// ============================
export async function solicitarCambioContrasena(correo, id_persona) {
  try {
    const response = await fetch(
      `${AUTH_URL}/solicitar-cambio-contrasena`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo,
          id_persona,
        }),
      }
    );

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {}

      const error = new Error(
        errorData.detail || "Error al solicitar el cambio de contraseña"
      );
      error.statusCode = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en solicitarCambioContrasena:", error);
    throw error;
  }
}

// ============================
// 🔐 PASO 2: Confirmar cambio
// ============================
export async function confirmarCambioContrasena(
  token,
  nuevaContraseña,
  id_persona
) {
  try {
    const response = await fetch(
      `${AUTH_URL}/confirmar-cambio-contrasena`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          nuevaContraseña,
          id_persona,
        }),
      }
    );

    // ⭐ IMPORTANTE: Primero leer el body antes de lanzar el error
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(
        data.detail || "Token inválido o expirado"
      );
      error.statusCode = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {

    throw error;
  }
}