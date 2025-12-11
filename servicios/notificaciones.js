import { BASE_URL } from "./api"

export async function obtenerNotificacionesInspector(idInspector) {
  const res = await fetch(`${BASE_URL}/inspectores/${idInspector}/notificaciones`);
  return res.json();
}

export async function marcarNotificacionComoLeida(idEvidencia) {
  const res = await fetch(`${BASE_URL}/inspectores/notificaciones/${idEvidencia}/revisar`, {
    method: "PUT",
  });
  return res.json();
}
