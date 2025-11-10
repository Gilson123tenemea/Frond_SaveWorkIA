// src/services/login.js
import { BASE_URL } from "./api";

const ADMIN_URL = `${BASE_URL}/administradores`;

// --- Login de administrador ---
export async function loginAdministrador(correo, contrasena) {
  try {
    const response = await fetch(`${ADMIN_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo, contrasena }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al iniciar sesión");
    }

    const data = await response.json();
    localStorage.setItem("adminInfo", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("❌ Error en loginAdministrador:", error);
    throw error;
  }
}
