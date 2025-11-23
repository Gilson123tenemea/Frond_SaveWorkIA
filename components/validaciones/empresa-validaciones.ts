// components/validaciones/empresa-validaciones.ts

// 🟦 Campo obligatorio
export function campoObligatorio(valor: any, nombre: string) {
  if (!valor || valor.toString().trim() === "") {
    return `El campo '${nombre}' es obligatorio`
  }
  return null;
}

// 🟦 Nombre (solo letras)
export function validarNombreEmpresa(nombre: string) {
  if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$/.test(nombre)) {
    return "El nombre solo debe contener letras"
  }
  return null;
}

// 🟦 RUC (13 dígitos)
export function validarRuc(ruc: string) {
  if (!/^\d{13}$/.test(ruc)) return "El RUC debe contener 13 números"
  return null;
}

// 🟦 Teléfono (10 dígitos)
export function validarTelefono(telefono: string) {
  if (!/^\d{10}$/.test(telefono)) return "El teléfono debe tener 10 números"
  return null;
}

// 🟦 Correo
export function validarCorreo(correo: string) {
  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo))
    return "El correo no tiene un formato válido"
  return null
}
