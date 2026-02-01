/**
 * Tipos TypeScript para los servicios del proyecto
 * Centraliza todas las interfaces y tipos utilizados en la aplicación
 */

// ============================================
// PERSONA Y TRABAJADOR
// ============================================

export interface Persona {
  id_persona: number;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  correo: string;
  fecha_nacimiento: string;
  genero: string;
  borrado: boolean;
}

export interface Zona {
  id_Zona: number;
  nombreZona: string;
  descripcion: string;
  borrado: boolean;
}

export interface Camara {
  id_camara: number;
  ipAddress: string;
  ubicacion: string;
  borrado: boolean;
  zona?: Zona;
}

export interface Trabajador {
  id_trabajador: number;
  codigo_trabajador: string;
  id_empresa: number;
  id_supervisor_trabajador: number;
  id_inspector: number | null;
  borrado: boolean;
  persona: Persona;
  camara?: Camara;
}

export interface TrabajadorResponse extends Trabajador {
  error?: string;
}

// ============================================
// EPP Y ZONA
// ============================================

export interface EppZona {
  id_zona_epp: number;
  id_zona: number;
  tipo_epp: string;
  activo: boolean;
  obligatorio: boolean;
  borrado: boolean;
}

// ============================================
// ANÁLISIS EPP
// ============================================

export interface DatosTrabajador {
  codigo_trabajador: string;
  id_empresa: number;
  id_zona: number;
  id_trabajador: number;
  id_supervisor_trabajador: number;
  id_inspector: number | null;
  persona: {
    nombre: string;
    apellido: string;
  };
}

export interface ResultadoAnalisis {
  error: boolean;
  cumpleEpp: boolean;
  mensaje: string;
  registro?: {
    id: number;
    trabajador: {
      id: number;
      codigo: string;
      nombre: string;
    };
    fecha: string;
  };
  zona?: {
    id: number;
    nombre: string;
  };
  epp?: {
    requeridos: string[];
    detecciones: Record<string, boolean>;
  };
  evidencia?: {
    tieneFallo: boolean;
    fotoBase64: string | null;
    detalle: string;
  };
  detallesFallo: string[];
}

// ============================================
// REGISTRO ASISTENCIA
// ============================================

export interface RegistroAsistencia {
  id_registro: number;
  fecha_hora: string;
  cumple_epp: boolean;
  codigo_ingresado: string;
  id_trabajador: number;
  id_empresa: number;
  id_zona: number;
  id_supervisor: number;
  id_camara: number | null;
  id_inspector: number | null;
  detalle_fallo?: string;
}

// ============================================
// EMPRESA Y SUPERVISOR
// ============================================

export interface Empresa {
  id_empresa: number;
  nombre_empresa: string;
  ruc: string;
  direccion: string;
  telefono: string;
  correo: string;
  borrado: boolean;
}

export interface Supervisor {
  id_supervisor: number;
  id_empresa: number;
  id_persona: number;
  borrado: boolean;
  persona: Persona;
  empresa: Empresa;
}

// ============================================
// USUARIO (LOGIN)
// ============================================

export interface UserData {
  id_supervisor?: number;
  id_empresa_supervisor?: number;
  id_inspector?: number;
  id_trabajador?: number;
  tipo_usuario: 'supervisor' | 'inspector' | 'trabajador';
  nombre: string;
  apellido: string;
  correo: string;
}

// ============================================
// RESPUESTAS DE API
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ValidationResponse {
  existe: boolean;
  disponible?: boolean;
  correo?: string;
  mensaje?: string;
}