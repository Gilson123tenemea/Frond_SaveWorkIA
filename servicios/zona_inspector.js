// src/servicios/zona_inspector.js

import { BASE_URL } from "./api";

const ZONA_INSPECTOR_URL = `${BASE_URL}/inspector_zonas`;

/* ===========================================================
   📌 Crear una asignación Inspector ↔ Zona
   (Solo envías id_inspector_inspectorzona e id_zona_inspectorzona)
=========================================================== */
export async function crearAsignacionInspectorZona(data) {
  try {
    const response = await fetch(`${ZONA_INSPECTOR_URL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Error al crear la asignación");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en crearAsignacionInspectorZona:", error);
    throw error;
  }
}

/* ===========================================================
   📌 Listar todas las asignaciones activas (borrado = true)
=========================================================== */
export async function listarAsignaciones() {
  try {
    const response = await fetch(`${ZONA_INSPECTOR_URL}/`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al obtener las asignaciones");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en listarAsignaciones:", error);
    return [];
  }
}

/* ===========================================================
   📌 Obtener asignación por ID
=========================================================== */
export async function obtenerAsignacionPorId(id) {
  try {
    const response = await fetch(`${ZONA_INSPECTOR_URL}/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Asignación no encontrada");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en obtenerAsignacionPorId:", error);
    throw error;
  }
}

/* ===========================================================
   📌 Actualizar asignación
=========================================================== */
export async function actualizarAsignacion(id, data) {
  try {
    const response = await fetch(`${ZONA_INSPECTOR_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Error al actualizar la asignación");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en actualizarAsignacion:", error);
    throw error;
  }
}

/* ===========================================================
   📌 Borrado lógico (cambia borrado=true → false)
=========================================================== */
export async function eliminarAsignacion(id) {
  try {
    const response = await fetch(`${ZONA_INSPECTOR_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la asignación");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en eliminarAsignacion:", error);
    throw error;
  }
}

export async function listarAsignacionesPorEmpresa(idEmpresa) {
  try {
    const response = await fetch(`${ZONA_INSPECTOR_URL}/empresa/${idEmpresa}`);

    if (!response.ok) {
      throw new Error("Error al obtener asignaciones por empresa");
    }

    const data = await response.json();

    return data.map((item) => ({
      id_inspector_zona: item.id_inspector_zona,
      fecha_asignacion: item.fecha_asignacion,

      // 🔥🔥🔥 EL VALOR QUE FALTABA 🔥🔥🔥
      inspector_id: item.inspector?.id_inspector ?? "",

      inspector_nombre: item.inspector?.nombre ?? "",
      inspector_apellido: item.inspector?.apellido ?? "",
      inspector_cedula: item.inspector?.cedula ?? "",

      zona_nombre: item.zona?.nombreZona ?? "",
      zona_id: item.zona?.id_zona ?? "",

      borrado: item.borrado ?? true
    }));

  } catch (error) {
    console.error("❌ Error en listarAsignacionesPorEmpresa:", error);
    return [];
  }
}


/* ===========================================================
   📌 Zonas disponibles para asignar a un inspector
   (Zonas SIN inspector asignado)
=========================================================== */
export async function listarZonasDisponibles(empresaId, inspectorId) {
  try {
    const response = await fetch(
      `${ZONA_INSPECTOR_URL}/zonas-disponibles/${empresaId}/${inspectorId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener zonas disponibles");
    }

    const data = await response.json();

    return data.map((zona) => ({
      id: zona.id_Zona,
      nombre: zona.nombreZona,
    }));
  } catch (error) {
    console.error("❌ Error en listarZonasDisponibles:", error);
    return [];
  }
}

