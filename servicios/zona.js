import { BASE_URL } from "./api";

const ZONA_URL = `${BASE_URL}/zonas`;

// ============================
// 📌 Crear una nueva zona CON EPPS
// ============================
// ✅ REEMPLAZA: crearZona() anterior
export async function crearZona(zonaData) {
  try {
    // Si viene con EPPs, usar endpoint con-epps
    if (zonaData.epps && zonaData.epps.length > 0) {
      const response = await fetch(`${ZONA_URL}/con-epps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreZona: zonaData.nombreZona,
          latitud: zonaData.latitud,
          longitud: zonaData.longitud,
          id_empresa_zona: zonaData.id_empresa_zona,
          id_administrador_zona: zonaData.id_administrador_zona,
          epps: zonaData.epps, // Array de strings: ['casco', 'guantes', 'gafas']
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al crear la zona con EPPs");
      }

      return await response.json();
    } else {
      // Si NO viene con EPPs, usar endpoint simple
      const response = await fetch(`${ZONA_URL}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreZona: zonaData.nombreZona,
          latitud: zonaData.latitud,
          longitud: zonaData.longitud,
          id_empresa_zona: zonaData.id_empresa_zona,
          id_administrador_zona: zonaData.id_administrador_zona,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al crear la zona");
      }

      return await response.json();
    }
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
// 📌 Obtener UNA ZONA CON DETALLES (nuevo)
// ============================
export async function obtenerZonaPorId(zonaId) {
  try {
    const response = await fetch(`${ZONA_URL}/${zonaId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al obtener la zona");
    }

    const zona = await response.json();

    return {
      id_zona: zona.id_Zona ?? zona.id,
      id_Zona: zona.id_Zona ?? zona.id,

      nombreZona: zona.nombreZona ?? "",
      latitud: zona.latitud ?? "",
      longitud: zona.longitud ?? "",
      id_empresa_zona: zona.id_empresa_zona ?? null,
      id_administrador_zona: zona.id_administrador_zona ?? null,
      borrado: zona.borrado ?? true,

      // ✅ NUEVOS CAMPOS
      total_camaras: zona.total_camaras ?? 0,
      total_trabajadores: zona.total_trabajadores ?? 0,
      
      // ✅ EPPs INCLUIDOS
      epps: zona.epps ?? [],
    };
  } catch (error) {
    console.error("❌ Error en obtenerZonaPorId:", error);
    return null;
  }
}


// ============================
// 📌 Listar zonas por empresa (CON TOTAL_CAMARAS Y TOTAL_TRABAJADORES)
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
        id_zona: id,
        id_Zona: id,

        nombreZona: zona.nombreZona ?? zona.nombre ?? "",
        latitud: zona.latitud ?? "",
        longitud: zona.longitud ?? "",
        borrado: zona.borrado ?? true,

        id_empresa_zona:
          zona.id_empresa_zona ??
          zona.id_empresa ??
          zona.empresa_id ??
          null,

        id_administrador_zona:
          zona.id_administrador_zona ??
          zona.administrador_id ??
          null,

        // ✅ NUEVOS CAMPOS DEL BACKEND
        total_camaras: zona.total_camaras ?? 0,
        total_trabajadores: zona.total_trabajadores ?? 0,

        // ✅ EPPs INCLUIDOS
        epps: zona.epps ?? [],
      };
    });
  } catch (error) {
    console.error("❌ Error en listarZonasPorEmpresa:", error);
    return [];
  }
}


// ============================
// 📌 Listar zonas por administrador (nuevo)
// ============================
export async function listarZonasPorAdministrador(administradorId) {
  try {
    const response = await fetch(`${ZONA_URL}/administrador/${administradorId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al obtener las zonas del administrador");
    }

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
        id_administrador_zona: zona.id_administrador_zona ?? null,
        borrado: zona.borrado ?? true,
      };
    });
  } catch (error) {
    console.error("❌ Error en listarZonasPorAdministrador:", error);
    return [];
  }
}


// ============================
// 📌 Actualizar zona (solo datos de zona, SIN tocar EPPs)
// ============================
export async function actualizarZona(id, zonaData) {
  try {
    const response = await fetch(`${ZONA_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombreZona: zonaData.nombreZona,
        latitud: zonaData.latitud,
        longitud: zonaData.longitud,
        id_empresa_zona: zonaData.id_empresa_zona,
        id_administrador_zona: zonaData.id_administrador_zona,
      }),
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
// 📌 Actualizar zona Y EPPs juntos (NUEVO)
// ============================
// ✅ REEMPLAZA: la necesidad de llamar a zona_epp
export async function actualizarZonaConEpps(id, zonaData) {
  try {
    // zonaData debe tener: nombreZona, latitud, longitud, epps: ['casco', 'guantes', ...]
    const response = await fetch(`${ZONA_URL}/${id}/con-epps`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombreZona: zonaData.nombreZona,
        latitud: zonaData.latitud,
        longitud: zonaData.longitud,
        id_empresa_zona: zonaData.id_empresa_zona,
        id_administrador_zona: zonaData.id_administrador_zona,
        epps: zonaData.epps, // Array: ['casco', 'guantes', 'gafas']
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail || "Error al actualizar la zona con EPPs"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en actualizarZonaConEpps:", error);
    throw error;
  }
}


// ============================
// 📌 Obtener EPPs de una zona (NUEVO)
// ============================
export async function obtenerEppsPorZona(zonaId) {
  try {
    const response = await fetch(`${ZONA_URL}/${zonaId}/epps`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al obtener los EPPs de la zona");
    }

    const epps = await response.json();

    return epps.map((epp) => ({
      id: epp.id ?? 0,
      id_zona: epp.id_zona ?? zonaId,
      tipo_epp: epp.tipo_epp ?? "",
      obligatorio: epp.obligatorio ?? true,
      activo: epp.activo ?? true,
    }));
  } catch (error) {
    console.error("❌ Error en obtenerEppsPorZona:", error);
    return [];
  }
}


// ============================
// 📌 Eliminar Zona (sin errores en consola)
// ============================
export async function eliminarZona(id) {
  try {
    const response = await fetch(`${ZONA_URL}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    // ❌ Si backend envía error
    if (!response.ok) {
      let backendMsg = "Error al eliminar la zona";

      try {
        const errorData = await response.json();
        backendMsg = errorData?.detail || backendMsg;
      } catch {}

      // 👉 No lanzamos error, solo devolvemos un objeto controlado
      return { ok: false, message: backendMsg };
    }

    const data = await response.json();
    return { ok: true, message: data.message || "Zona eliminada" };
  } catch {
    // 👉 error de conexión u otro error inesperado
    return { ok: false, message: "Error de conexión con el servidor" };
  }
}


// ============================
// 📌 Eliminar zona permanentemente
// ============================
export async function eliminarZonaPermanente(id) {
  try {
    const response = await fetch(`${ZONA_URL}/${id}/permanente`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      let backendMsg = "Error al eliminar permanentemente la zona";

      try {
        const errorData = await response.json();
        backendMsg = errorData?.detail || backendMsg;
      } catch {}

      return { ok: false, message: backendMsg };
    }

    const data = await response.json();
    return { ok: true, message: data.message || "Zona eliminada permanentemente" };
  } catch {
    return { ok: false, message: "Error de conexión con el servidor" };
  }
}