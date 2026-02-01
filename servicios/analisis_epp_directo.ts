/**
 * Servicio para análisis EPP directo desde frontend
 * Captura frames de la cámara y los envía al backend para análisis YOLO
 * Versión TypeScript con tipos completos
 * 
 * ✅ VERSIÓN CORREGIDA: Incluye id_camara obligatorio
 */

import { BASE_URL } from "./api";

const ANALISIS_EPP_URL = `${BASE_URL}/analisis-epp`;

// ============================================
// TIPOS TYPESCRIPT
// ============================================

interface DatosTrabajador {
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

// ✅ NUEVO: Interfaz con id_camara obligatorio
interface AnalisisEPPRequest {
  frame_base64: string;
  codigo_trabajador: string;
  id_empresa: number;
  id_zona: number;
  id_trabajador: number;
  id_supervisor: number;
  id_inspector: number | null;
  id_camara: number;  // ✅ NUEVO: OBLIGATORIO
  nombre_trabajador: string;
  apellido_trabajador: string;
}

interface ResultadoAnalisis {
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

interface RespuestaBackend {
  status: string;
  mensaje: string;
  registro?: {
    id_registro: number;
    trabajador: {
      id: number;
      codigo: string;
      nombre: string;
    };
    cumple_epp: boolean;
    fecha_hora: string;
  };
  zona?: {
    id: number;
    nombre: string;
  };
  epp_requeridos?: string[];
  detecciones?: Record<string, boolean>;
  evidencia?: {
    tiene_fallo: boolean;
    foto_base64: string | null;
    detalle: string;
  };
}

// ============================================
// NUEVAS FUNCIONES: OBTENER ID CÁMARA
// ============================================

/**
 * ✅ NUEVA: Obtiene ID único de la cámara del dispositivo
 * Si no hay cámara física, genera ID consistente para la sesión
 * 
 * @returns Promise con ID único de cámara (número positivo)
 */
export async function obtenerIdCamara(): Promise<number> {
  try {
    // Intento 1: Obtener deviceId de la cámara si se puede
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      throw new Error("enumerateDevices no soportado");
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
    if (videoDevices.length > 0) {
      const deviceId = videoDevices[0].deviceId;
      // Convertir deviceId string a número hash
      const hash = deviceId
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      const idCamara = Math.abs(hash % 10000) + 1;  // Garantizar número positivo
      console.log(`✅ ID Cámara obtenido del dispositivo: ${idCamara}`);
      return idCamara;
    }
    
    throw new Error("No hay cámaras detectadas");
    
  } catch (error) {
    console.warn("⚠️ No se pudo obtener ID de dispositivo, usando ID de sesión:", error);
    
    // Intento 2: Usar ID de sesión guardado
    const sessionCameraId = sessionStorage.getItem('session_camera_id');
    if (sessionCameraId) {
      const id = parseInt(sessionCameraId);
      if (!isNaN(id) && id > 0) {
        console.log(`✅ ID Cámara sesión recuperado: ${id}`);
        return id;
      }
    }
    
    // Intento 3: Generar nuevo ID para esta sesión
    const newSessionId = Math.floor(Math.random() * 9999) + 1;
    sessionStorage.setItem('session_camera_id', newSessionId.toString());
    console.log(`✅ ID Cámara nuevo generado para sesión: ${newSessionId}`);
    return newSessionId;
  }
}

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

/**
 * Captura un frame de la cámara del usuario
 * 
 * @param stream - Stream de getUserMedia()
 * @returns Promise con frame en formato base64 (data:image/jpeg;base64,...)
 */
export async function capturarFrameDesdeStream(stream: MediaStream): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Crear elemento video temporal
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.onloadedmetadata = () => {
        // Crear canvas con las dimensiones del video
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('No se pudo obtener contexto 2D del canvas'));
          return;
        }
        
        // Dibujar frame actual del video en el canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convertir a base64
        const frameBase64 = canvas.toDataURL('image/jpeg', 0.85);
        
        // Limpiar
        video.pause();
        video.srcObject = null;
        
        resolve(frameBase64);
      };
      
      video.onerror = (error) => {
        reject(new Error(`Error capturando frame: ${error}`));
      };
      
    } catch (error) {
      if (error instanceof Error) {
        reject(new Error(`Error en captura: ${error.message}`));
      } else {
        reject(new Error('Error desconocido en captura'));
      }
    }
  });
}

/**
 * Solicita permisos de cámara y retorna el stream
 * 
 * @returns Promise con el stream de la cámara
 */
export async function inicializarCamara(): Promise<MediaStream> {
  try {
    const constraints: MediaStreamConstraints = {
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user' // 'user' para frontal, 'environment' para trasera
      },
      audio: false
    };
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log('✅ Cámara inicializada');
    return stream;
    
  } catch (error) {
    console.error('❌ Error accediendo a la cámara:', error);
    
    if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError') {
        throw new Error('Permisos de cámara denegados. Por favor, permite el acceso.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No se encontró ninguna cámara en el dispositivo.');
      }
    }
    
    throw new Error(`Error al acceder a la cámara: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

/**
 * Detiene un stream de cámara y libera recursos
 * 
 * @param stream - Stream a detener
 */
export function detenerCamara(stream: MediaStream | null): void {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    console.log('🔴 Cámara detenida');
  }
}

/**
 * ✅ ACTUALIZADO: Envía frame al backend CON id_camara obligatorio
 * 
 * @param datos - Datos para el análisis (ahora incluye id_camara)
 * @returns Promise con el resultado del análisis
 */
export async function analizarEPPDirecto(datos: {
  frame_base64: string;
  codigo_trabajador: string;
  id_empresa: number;
  id_zona: number;
  id_trabajador: number;
  id_supervisor: number;
  id_inspector: number | null;
  id_camara: number;  // ✅ NUEVO: OBLIGATORIO
  nombre_trabajador: string;
  apellido_trabajador: string;
}): Promise<ResultadoAnalisis> {
  try {
    console.log('🔍 Enviando frame para análisis EPP...');
    console.log(`📷 ID Cámara: ${datos.id_camara}`);  // ✅ LOG id_camara
    
    const payload: AnalisisEPPRequest = {
      frame_base64: datos.frame_base64,
      codigo_trabajador: datos.codigo_trabajador,
      id_empresa: datos.id_empresa,
      id_zona: datos.id_zona,
      id_trabajador: datos.id_trabajador,
      id_supervisor: datos.id_supervisor,
      id_inspector: datos.id_inspector || null,
      id_camara: datos.id_camara,  // ✅ ENVIADO: id_camara
      nombre_trabajador: datos.nombre_trabajador,
      apellido_trabajador: datos.apellido_trabajador,
    };
    
    console.log('📦 Payload enviado:', payload);
    
    const response = await fetch(`${ANALISIS_EPP_URL}/verificar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.detail || `Error del servidor (${response.status})`
      );
    }
    
    const resultado: RespuestaBackend = await response.json();
    console.log('✅ Análisis completado:', resultado);
    
    return formatearResultadoAnalisis(resultado);
    
  } catch (error) {
    console.error('❌ Error en análisis EPP:', error instanceof Error ? error.message : 'Error desconocido');
    return {
      error: true,
      mensaje: error instanceof Error ? error.message : 'Error desconocido',
      cumpleEpp: false,
      detallesFallo: [error instanceof Error ? error.message : 'Error desconocido'],
    };
  }
}

/**
 * Formatea la respuesta del backend para consumo del frontend
 * 
 * @param respuesta - Respuesta del backend
 * @returns Datos formateados
 */
function formatearResultadoAnalisis(respuesta: RespuestaBackend): ResultadoAnalisis {
  const cumpleEpp = respuesta.status?.includes('✅');
  
  return {
    error: false,
    cumpleEpp,
    mensaje: respuesta.mensaje || (cumpleEpp ? 'Cumple EPP' : 'No cumple EPP'),
    
    registro: respuesta.registro ? {
      id: respuesta.registro.id_registro,
      trabajador: respuesta.registro.trabajador,
      fecha: respuesta.registro.fecha_hora,
    } : undefined,
    
    zona: respuesta.zona ? {
      id: respuesta.zona.id,
      nombre: respuesta.zona.nombre,
    } : undefined,
    
    epp: {
      requeridos: respuesta.epp_requeridos || [],
      detecciones: respuesta.detecciones || {},
    },
    
    evidencia: {
      tieneFallo: respuesta.evidencia?.tiene_fallo || false,
      fotoBase64: respuesta.evidencia?.foto_base64
        ? `data:image/jpeg;base64,${respuesta.evidencia.foto_base64}`
        : null,
      detalle: respuesta.evidencia?.detalle || '',
    },
    
    detallesFallo: cumpleEpp 
      ? [] 
      : [respuesta.mensaje || 'EPP faltante'],
  };
}

/**
 * ✅ FLUJO COMPLETO ACTUALIZADO
 * Incluye: obtener ID cámara → inicializar cámara → capturar frame → analizar EPP
 * 
 * @param datosTrabajador - Datos del trabajador
 * @returns Promise con el resultado del análisis
 */
export async function flujoCompletoAnalisisEPP(
  datosTrabajador: DatosTrabajador
): Promise<ResultadoAnalisis> {
  let stream: MediaStream | null = null;
  
  try {
    // 1. ✅ NUEVO: Obtener ID único de la cámara
    const idCamara = await obtenerIdCamara();
    console.log(`📷 ID Cámara obtenido: ${idCamara}`);
    
    // 2. Inicializar cámara
    stream = await inicializarCamara();
    
    // 3. Esperar un momento para que la cámara se estabilice
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 4. Capturar frame
    const frameBase64 = await capturarFrameDesdeStream(stream);
    
    // 5. ✅ ACTUALIZADO: Analizar EPP CON id_camara
    const resultado = await analizarEPPDirecto({
      frame_base64: frameBase64,
      codigo_trabajador: datosTrabajador.codigo_trabajador,
      id_empresa: datosTrabajador.id_empresa,
      id_zona: datosTrabajador.id_zona,
      id_trabajador: datosTrabajador.id_trabajador,
      id_supervisor: datosTrabajador.id_supervisor_trabajador,
      id_inspector: datosTrabajador.id_inspector || null,
      id_camara: idCamara,  // ✅ NUEVO: Pasando id_camara
      nombre_trabajador: datosTrabajador.persona.nombre,
      apellido_trabajador: datosTrabajador.persona.apellido,
    });
    
    return resultado;
    
  } finally {
    // 6. Siempre detener la cámara al finalizar
    if (stream) {
      detenerCamara(stream);
    }
  }
}

/**
 * Verifica si el navegador soporta getUserMedia
 * 
 * @returns true si está soportado
 */
export function verificarSoporteCamara(): boolean {
  return !!(
    navigator.mediaDevices && 
    navigator.mediaDevices.getUserMedia
  );
}

/**
 * Verifica estado de salud del servicio de análisis
 * 
 * @returns Promise con el estado del servicio
 */
export async function verificarEstadoServicio(): Promise<{ status: string }> {
  try {
    const response = await fetch(`${ANALISIS_EPP_URL}/health`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error verificando estado:', error);
    return { status: '❌ Servicio no disponible' };
  }
}