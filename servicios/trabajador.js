import { BASE_URL } from "./api";

const TRABAJADOR_URL = `${BASE_URL}/trabajadores`;


export async function validarCedulaInstantanea(cedula) {
  try {
    const response = await fetch(`${TRABAJADOR_URL}/validar-cedula/${cedula}`, {
      method: "GET",
    });

    const data = await response.json();
    return data.existe; // true = ya existe, false = disponible
  } catch (error) {
    console.error("❌ Error validando cédula:", error);
    return false;
  }
}

export async function validarCodigoInstantaneo(codigo) {
  try {
    const response = await fetch(`${TRABAJADOR_URL}/validar-codigo/${codigo}`);
    const data = await response.json();
    return data.existe; // true = ya existe
  } catch (error) {
    console.error("❌ Error validando código:", error);
    return false;
  }
}


// =======================================
// 📌 Registrar un nuevo TRABAJADOR
export async function registrarTrabajador(datosTrabajador) {
  try {
    console.log("📤 JSON ENVIADO AL BACK:", datosTrabajador);

    const response = await fetch(`${TRABAJADOR_URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosTrabajador),
    });

    if (!response.ok) {
      const errorData = await response.json();

      console.error("❌ ERROR DETALLADO FASTAPI:", errorData);

      // Mostrar detalle REAL
      throw new Error(
        JSON.stringify(errorData.detail || errorData)
      );
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en registrarTrabajador:", error);
    throw error;
  }
}



// =======================================
// 📌 Listar todos los trabajadores
// =======================================
export async function listarTrabajadores() {
  try {
    const response = await fetch(`${TRABAJADOR_URL}/`, {
      method: "GET",
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Respuesta no OK listarTrabajadores:", errText);
      throw new Error("Error al obtener la lista de trabajadores");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en listarTrabajadores:", error);
    throw error;
  }
}


// =======================================
// 📌 Obtener trabajador por ID
// =======================================
export async function obtenerTrabajadorPorId(idTrabajador) {
  try {
    const response = await fetch(`${TRABAJADOR_URL}/${idTrabajador}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Respuesta no OK obtenerTrabajadorPorId:", errText);
      throw new Error("Error al obtener el trabajador");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en obtenerTrabajadorPorId:", error);
    throw error;
  }
}



// =======================================
// 📌 Editar trabajador (persona + trabajador)
// =======================================
export async function editarTrabajador(idTrabajador, datosTrabajador) {
  try {
    const response = await fetch(`${TRABAJADOR_URL}/${idTrabajador}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosTrabajador),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al editar el trabajador");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en editarTrabajador:", error);
    throw error;
  }
}



// =======================================
// 📌 Borrado lógico del trabajador
// =======================================
export async function eliminarTrabajador(idTrabajador) {
  try {
    const response = await fetch(`${TRABAJADOR_URL}/borrar/${idTrabajador}`, {
      method: "PUT",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al eliminar el trabajador");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en eliminarTrabajador:", error);
    throw error;
  }
}

export async function listarTrabajadoresPorSupervisor(idSupervisor) {
  try {
    const response = await fetch(`${TRABAJADOR_URL}/supervisor/${idSupervisor}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Respuesta no OK listarTrabajadoresPorSupervisor:", errText);
      throw new Error("Error al obtener trabajadores del supervisor");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en listarTrabajadoresPorSupervisor:", error);
    throw error;
  }
} 

// =======================================
// 📌 Listar trabajadores NO asignados a zona por supervisor
// =======================================
export async function listarTrabajadoresNoAsignados(idSupervisor) {
  try {
    const response = await fetch(
      `${TRABAJADOR_URL}/supervisor/${idSupervisor}/no-asignados`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Respuesta no OK listarTrabajadoresNoAsignados:", errText);
      throw new Error("Error al obtener trabajadores no asignados");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en listarTrabajadoresNoAsignados:", error);
    throw error;
  }
}

export async function validarCorreoInstantaneo(correo) {
  try {
    const response = await fetch(`${TRABAJADOR_URL}/validar-correo/${correo}`);
    const data = await response.json();
    return data.existe; // true = ya existe, false = disponible
  } catch (error) {
    console.error("❌ Error validando correo:", error);
    return false;
  }
}

