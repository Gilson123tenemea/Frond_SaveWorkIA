// ===========================================
// ✔ VALIDACIONES DEL FRONTEND (Igual al backend)
// ===========================================

// 🟦 Campo obligatorio
export function campoObligatorio(valor: any, nombre: string) {
  if (!valor || valor.toString().trim() === "") {
    return `El campo '${nombre}' es obligatorio`;
  }
  return null;
}

// 🟦 Validar cédula ecuatoriana
export function validarCedulaEcuatoriana(cedula: string) {
  if (!cedula) return "La cédula es obligatoria";

  if (!/^\d{10}$/.test(cedula)) {
    return "La cédula debe tener exactamente 10 números";
  }

  const provincia = parseInt(cedula.substring(0, 2));
  if (provincia < 1 || provincia > 24) {
    return "La cédula no pertenece a una provincia válida";
  }

  const coef = [2,1,2,1,2,1,2,1,2];
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let valor = parseInt(cedula[i]) * coef[i];
    if (valor > 9) valor -= 9;
    suma += valor;
  }

  const digitoVerif = (10 - (suma % 10)) % 10;

  if (digitoVerif !== parseInt(cedula[9])) {
    return "La cédula ecuatoriana no es válida";
  }

  return null;
}

// 🟦 Validar nombre
export function validarNombre(nombre: string) {
  if (!nombre) return "El nombre es obligatorio";

  const patron = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]{2,50}$/;

  if (!patron.test(nombre)) {
    return "El nombre solo puede contener letras y espacios (2–50 caracteres)";
  }

  return null;
}

// 🟦 Validar apellido
export function validarApellido(apellido: string) {
  if (!apellido) return "El apellido es obligatorio";

  const patron = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]{2,50}$/;

  if (!patron.test(apellido)) {
    return "El apellido solo puede contener letras y espacios (2–50 caracteres)";
  }

  return null;
}

// 🟦 Validar teléfono

export function validarTelefono(telefono: string) {
  if (!telefono) return "El teléfono es obligatorio";

  if (!/^\d{10}$/.test(telefono)) {
    return "El teléfono debe tener exactamente 10 números";
  }

  const prefijo = telefono.substring(0, 2);
  const prefijosValidos = ["09", "02", "03", "04", "05", "06", "07"];

  if (!prefijosValidos.includes(prefijo)) {
    return "El teléfono debe comenzar con un prefijo válido ecuatoriano (09, 02-07)";
  }

  if (/^(\d)\1{9}$/.test(telefono)) {
    return "El teléfono no puede contener solo dígitos repetidos";
  }

  return null;
}

// 🟦 Validar formato correo
export function validarCorreo(correo: string) {
  if (!correo) return "El correo es obligatorio";

  const patron = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!patron.test(correo)) {
    return "El formato del correo no es válido";
  }

  return null;
}

// 🟦 Validar dirección
export function validarDireccion(direccion: string) {
  if (!direccion) return "La dirección es obligatoria";

  const patron = /^[A-Za-z0-9ÁÉÍÓÚáéíóúñÑ #.,-]{5,100}$/;

  if (!patron.test(direccion)) {
    return "La dirección contiene caracteres no permitidos o es muy corta";
  }

  return null;
}

// 🟦 Validar género
export function validarGenero(genero: string) {
  if (!genero) return "Debe seleccionar un género";

  if (genero !== "Masculino" && genero !== "Femenino") {
    return "Género inválido";
  }

  return null;
}

// 🟦 Validar fecha nacimiento (mayor de 18)
export function validarFechaNacimiento(fecha: string) {
  if (!fecha) return "La fecha de nacimiento es obligatoria";

  const nacimiento = new Date(fecha);
  const hoy = new Date();

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  if (edad < 18) return "Debe ser mayor de 18 años";

  return null;
}

// 🟦 Validar especialidad
export function validarEspecialidad(especialidad: string) {
  if (!especialidad) return "La especialidad es obligatoria";

  const patron = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ()/-]{3,50}$/;

  if (!patron.test(especialidad)) {
    return "La especialidad contiene caracteres no permitidos";
  }

  return null;
}

// 🟦 Validar experiencia
export function validarExperiencia(exp: any) {
  if (!exp && exp !== 0) return "La experiencia es obligatoria";

  const num = Number(exp);

  if (isNaN(num)) return "La experiencia debe ser un número";
  if (num < 1 || num > 80) return "La experiencia debe ser entre 1 y 80 años";

  return null;
}

// 🟦 Validar contraseña segura
export function validarContrasena(contrasena: string) {
  if (!contrasena) return "La contraseña es obligatoria";

  if (contrasena.length < 8) {
    return "La contraseña debe tener mínimo 8 caracteres";
  }

  const patron = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).+$/;

  if (!patron.test(contrasena)) {
    return "La contraseña debe tener mayúsculas, minúsculas, números y caracteres especiales";
  }

  return null;
}

export function validarZonaAsignada(zona: string) {
  if (!zona) return "La zona asignada es obligatoria";

  const patron = /^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9 #.,()-]{3,50}$/;

  if (!patron.test(zona)) {
    return "La zona asignada debe tener entre 3 y 50 caracteres y no usar símbolos no permitidos";
  }

  return null;
}

export function validarFrecuenciaVisita(freq: string) {
  if (!freq) return "La frecuencia de visita es obligatoria";

  const patron = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]{3,30}$/;

  if (!patron.test(freq)) {
    return "La frecuencia debe contener solo letras (3–30 caracteres)";
  }

  return null;
}

export function validarCargo(cargo: string) {
  if (!cargo) return "El cargo es obligatorio";

  const patron = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]{3,50}$/;

  if (!patron.test(cargo)) {
    return "El cargo solo puede contener letras y espacios (3–50 caracteres)";
  }

  return null;
}

export function validarAreaTrabajo(area: string) {
  if (!area) return "El área de trabajo es obligatoria";

  const patron = /^[A-Za-z0-9ÁÉÍÓÚáéíóúñÑ ]{3,50}$/;

  if (!patron.test(area)) {
    return "El área de trabajo solo puede contener letras, números y espacios (3–50 caracteres)";
  }

  return null;
}

export function validarImplementos(impl: string) {
  if (!impl || impl.trim() === "") {
    return "Los implementos de seguridad son obligatorios";
  }

  if (impl.length < 3) {
    return "Los implementos deben tener mínimo 3 caracteres";
  }

  return null;
}

export function validarEstadoTrabajador(estado: string) {
  if (!estado) return "El estado es obligatorio";

  if (estado !== "activo" && estado !== "inactivo") {
    return "El estado debe ser 'activo' o 'inactivo'";
  }

  return null;
}

export function validarCodigoTrabajador(codigo: string) {
  if (!codigo) return "El código trabajador es obligatorio";

  const patron = /^TRA-\d{3}$/;

  if (!patron.test(codigo)) {
    return "El código debe tener el formato TRA-001";
  }

  return null;
}
