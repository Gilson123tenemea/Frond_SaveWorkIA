import { BASE_URL } from "./api";

/**
 * 🔍 Llama al backend para verificar EPP
 */
export async function verificarEPP(
  idCamara,
  codigoTrabajador,
  datosTrabajador = null
) {
  try {
    if (!idCamara || !codigoTrabajador) {
      throw new Error("ID de cámara y código de trabajador son requeridos");
    }

    const url = new URL(
      `${BASE_URL}/registros-asistencia/verificar-epp/${idCamara}`
    );
    url.searchParams.append("codigo_trabajador", codigoTrabajador);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosTrabajador),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error verificando EPP");
    }

    const data = await response.json();

    // 👇 AQUÍ se formatea
    return formatearResultadoEPP(data);

  } catch (error) {
    console.error("❌ Error verificando EPP:", error.message);
    return {
      cumpleEpp: false,
      mensaje: error.message,
      detallesFallo: [],
      fotoUrl: null,
    };
  }
}

/**
 * 🔧 FORMATEADOR (VA AQUÍ)
 */
export function formatearResultadoEPP(respuestaBackend) {
  if (respuestaBackend?.error) {
    return {
      cumpleEpp: false,
      mensaje: respuestaBackend.error,
      detallesFallo: [],
      fotoUrl: null,
    };
  }

  const detalleTexto = respuestaBackend.evidencia?.detalle ?? "";

  const cumpleEpp =
    detalleTexto === "" ||
    detalleTexto.toLowerCase().includes("cumple");

  return {
    cumpleEpp,
    mensaje: cumpleEpp ? "Cumple EPP" : "Incumple EPP",

    detallesFallo: detalleTexto ? [detalleTexto] : [],

    fotoUrl: respuestaBackend.evidencia?.foto_base64
      ? `data:image/jpeg;base64,${respuestaBackend.evidencia.foto_base64}`
      : null,

    idRegistro: respuestaBackend.registro?.id_registro,
    trabajador: respuestaBackend.registro?.trabajador,
  };
}
