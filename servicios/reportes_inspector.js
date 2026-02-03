// src/servicios/reportes_inspector.js

import { BASE_URL } from "./api";
import jsPDF from "jspdf";

/**
 * Servicio para obtener datos de estadísticas y reportes de inspectores
 */
class ReportesInspectorService {

  // ===============================
  // EMPRESA POR INSPECTOR
  // ===============================
  async obtenerEmpresaPorInspector(id_inspector) {
    const response = await fetch(
      `${BASE_URL}/reportes/inspector/${id_inspector}/empresa`
    );

    if (!response.ok) {
      throw new Error("Inspector no encontrado");
    }

    return await response.json();
  }

  // ===============================
  // ZONAS POR INSPECTOR
  // ===============================
  async obtenerZonasPorInspector(id_inspector) {
    const response = await fetch(
      `${BASE_URL}/reportes/inspector/${id_inspector}/zonas`
    );

    if (!response.ok) {
      throw new Error("No se pudieron obtener las zonas");
    }

    return await response.json();
  }

  // ===============================
  // INCUMPLIMIENTOS POR ZONA
  // ===============================
  async obtenerIncumplimientosPorZona(
    id_inspector,
    id_empresa,
    fecha_desde,
    fecha_hasta
  ) {
    const params = new URLSearchParams({
      id_inspector,
      id_empresa,
      fecha_desde,
      fecha_hasta,
    });

    const response = await fetch(
      `${BASE_URL}/reportes/estadisticas/zonas-incumplimiento?${params}`
    );

    if (!response.ok) {
      throw new Error("No se pudieron obtener los incumplimientos");
    }

    return await response.json();
  }

  // ===============================
  // CUMPLIMIENTOS POR ZONA
  // ===============================
  async obtenerCumplimientosPorZona(
    id_inspector,
    id_empresa,
    fecha_desde,
    fecha_hasta
  ) {
    const params = new URLSearchParams({
      id_inspector,
      id_empresa,
      fecha_desde,
      fecha_hasta,
    });

    const response = await fetch(
      `${BASE_URL}/reportes/estadisticas/zonas-cumplimiento?${params}`
    );

    if (!response.ok) {
      throw new Error("No se pudieron obtener los cumplimientos");
    }

    return await response.json();
  }

  // ===============================
  // EPP MÁS CUMPLIDO (PASTEL)
  // ===============================
  async obtenerEPPMasCumplido(
    id_empresa,
    id_inspector,
    id_zona,
    fecha_desde,
    fecha_hasta
  ) {
    const params = new URLSearchParams({ id_empresa });

    if (id_inspector) params.append("id_inspector", id_inspector);
    if (id_zona) params.append("id_zona", id_zona);
    if (fecha_desde) params.append("fecha_desde", fecha_desde);
    if (fecha_hasta) params.append("fecha_hasta", fecha_hasta);

    const response = await fetch(
      `${BASE_URL}/reportes/estadisticas/epp-pastel?${params}`
    );

    if (!response.ok) {
      throw new Error("No se pudieron obtener los datos de EPP");
    }

    return await response.json();
  }

  // ===============================
  // ✅ PDF TRABAJADORES POR ZONA
  // ===============================
  async descargarPDFTrabajadoresZona(
    id_inspector,
    id_zona,
    fecha_desde,
    fecha_hasta
  ) {
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
      const error = await response.json();
      throw new Error(error.detail || "No hay registros para generar el PDF");
    }

    // 🔥 BACKEND DEVUELVE JSON
    const data = await response.json();

    // 🧾 GENERAR PDF
    const pdf = new jsPDF();
    let y = 10;

    pdf.setFontSize(16);
    pdf.text("Reporte de Incumplimientos por Zona", 10, y);
    y += 10;

    pdf.setFontSize(11);
    pdf.text(`Zona ID: ${id_zona}`, 10, y);
    y += 6;
    pdf.text(`Desde: ${fecha_desde}  Hasta: ${fecha_hasta}`, 10, y);
    y += 10;

    data.forEach((item, index) => {
      pdf.setFontSize(12);
      pdf.text(
        `${index + 1}. ${item.trabajador.nombre} ${item.trabajador.apellido}`,
        10,
        y
      );
      y += 6;

      pdf.setFontSize(10);
      pdf.text(`Cédula: ${item.trabajador.cedula}`, 10, y);
      y += 5;

      pdf.text(`Zona: ${item.camara.zona}`, 10, y);
      y += 5;

      pdf.text(
        `Incumple: ${item.detecciones.join(", ")}`,
        10,
        y
      );
      y += 6;

      // 📸 Imagen
      if (item.evidencia?.foto_base64) {
        pdf.addImage(
          `data:image/jpeg;base64,${item.evidencia.foto_base64}`,
          "JPEG",
          10,
          y,
          60,
          40
        );
        y += 45;
      }

      y += 5;

      if (y > 260) {
        pdf.addPage();
        y = 10;
      }
    });

    pdf.save(
      `reporte_trabajadores_zona_${id_zona}_${fecha_desde}_${fecha_hasta}.pdf`
    );
  }

  // ===============================
  // EXCEL ASISTENCIA
  // ===============================
  async descargarEXCELAsistencia(
    id_inspector,
    id_zona,
    fecha_desde,
    fecha_hasta
  ) {
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
      throw new Error("No se pudo descargar el EXCEL");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `asistencia_zona_${id_zona}_${fecha_desde}_${fecha_hasta}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export default new ReportesInspectorService();
