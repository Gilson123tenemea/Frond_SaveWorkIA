// src/servicios/reportes_inspector.js

import { BASE_URL } from './api';

/**
 * Servicio para obtener datos de estadísticas y reportes de inspectores
 */

class ReportesInspectorService {
  /**
   * Obtiene la empresa asignada a un inspector
   * @param {number} id_inspector - ID del inspector
   * @returns {Promise<{id_Empresa: number, nombreEmpresa: string}>}
   */
  async obtenerEmpresaPorInspector(id_inspector) {
    try {
      const response = await fetch(
        `${BASE_URL}/reportes/inspector/${id_inspector}/empresa`
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Inspector no encontrado`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener empresa:', error);
      throw error;
    }
  }

  /**
   * Obtiene las zonas asignadas a un inspector
   * @param {number} id_inspector - ID del inspector
   * @returns {Promise<{id_inspector: number, total_zonas: number, zonas: Array}>}
   */
  async obtenerZonasPorInspector(id_inspector) {
    try {
      const response = await fetch(
        `${BASE_URL}/reportes/inspector/${id_inspector}/zonas`
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudieron obtener las zonas`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener zonas:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de incumplimientos por zona
   * @param {number} id_inspector - ID del inspector
   * @param {number} id_empresa - ID de la empresa
   * @param {string} fecha_desde - Fecha inicio (YYYY-MM-DD)
   * @param {string} fecha_hasta - Fecha fin (YYYY-MM-DD)
   * @returns {Promise<{total: number, items: Array}>}
   */
  async obtenerIncumplimientosPorZona(
    id_inspector,
    id_empresa,
    fecha_desde = null,
    fecha_hasta = null
  ) {
    try {
      const params = new URLSearchParams({
        id_inspector,
        id_empresa,
      });

      if (fecha_desde) params.append('fecha_desde', fecha_desde);
      if (fecha_hasta) params.append('fecha_hasta', fecha_hasta);

      const response = await fetch(
        `${BASE_URL}/reportes/estadisticas/zonas-incumplimiento?${params}`
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudieron obtener los incumplimientos`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener incumplimientos:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de cumplimientos por zona
   * @param {number} id_inspector - ID del inspector
   * @param {number} id_empresa - ID de la empresa
   * @param {string} fecha_desde - Fecha inicio (YYYY-MM-DD)
   * @param {string} fecha_hasta - Fecha fin (YYYY-MM-DD)
   * @returns {Promise<{total: number, items: Array}>}
   */
  async obtenerCumplimientosPorZona(
    id_inspector,
    id_empresa,
    fecha_desde = null,
    fecha_hasta = null
  ) {
    try {
      const params = new URLSearchParams({
        id_inspector,
        id_empresa,
      });

      if (fecha_desde) params.append('fecha_desde', fecha_desde);
      if (fecha_hasta) params.append('fecha_hasta', fecha_hasta);

      const response = await fetch(
        `${BASE_URL}/reportes/estadisticas/zonas-cumplimiento?${params}`
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudieron obtener los cumplimientos`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener cumplimientos:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de EPP más cumplido (gráfico pastel)
   * @param {number} id_empresa - ID de la empresa
   * @param {number} id_inspector - ID del inspector (opcional)
   * @param {number} id_zona - ID de la zona (opcional)
   * @param {string} fecha_desde - Fecha inicio (YYYY-MM-DD)
   * @param {string} fecha_hasta - Fecha fin (YYYY-MM-DD)
   * @returns {Promise<{total: number, items: Array}>}
   */
  async obtenerEPPMasCumplido(
    id_empresa,
    id_inspector = null,
    id_zona = null,
    fecha_desde = null,
    fecha_hasta = null
  ) {
    try {
      const params = new URLSearchParams({
        id_empresa,
      });

      if (id_inspector) params.append('id_inspector', id_inspector);
      if (id_zona) params.append('id_zona', id_zona);
      if (fecha_desde) params.append('fecha_desde', fecha_desde);
      if (fecha_hasta) params.append('fecha_hasta', fecha_hasta);

      const response = await fetch(
        `${BASE_URL}/reportes/estadisticas/epp-pastel?${params}`
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudieron obtener los datos de EPP`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener EPP:', error);
      throw error;
    }
  }

  /**
   * Descarga PDF de trabajadores por zona
   * @param {number} id_inspector - ID del inspector
   * @param {number} id_zona - ID de la zona
   * @param {string} fecha_desde - Fecha inicio (YYYY-MM-DD)
   * @param {string} fecha_hasta - Fecha fin (YYYY-MM-DD)
   * @returns {Promise<Blob>}
   */
  async descargarPDFTrabajadoresZona(
    id_inspector,
    id_zona,
    fecha_desde,
    fecha_hasta
  ) {
    try {
      const params = new URLSearchParams({
        id_inspector,
        id_zona,
        fecha_desde,
        fecha_hasta,
      });

      const response = await fetch(
        `${BASE_URL}/reportes/pdf/trabajadores-zona?${params}`
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo descargar el PDF`);
      }
      
      const blob = await response.blob();
      
      // Crear descarga automática
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_trabajadores_${id_zona}_${fecha_desde}_${fecha_hasta}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return blob;
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      throw error;
    }
  }

  /**
   * Descarga EXCEL de asistencia por zona
   * @param {number} id_inspector - ID del inspector
   * @param {number} id_zona - ID de la zona
   * @param {string} fecha_desde - Fecha inicio (YYYY-MM-DD)
   * @param {string} fecha_hasta - Fecha fin (YYYY-MM-DD)
   * @returns {Promise<Blob>}
   */
  async descargarEXCELAsistencia(
    id_inspector,
    id_zona,
    fecha_desde,
    fecha_hasta
  ) {
    try {
      const params = new URLSearchParams({
        id_inspector,
        id_zona,
        fecha_desde,
        fecha_hasta,
      });

      const response = await fetch(
        `${BASE_URL}/reportes/excel/asistencia?${params}`
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo descargar el EXCEL`);
      }
      
      const blob = await response.blob();
      
      // Crear descarga automática
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `asistencia_${id_zona}_${fecha_desde}_${fecha_hasta}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return blob;
    } catch (error) {
      console.error('Error al descargar EXCEL:', error);
      throw error;
    }
  }
}

export default new ReportesInspectorService();