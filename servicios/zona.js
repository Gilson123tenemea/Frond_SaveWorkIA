// src/servicios/zona.js
import { BASE_URL } from "./api";

const ZONA_URL = `${BASE_URL}/zonas`;

// ============================
// 📌 Crear una nueva zona
// ============================
export async function crearZona(zonaData) {
  try {
    const response = await fetch(`${ZONA_URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zonaData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al crear la zona");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en crearZona:", error);
    throw error;
  }
}

// ============================
// 📌 Listar todas las zonas
// ============================
export async function listarZonas() {
  try {
    const response = await fetch(`${ZONA_URL}/`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al obtener las zonas");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en listarZonas:", error);
    throw error;
  }
}

// ============================
// 📌 Listar zonas por empresa
// ============================
export async function listarZonasPorEmpresa(empresaId) {
  try {
    const response = await fetch(`${ZONA_URL}/empresa/${empresaId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al obtener las zonas de la empresa");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en listarZonasPorEmpresa:", error);
    throw error;
  }
}

// ============================
// 📌 Listar zonas por administrador
// ============================
export async function listarZonasPorAdministrador(administradorId) {
  try {
    const response = await fetch(`${ZONA_URL}/administrador/${administradorId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al obtener las zonas del administrador");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en listarZonasPorAdministrador:", error);
    throw error;
  }
}

// ============================
// 📌 Obtener zona por ID
// ============================
export async function obtenerZonaPorId(id) {
  try {
    const response = await fetch(`${ZONA_URL}/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Zona no encontrada");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en obtenerZonaPorId:", error);
    throw error;
  }
}

// ============================
// 📌 Actualizar zona
// ============================
export async function actualizarZona(id, zonaData) {
  try {
    const response = await fetch(`${ZONA_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zonaData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al actualizar la zona");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en actualizarZona:", error);
    throw error;
  }
}

// ============================
// 📌 Eliminar zona (lógica)
// ============================
export async function eliminarZona(id) {
  try {
    const response = await fetch(`${ZONA_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la zona");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en eliminarZona:", error);
    throw error;
  }
}

// ============================
// ⚠️ Eliminar zona permanente
// ============================
export async function eliminarZonaPermanente(id) {
  try {
    const response = await fetch(`${ZONA_URL}/${id}/permanente`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la zona permanentemente");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en eliminarZonaPermanente:", error);
    throw error;
  }
}
