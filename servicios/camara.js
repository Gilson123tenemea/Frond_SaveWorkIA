import { BASE_URL } from "./api";

const CAMARA_URL = `${BASE_URL}/camaras`;

// ============================
// 📌 Crear una nueva cámara
// ============================
export async function crearCamara(camaraData) {
  try {
    const response = await fetch(`${CAMARA_URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(camaraData),
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {}

      throw new Error(errorData.detail || "Error al registrar la cámara");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en crearCamara:", error);
    throw error;
  }
}

// ============================
// 📌 Listar todas las cámaras
// ============================
export async function listarCamaras() {
  try {
    const response = await fetch(`${CAMARA_URL}/`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al obtener las cámaras");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en listarCamaras:", error);
    throw error;
  }
}

// ============================
// 📌 Listar cámaras por zona
// ============================
export async function listarCamarasPorZona(zonaId) {
  try {
    const response = await fetch(`${CAMARA_URL}/zona/${zonaId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al obtener las cámaras de la zona");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en listarCamarasPorZona:", error);
    throw error;
  }
}

// ============================
// 📌 Listar cámaras por administrador
// ============================
export async function listarCamarasPorAdministrador(administradorId) {
  try {
    const response = await fetch(
      `${CAMARA_URL}/administrador/${administradorId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener las cámaras del administrador");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en listarCamarasPorAdministrador:", error);
    throw error;
  }
}

// ============================
// 📌 Obtener cámara por ID
// ============================
export async function obtenerCamaraPorId(id) {
  try {
    const response = await fetch(`${CAMARA_URL}/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Cámara no encontrada");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en obtenerCamaraPorId:", error);
    throw error;
  }
}

// ============================
// 📌 Actualizar cámara (solo estado)
// ============================
export async function actualizarCamara(id, camaraData) {
  try {
    const response = await fetch(`${CAMARA_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(camaraData),
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {}

      throw new Error(errorData.detail || "Error al actualizar la cámara");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en actualizarCamara:", error);
    throw error;
  }
}

// ============================
// 📌 Eliminar cámara (lógica)
// ============================
export async function eliminarCamara(id) {
  try {
    const response = await fetch(`${CAMARA_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {}

      throw new Error(errorData.detail || "Error al eliminar la cámara");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en eliminarCamara:", error);
    throw error;
  }
}

// ============================
// ⚠️ Eliminar cámara permanentemente
// ============================
export async function eliminarCamaraPermanente(id) {
  try {
    const response = await fetch(`${CAMARA_URL}/${id}/permanente`, {
      method: "DELETE",
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {}

      throw new Error(
        errorData.detail || "Error al eliminar la cámara permanentemente"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en eliminarCamaraPermanente:", error);
    throw error;
  }
}
