// src/servicios/trabajador_zona.js

import { BASE_URL } from "./api";

const TRABAJADOR_ZONA_URL = `${BASE_URL}/trabajador_zonas`;

export async function listarZonasDetallesPorSupervisor(idSupervisor) {
  try {
    const response = await fetch(`${TRABAJADOR_ZONA_URL}/supervisor/${idSupervisor}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Error listarZonasDetallesPorSupervisor:", errText);
      throw new Error("Error al obtener zonas relacionadas al supervisor");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en listarZonasDetallesPorSupervisor:", error);
    throw error;
  }
}


export async function crearAsignacionTrabajadorZona(datos) {
  try {
    const response = await fetch(`${TRABAJADOR_ZONA_URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("❌ Error crearAsignacionTrabajadorZona:", errData);
      throw new Error(errData.detail || "Error al asignar trabajador a zona");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en crearAsignacionTrabajadorZona:", error);
    throw error;
  }
}


export async function listarAsignacionesTrabajadorZona() {
  try {
    const response = await fetch(`${TRABAJADOR_ZONA_URL}/`, {
      method: "GET",
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Error listarAsignacionesTrabajadorZona:", errText);
      throw new Error("Error al obtener asignaciones trabajador-zona");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en listarAsignacionesTrabajadorZona:", error);
    throw error;
  }
}

export async function obtenerAsignacionTrabajadorZona(idAsignacion) {
  try {
    const response = await fetch(`${TRABAJADOR_ZONA_URL}/${idAsignacion}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Error obtenerAsignacionTrabajadorZona:", errText);
      throw new Error("Error al obtener la asignación");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en obtenerAsignacionTrabajadorZona:", error);
    throw error;
  }
}

// =========================================================
// 📌 7. Obtener listado DETALLADO trabajador ↔ zona
// =========================================================
export async function listarAsignacionesTrabajadorZonaDetalles() {
  try {
    const response = await fetch(`${TRABAJADOR_ZONA_URL}/detalles`, {
      method: "GET",
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Error listarAsignacionesTrabajadorZonaDetalles:", errText);
      throw new Error("Error al obtener detalles trabajador-zona");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en listarAsignacionesTrabajadorZonaDetalles:", error);
    throw error;
  }
}


export async function eliminarAsignacionFisico(idAsignacion) {
  try {
    const response = await fetch(`${TRABAJADOR_ZONA_URL}/${idAsignacion}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("❌ Error eliminarAsignacionFisico:", errData);
      throw new Error(errData.detail || "Error al eliminar la asignación");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en eliminarAsignacionFisico:", error);
    throw error;
  }
}


export async function eliminarAsignacionLogico(idAsignacion) {
  try {
    const response = await fetch(`${TRABAJADOR_ZONA_URL}/eliminar-logico/${idAsignacion}`, {
      method: "PUT",
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("❌ Error eliminarAsignacionLogico:", errData);
      throw new Error(errData.detail || "Error al marcar asignación eliminada");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en eliminarAsignacionLogico:", error);
    throw error;
  }
}

