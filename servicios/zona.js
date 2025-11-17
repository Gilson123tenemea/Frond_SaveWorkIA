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
    const response = await fetch(`${ZONA_URL}/`, { method: "GET" });

    if (!response.ok) throw new Error("Error al obtener las zonas");

    const data = await response.json();

    return data.map((zona) => {
      const id = zona.id_Zona ?? zona.id_zona ?? zona.id;

      return {
        id_zona: id,
        id_Zona: id,

        nombreZona: zona.nombreZona ?? zona.nombre ?? "",
        latitud: zona.latitud ?? "",
        longitud: zona.longitud ?? "",
        id_empresa_zona:
          zona.id_empresa_zona ?? zona.id_empresa ?? zona.empresa_id ?? null,
        borrado: zona.borrado ?? true,
      };
    });
  } catch (error) {
    console.error("❌ Error en listarZonas:", error);
    return [];
  }
}

// ============================
// 📌 Listar zonas por empresa (CORREGIDO)
// ============================
export async function listarZonasPorEmpresa(empresaId) {
  try {
    const response = await fetch(`${ZONA_URL}/empresa/${empresaId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al obtener las zonas de la empresa");
    }

    const data = await response.json();

    return data.map((zona) => {
      const id = zona.id_Zona ?? zona.id_zona ?? zona.id;

      return {
        id_zona: id,   // 👈 normalizado
        id_Zona: id,   // 👈 normalizado
        nombreZona: zona.nombreZona ?? zona.nombre ?? "",
        latitud: zona.latitud ?? "",
        longitud: zona.longitud ?? "",
        borrado: zona.borrado ?? true,
        id_empresa_zona: zona.id_empresa_zona ?? zona.id_empresa ?? null,
        id_administrador_zona:
          zona.id_administrador_zona ?? zona.administrador_id ?? null,
      };
    });
  } catch (error) {
    console.error("❌ Error en listarZonasPorEmpresa:", error);
    return [];
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
