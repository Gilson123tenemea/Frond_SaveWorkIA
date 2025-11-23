// ===============================
// ✔ VALIDACIONES PARA ZONAS
// ===============================

// 🔹 Validar nombre de zona (letras, números, espacios)
export function validarNombreZona(nombre: string) {
  if (!nombre || nombre.trim() === "") {
    return "El nombre de la zona es obligatorio";
  }

  const regex = /^[a-zA-Z0-9ÁÉÍÓÚáéíóúñÑ ]+$/;

  if (!regex.test(nombre)) {
    return "El nombre solo puede contener letras, números y espacios";
  }

  if (nombre.length < 3) {
    return "El nombre debe tener mínimo 3 caracteres";
  }

  return null;
}

// 🔹 Validar latitud / longitud (numérico)
export function validarCoordenada(valor: string, nombre: string) {
  if (!valor || valor.trim() === "") {
    return `La ${nombre} es obligatoria`;
  }

  if (isNaN(Number(valor))) {
    return `La ${nombre} debe ser un número válido`;
  }

  return null;
}
