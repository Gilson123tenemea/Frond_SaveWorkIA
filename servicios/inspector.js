import { BASE_URL } from "./api";

const INSPECTOR_URL = `${BASE_URL}/inspectores`;

// ============================
// 📌 Registrar un nuevo inspector
// ============================
export async function registrarInspector(datosInspector) {
  try {
    const response = await fetch(`${INSPECTOR_URL}/registrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosInspector),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al registrar el inspector");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en registrarInspector:", error);
    throw error;
  }
}

// ============================
// 📌 Listar inspectores activos
// ============================
export async function listarInspectores() {
  try {
    const response = await fetch(`${INSPECTOR_URL}/`, {
      method: "GET",
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Respuesta no OK listarInspectores:", errText);
      throw new Error("Error al obtener la lista de inspectores");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en listarInspectores:", error);
    throw error;
  }
}

// ============================
// 📌 Editar inspector existente
// ============================
export async function editarInspector(idInspector, datosInspector) {
  try {
    const response = await fetch(`${INSPECTOR_URL}/${idInspector}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosInspector),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al editar el inspector");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en editarInspector:", error);
    throw error;
  }
}

// ============================
// 📌 Eliminar inspector (borrado lógico)
// ============================
export async function eliminarInspector(idInspector) {
  try {
    const response = await fetch(`${INSPECTOR_URL}/${idInspector}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al eliminar el inspector");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en eliminarInspector:", error);
    throw error;
  }
}
