  import { BASE_URL } from "./api";

  const EMPRESA_URL = `${BASE_URL}/empresas`;

  // ============================
  // 📌 Crear una nueva empresa
  // ============================
  export async function crearEmpresa(empresaData) {
    try {
      const response = await fetch(`${EMPRESA_URL}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empresaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al crear la empresa");
      }

      return await response.json();
    } catch (error) {
      //console.error("❌ Error en crearEmpresa:", error);
      throw error;
    }
  }

  // ============================
  // 📌 Listar todas las empresas
  // ============================
  export async function listarEmpresas() {
    try {
      const response = await fetch(`${EMPRESA_URL}/`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Error al obtener las empresas");
      }

      const data = await response.json();

      // 🧠 Normaliza los nombres para que sirvan tanto en tabla como en combo
      return data.map((empresa) => ({
        // IDs compatibles
        id_empresa: empresa.id_empresa ?? empresa.id_Empresa ?? empresa.id,
        id_Empresa: empresa.id_Empresa ?? empresa.id_empresa ?? empresa.id,

        // Nombres compatibles
        nombre: empresa.nombre ?? empresa.nombreEmpresa ?? empresa.name ?? "",
        nombreEmpresa: empresa.nombreEmpresa ?? empresa.nombre ?? empresa.name ?? "",

        // Otros campos
        direccion: empresa.direccion ?? empresa.direccionEmpresa ?? "",
        telefono: empresa.telefono ?? "",
        correo: empresa.correo ?? "",
        sector: empresa.sector ?? "",
        ruc: empresa.ruc ?? "",
        borrado: empresa.borrado ?? true,
      }));
    } catch (error) {
      console.error("❌ Error en listarEmpresas:", error);
      return [];
    }
  }

  // ============================
  // 📌 Obtener empresa por ID
  // ============================
  export async function obtenerEmpresaPorId(id) {
    try {
      const response = await fetch(`${EMPRESA_URL}/${id}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Empresa no encontrada");
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Error en obtenerEmpresaPorId:", error);
      throw error;
    }
  }

  // ============================
  // 📌 Actualizar empresa
  // ============================
  export async function actualizarEmpresa(id, empresaData) {
    try {
      const response = await fetch(`${EMPRESA_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empresaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al actualizar la empresa");
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Error en actualizarEmpresa:", error);
      throw error;
    }
  }

  // ============================
  // 📌 Eliminar empresa (lógica)
  // ============================
  export async function eliminarEmpresa(id) {
    try {
      const response = await fetch(`${EMPRESA_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la empresa");
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Error en eliminarEmpresa:", error);
      throw error;
    }
  }
