import { BASE_URL } from "./api";

/**
 * Registra asistencia al ingresar el código del trabajador.
 * Crea un registro en BD con timestamp actual (fecha_hora = null → backend usa now).
 *
 * @param {string} codigo - Código ingresado o escaneado (ej: "TRA-001")
 * @param {number} idCamara - ID de la cámara que detectó el ingreso
 * @param {object} ids - IDs retornados por tu endpoint trabajador
 *  {
 *    id_trabajador,
 *    id_empresa,
 *    id_zona,
 *    id_persona_trabajador,
 *    id_supervisor_trabajador (opcional, si no lo usas aquí ignóralo)
 *  }
 * @param {object} supervisorLoginIds - IDs obtenidos del supervisor logeado en localStorage
 *  {
 *    id_supervisor,
 *    id_empresa_supervisor
 *  }
 */
export async function registrarAsistencia(codigo, idCamara, ids, supervisorLoginIds) {
  try {
    // Armar payload exacto para el backend
    const payload = {
      fecha_hora: null,            // backend pondrá CURRENT_TIMESTAMP
      cumple_epp: true,            // luego IA puede actualizar a false si falla
      codigo_ingresado: codigo,    // histórico del valor que escribió el worker
      id_trabajador: ids.id_trabajador,
      id_empresa: ids.id_empresa,
      id_zona: ids.id_zona,
      id_camara: idCamara,
      id_supervisor: supervisorLoginIds.id_supervisor,
      id_inspector: null,          // nullable, lo llenas si quieres después
      id_inspector: ids.id_inspector ?? null
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

    return await res.json(); // retorna el registro creado
  } catch (error) {
    console.error("❌ registrarAsistencia:", error.message);
    return { error: error.message };
  }
}
