import { BASE_URL } from "./api";

const SUPERVISOR_URL = `${BASE_URL}/supervisores`;

// ============================
// 📌 Registrar un nuevo supervisor
// ============================
export async function registrarSupervisor(datosSupervisor) {
  try {
    const response = await fetch(`${SUPERVISOR_URL}/registrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosSupervisor),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al registrar el supervisor");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en registrarSupervisor:", error);
    throw error;
  }
}

// ============================
// 📌 Listar supervisores activos
// ============================
export async function listarSupervisores() {
  try {
    const response = await fetch(`${SUPERVISOR_URL}/listar`, {
      method: "GET",
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Respuesta no OK listarSupervisores:", errText);
      throw new Error("Error al obtener la lista de supervisores");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en listarSupervisores:", error);
    throw error;
  }
}

// ============================
// 📌 Eliminar supervisor (borrado lógico)
// ============================
export async function eliminarSupervisor(idSupervisor) {
  try {
    const response = await fetch(`${SUPERVISOR_URL}/eliminar/${idSupervisor}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al eliminar el supervisor");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en eliminarSupervisor:", error);
    throw error;
  }
}

// ============================
// 📌 Editar supervisor existente
// ============================
export async function editarSupervisor(idSupervisor, datosSupervisor) {
  try {
    const response = await fetch(`${SUPERVISOR_URL}/editar/${idSupervisor}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosSupervisor),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al editar el supervisor");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en editarSupervisor:", error);
    throw error;
  }
}
