import { BASE_URL } from "./api";

const SUPERVISOR_URL = `${BASE_URL}/supervisores`;

// ============================
// 📌 VALIDAR CORREO EN TIEMPO REAL
// ============================
export async function validarCorreoSupervisor(correo, signal) {
  try {
    
    const res = await fetch(
      `${SUPERVISOR_URL}/validar-correo?correo=${encodeURIComponent(correo)}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
        signal,
      }
    )


    if (!res.ok) {
      const txt = await res.text()
      console.error("❌ Error response:", txt) // DEBUG
      throw new Error(txt || "Error validando correo")
    }

    const data = await res.json()
    
    return data // { disponible: true/false }
  } catch (err) {
    console.error("❌ Error en validarCorreoSupervisor:", err)
    throw err
  }
}

// ============================
// 📌 Verificar cédula
// ============================
export async function verificarCedula(cedula) {
  try {
    const res = await fetch(`${SUPERVISOR_URL}/validar-cedula/${cedula}`);

    if (!res.ok) return false;

    const data = await res.json();
    return data.existe;
  } catch (err) {
    console.error("❌ Error verificando cédula:", err);
    return false;
  }
}

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
  const response = await fetch(`${SUPERVISOR_URL}/eliminar/${idSupervisor}`, {
    method: "DELETE",
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const msg = data?.detail || "Error al eliminar el supervisor";
    return Promise.reject(new Error(msg));
  }

  return data;
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

// ============================
// 📌 Obtener empresas disponibles (sin supervisor asignado)
// ============================
export async function obtenerEmpresasDisponibles() {
  try {
    const response = await fetch(`${SUPERVISOR_URL}/empresas-disponibles`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error en obtenerEmpresasDisponibles:", errorText);
      throw new Error("Error al obtener las empresas disponibles");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ obtenerEmpresasDisponibles:", error);
    throw error;
  }
}

// ============================
// 📌 Obtener empresa por ID del supervisor
// ============================
export async function obtenerEmpresaPorSupervisor(idSupervisor) {
  try {
    const response = await fetch(`${SUPERVISOR_URL}/empresa/${idSupervisor}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Respuesta no OK obtenerEmpresaPorSupervisor:", errorText);
      throw new Error("Error al obtener la empresa del supervisor");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en obtenerEmpresaPorSupervisor:", error);
    throw error;
  }
}

// ============================
// 📌 Obtener perfil del supervisor
// ============================
export async function obtenerPerfilSupervisor(idSupervisor) {
  const response = await fetch(`${SUPERVISOR_URL}/perfil/${idSupervisor}`);
  if (!response.ok) throw new Error("Error obteniendo perfil");
  return response.json();
}

// ============================
// 📌 Actualizar perfil del supervisor
// ============================
export async function actualizarPerfilSupervisor(id, data) {
  const res = await fetch(`${SUPERVISOR_URL}/perfil/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre: data.nombre,
      apellido: data.apellido,
      correo: data.correo,
      telefono: data.telefono ?? null,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Error actualizando perfil");
  }

  return res.json();
}