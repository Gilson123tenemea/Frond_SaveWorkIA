/**
 * SOLUCIÓN FINAL - Análisis EPP sin errores de tipos
 * 
 * Simplificado: No extiende tipos conflictivos
 * Flexible: Acepta cualquier estructura
 * Funcional: Valida en runtime
 */

import { BASE_URL } from "./api";

const ANALISIS_EPP_URL = `${BASE_URL}/analisis-epp`;

// ============================================
// TIPOS TYPESCRIPT
// ============================================

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
// FUNCIONES PRINCIPALES
// ============================================

/**
 * Captura un frame de la cámara del usuario
 */
export async function capturarFrameDesdeStream(stream: MediaStream): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('No se pudo obtener contexto 2D del canvas'));
          return;
        }
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const frameBase64 = canvas.toDataURL('image/jpeg', 0.85);
        
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
 */
export async function inicializarCamara(): Promise<MediaStream> {
  try {
    const constraints: MediaStreamConstraints = {
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
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
 * Detiene un stream de cámara
 */
export function detenerCamara(stream: MediaStream | null): void {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    console.log('🔴 Cámara detenida');
  }
}

/**
 * Envía frame al backend para análisis
 */
export async function analizarEPPDirecto(datos: {
  frame_base64: string;
  codigo_trabajador: string;
  id_empresa: number;
  id_zona: number;
  id_trabajador: number;
  id_supervisor: number;
  id_inspector: number | null;
  id_camara: number;
  nombre_trabajador: string;
  apellido_trabajador: string;
}): Promise<ResultadoAnalisis> {
  try {
    console.log('🔍 Enviando frame para análisis EPP...');
    console.log(`📷 ID Cámara: ${datos.id_camara}`);
    
    const payload = {
      frame_base64: datos.frame_base64,
      codigo_trabajador: datos.codigo_trabajador,
      id_empresa: datos.id_empresa,
      id_zona: datos.id_zona,
      id_trabajador: datos.id_trabajador,
      id_supervisor: datos.id_supervisor,
      id_inspector: datos.id_inspector || null,
      id_camara: datos.id_camara,
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
 * Formatea la respuesta del backend
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
 * ✅ FLUJO COMPLETO - SOLUCIÓN DEFINITIVA SIN ERRORES DE TIPOS
 * 
 * Recibe datos directamente del backend y los procesa
 */
export async function flujoCompletoAnalisisEPP(
  trabajadorDelBackend: any  // ✅ Sin restricciones de tipos
): Promise<ResultadoAnalisis> {
  let stream: MediaStream | null = null;
  
  try {
    console.log('\n🔍 === INICIANDO FLUJO EPP ===');
    console.log('📥 Datos recibidos del backend');
    
    // 1. ✅ VALIDAR que tenemos datos
    if (!trabajadorDelBackend) {
      throw new Error("❌ No hay datos del trabajador");
    }

    // 2. ✅ EXTRAER zona
    const zona = trabajadorDelBackend.zona;
    
    if (!zona || !zona.id_Zona) {
      console.error('❌ Estructura recibida:', trabajadorDelBackend);
      throw new Error("❌ El trabajador no tiene zona asignada.");
    }

    console.log(`✅ Zona validada: ${zona.nombreZona} (ID: ${zona.id_Zona})`);

    // 3. ✅ EXTRAER cámara
    let idCamara: number | null = null;

    // Intento 1: Cámara en la estructura principal
    if (trabajadorDelBackend.camara && trabajadorDelBackend.camara.id_camara) {
      idCamara = trabajadorDelBackend.camara.id_camara;
      console.log(`✅ Cámara física asignada: ${idCamara}`);
    } 
    // Intento 2: Generar ID de sesión si no hay cámara física
    else {
      console.log('⚠️  No hay cámara física, usando ID de sesión');
      
      let sessionId = sessionStorage.getItem('session_camera_id');
      if (!sessionId) {
        sessionId = Math.floor(Math.random() * 9999) + 1 + '';
        sessionStorage.setItem('session_camera_id', sessionId);
      }
      idCamara = parseInt(sessionId);
      console.log(`📷 ID Cámara de sesión: ${idCamara}`);
    }

    if (!idCamara || idCamara <= 0) {
      throw new Error("❌ No se pudo obtener ID de cámara válido");
    }
    
    // 4. Inicializar cámara del dispositivo
    console.log('📸 Solicitando acceso a cámara del dispositivo...');
    stream = await inicializarCamara();
    
    // 5. Esperar estabilización
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 6. Capturar frame
    console.log('🎬 Capturando frame...');
    const frameBase64 = await capturarFrameDesdeStream(stream);
    console.log('✅ Frame capturado');
    
    // 7. ✅ Analizar EPP con datos correctos
    const resultado = await analizarEPPDirecto({
      frame_base64: frameBase64,
      codigo_trabajador: trabajadorDelBackend.codigo_trabajador,
      id_empresa: trabajadorDelBackend.id_empresa,
      id_zona: zona.id_Zona,
      id_trabajador: trabajadorDelBackend.id_trabajador,
      id_supervisor: trabajadorDelBackend.id_supervisor_trabajador,
      id_inspector: trabajadorDelBackend.id_inspector || null,
      id_camara: idCamara,
      nombre_trabajador: trabajadorDelBackend.persona.nombre,
      apellido_trabajador: trabajadorDelBackend.persona.apellido,
    });
    
    console.log('✅ === FLUJO COMPLETADO ===\n');
    return resultado;
    
  } catch (error) {
    console.error('❌ Error en flujo EPP:', error instanceof Error ? error.message : 'Error desconocido');
    if (trabajadorDelBackend) {
      console.error('📥 Datos recibidos:', trabajadorDelBackend);
    }
    
    return {
      error: true,
      cumpleEpp: false,
      mensaje: error instanceof Error ? error.message : 'Error desconocido',
      detallesFallo: [error instanceof Error ? error.message : 'Error desconocido'],
    };
  } finally {
    if (stream) {
      detenerCamara(stream);
    }
  }
}

/**
 * Verifica soporte de cámara
 */
export function verificarSoporteCamara(): boolean {
  return !!(
    navigator.mediaDevices && 
    navigator.mediaDevices.getUserMedia
  );
}

/**
 * Verifica estado del servicio
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