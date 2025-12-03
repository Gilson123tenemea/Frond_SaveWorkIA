// ===============================
// 📌 Campo obligatorio
// ===============================
export function campoObligatorio(valor: any, nombre: string) {
  if (!valor || valor.toString().trim() === "") {
    return `El campo '${nombre}' es obligatorio`
  }
  return null
}


// ===============================
// 📌 Nombre de empresa (solo letras + min/max)
// ===============================
export function validarNombreEmpresa(nombre: string) {
  if (nombre.trim().length < 3) {
    return "El nombre debe tener al menos 3 caracteres"
  }

  if (nombre.trim().length > 50) {
    return "El nombre no puede superar los 50 caracteres"
  }

  if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$/.test(nombre)) {
    return "El nombre solo debe contener letras y espacios"
  }

  return null
}


// ===============================
// 📌 Validar RUC (13 dígitos)
// ===============================
export function validarRuc(ruc: string) {
  if (!/^\d{13}$/.test(ruc)) {
    return "El RUC debe contener exactamente 13 números"
  }
  return null
}


// ===============================
// 📌 Validar Teléfono (10 dígitos + empieza en 09)
// ===============================
export function validarTelefono(telefono: string) {
  if (!/^\d{10}$/.test(telefono)) {
    return "El teléfono debe tener exactamente 10 dígitos"
  }

  if (!telefono.startsWith("09")) {
    return "El teléfono debe iniciar con 09 (Ecuador)"
  }

  return null
}


// ===============================
// 📌 Validar correo formato profesional
// ===============================
export function validarCorreo(correo: string) {
  const patron = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

  if (!patron.test(correo)) {
    return "El correo no tiene un formato válido"
  }

  return null
}
