// app/servicios/registro_asistencia_actualizado.js
/**
 * NOTA: Reemplaza tu registro_asistencia.js actual con este
 */

import { BASE_URL } from "./api";

/**
 * Registra asistencia BÁSICA (sin análisis EPP)
 * Se usa solo para crear el registro inicial
 * 
 * DEPRECATED: Ahora se recomienda usar verificarEPP() que hace todo automáticamente
 */
export async function registrarAsistencia(codigo, idCamara, ids, supervisorLoginIds) {
  try {
    const payload = {
      fecha_hora: null,
      cumple_epp: true,
      codigo_ingresado: codigo,
      id_trabajador: ids.id_trabajador,
      id_empresa: ids.id_empresa,
      id_zona: ids.id_zona,
      id_camara: idCamara,
      id_supervisor: supervisorLoginIds.id_supervisor,
      id_inspector: ids.id_inspector ?? null,
    };

    const res = await fetch(`${BASE_URL}/registros-asistencia/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "❌ Error al registrar asistencia");
    }

    return await res.json();
  } catch (error) {
    console.error("❌ registrarAsistencia:", error.message);
    return { error: error.message };
  }
}

// ============================================================
// app/servicios/verificar_epp.js
/**
 * Servicio para verificar EPP y crear registros de asistencia
 * Orquesta: obtener frame → analizar EPP → crear registros + evidencias
 */

import { BASE_URL } from "./api";

/**
 * Verifica EPP del trabajador capturando frame de la cámara
 * Puede recibir 2 o 3 argumentos (compatible hacia atrás)
 *
 * @param {number} idCamara - ID de la cámara
 * @param {string} codigoTrabajador - Código del trabajador (ej: "TRA-001")
 * @param {Object} [datosTrabajador] - Datos del trabajador (opcional, si no se pasa se obtiene del endpoint)
 * @returns {Promise<Object>} Resultado del análisis con detecciones y evidencia
 */
export async function verificarEPP(idCamara, codigoTrabajador, datosTrabajador = null) {
  try {
    if (!idCamara || !codigoTrabajador) {
      throw new Error("ID de cámara y código de trabajador son requeridos");
    }

    if (!datosTrabajador) {
      throw new Error("❌ datosTrabajador es requerido");
    }

    // 🆕 VALIDACIÓN ROBUSTA
    const idTrabajador = datosTrabajador.id_trabajador;
    const idEmpresa = datosTrabajador.id_empresa;
    const idZona = datosTrabajador.id_zona;
    const idSupervisor = datosTrabajador.id_supervisor_trabajador;
    const idInspector = datosTrabajador.id_inspector || null;

    if (!idTrabajador || !idEmpresa || !idZona || !idSupervisor) {
      console.error("❌ Datos incompletos:", {
        id_trabajador: idTrabajador,
        id_empresa: idEmpresa,
        id_zona: idZona,
        id_supervisor_trabajador: idSupervisor,
      });
      throw new Error(
        `❌ Faltan datos obligatorios. Tienes: ${JSON.stringify({
          id_trabajador: idTrabajador,
          id_empresa: idEmpresa,
          id_zona: idZona,
          id_supervisor: idSupervisor,
        })}`
      );
    }

    console.log("📦 Datos enviados al backend:", {
      id_trabajador: idTrabajador,
      id_empresa: idEmpresa,
      id_zona: idZona,
      id_supervisor_trabajador: idSupervisor,
      id_inspector: idInspector,
      persona: datosTrabajador.persona,
    });

    // ✅ BODY LIMPIO Y CORRECTO
    const datosVerificacion = {
      id_trabajador: idTrabajador,
      id_empresa: idEmpresa,
      id_zona: idZona,
      id_supervisor_trabajador: idSupervisor,
      id_inspector: idInspector,
      persona: {
        nombre: datosTrabajador.persona?.nombre || "",
        apellido: datosTrabajador.persona?.apellido || "",
      },
    };

    const url = new URL(`${BASE_URL}/registros-asistencia/verificar-epp/${idCamara}`);
    url.searchParams.append("codigo_trabajador", codigoTrabajador);

 

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosVerificacion),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("❌ Error del servidor:", errorData);
      throw new Error(
        errorData?.detail || `Error verificando EPP (${response.status})`
      );
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("❌ Error verificando EPP:", error.message);
    return { error: error.message };
  }
}

/**
 * Convierte respuesta del backend a formato más legible para UI
 * @param {Object} respuestaBackend - Respuesta de verificarEPP()
 * @returns {Object} Datos formateados para mostrar en UI
 */
export function formatearResultadoEPP(respuestaBackend) {
  if (respuestaBackend.error) {
    return {
      cumpleEpp: false,
      mensaje: respuestaBackend.error,
      detecciones: null,
      fotoUrl: null,
      detallesFallo: null,
    };
  }

  const cumpleEpp = respuestaBackend.status.includes("✅");

  // Generar lista de detalles si no cumple
  let detallesFallo = [];
  if (!cumpleEpp) {
    const det = respuestaBackend.detecciones;
    if (!det.casco) detallesFallo.push("Falta casco");
    if (!det.chaleco) detallesFallo.push("Falta chaleco");
    if (!det.guantes) detallesFallo.push("Falta guantes");
    if (!det.botas) detallesFallo.push("Falta botas");
    if (!det.lentes) detallesFallo.push("Falta lentes");
  }

  return {
    cumpleEpp,
    mensaje: respuestaBackend.mensaje,
    detecciones: respuestaBackend.detecciones,
    fotoUrl: respuestaBackend.evidencia?.foto_url || null,
    detallesFallo,
    idRegistro: respuestaBackend.registro?.id_registro,
    trabajador: respuestaBackend.registro?.trabajador,
  };
}

/**
 * Obtiene URL completa para ver foto de evidencia (si existe)
 * @param {string} fotoUrl - Ruta relativa guardada en BD
 * @returns {string} URL completa para descargar/ver foto
 */
export function obtenerUrlFoto(fotoUrl) {
  if (!fotoUrl || fotoUrl === "pendiente") return null;
  // Ajusta según cómo sirvas archivos estáticos
  return `${BASE_URL}/${fotoUrl}`;
}