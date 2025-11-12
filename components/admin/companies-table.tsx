"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Building2, Pencil, MapPin, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

// Servicios del backend
import { listarEmpresas, eliminarEmpresa } from "../../servicios/empresa"

// Componentes del panel
import { EmpresaDialog } from "./company-dialog"
import { ZonesDialog } from "./zones-dialog"

export function CompaniesTable() {
  const [search, setSearch] = useState("")
  const [companies, setCompanies] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<any | null>(null)
  const [zonesCompanyId, setZonesCompanyId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCompanies()
  }, [])

  // 🔹 Cargar empresas desde backend
  const loadCompanies = async () => {
    try {
      setLoading(true)
      const data = await listarEmpresas()
      const activas = data.filter((empresa: any) => empresa.borrado === true || empresa.borrado === 1)
      setCompanies(activas)
    } catch (error: any) {
      toast.error(error.message || "No se pudieron obtener las empresas")
    } finally {
      setLoading(false)
    }
  }

  // 🔍 Filtro de búsqueda
  const filteredCompanies = companies.filter((empresa) =>
    (empresa.nombreEmpresa ?? "").toLowerCase().includes(search.toLowerCase())
  )

  // 🧩 Abrir modal de registro
  const handleAdd = () => {
    setEditingCompany(null)
    setIsDialogOpen(true)
  }

  // ✏️ Editar empresa
  const handleEdit = (empresa: any) => {
    setEditingCompany(empresa)
    setIsDialogOpen(true)
  }

  // ✅ Al guardar o editar correctamente
  const handleSuccess = () => {
    loadCompanies()
    setIsDialogOpen(false)
    setEditingCompany(null)
  }

  // 📍 Ver zonas de una empresa (manejo seguro del ID)
  const handleViewZones = (empresa: any) => {
    const empresaId = empresa.id_Empresa ?? empresa.id_empresa ?? empresa.id ?? null
    if (!empresaId) {
      toast.error("❌ No se pudo identificar la empresa seleccionada")
      return
    }
    console.log("📡 Abriendo zonas para empresa ID:", empresaId)
    setZonesCompanyId(empresaId)
  }

  // 🗑️ Eliminar empresa (confirmación visual)
  const handleDelete = async (empresaId: number, nombreEmpresa: string) => {
    const overlay = document.createElement("div")
    overlay.style.position = "fixed"
    overlay.style.top = "0"
    overlay.style.left = "0"
    overlay.style.width = "100vw"
    overlay.style.height = "100vh"
    overlay.style.background = "rgba(0,0,0,0.4)"
    overlay.style.zIndex = "999"
    overlay.style.transition = "opacity 0.3s ease"
    document.body.appendChild(overlay)

    toast(
      (t) => (
        <div className="flex flex-col gap-4 p-2 text-center">
          <p className="text-base font-semibold text-gray-800">
            ¿Estás seguro de eliminar la empresa <b>{nombreEmpresa}</b>?
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                toast.dismiss(t.id)
                document.body.removeChild(overlay)
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t.id)
                document.body.removeChild(overlay)

                const promise = eliminarEmpresa(empresaId)

                toast.promise(
                  promise,
                  {
                    loading: "Eliminando empresa...",
                    success: `Empresa "${nombreEmpresa}" eliminada correctamente`,
                    error: "❌ Error al eliminar la empresa",
                  },
                  {
                    style: {
                      background: "#dc2626",
                      color: "#fff",
                      borderRadius: "8px",
                      fontWeight: 500,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                    },
                    iconTheme: {
                      primary: "#fff",
                      secondary: "#b91c1c",
                    },
                  }
                )

                try {
                  await promise
                  await loadCompanies()
                } catch (err) {
                  console.error("Error al eliminar:", err)
                }
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      ),
      {
        duration: 8000,
        position: "top-center",
        style: {
          background: "#fff",
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          borderRadius: "12px",
          padding: "20px",
          width: "380px",
        },
      }
    )

    setTimeout(() => {
      if (document.body.contains(overlay)) {
        overlay.style.opacity = "0"
        setTimeout(() => {
          if (document.body.contains(overlay)) document.body.removeChild(overlay)
        }, 300)
      }
    }, 8000)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Empresas Registradas</CardTitle>
              <CardDescription>Gestiona todas las empresas del sistema</CardDescription>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Empresa
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* 🔍 Barra de búsqueda */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empresa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* 📋 Tabla de empresas */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>RUC</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCompanies.map((empresa, index) => (
                  <TableRow key={empresa.id_Empresa ?? `empresa-${index}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{empresa.nombreEmpresa}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {empresa.id_Empresa ?? empresa.id_empresa ?? "?"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{empresa.ruc}</TableCell>
                    <TableCell>{empresa.telefono}</TableCell>
                    <TableCell>{empresa.correo}</TableCell>
                    <TableCell>{empresa.sector}</TableCell>
                    <TableCell>
                      <Badge variant={empresa.borrado ? "default" : "outline"}>
                        {empresa.borrado ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewZones(empresa)}>
                          <MapPin className="w-4 h-4 mr-2" />
                          Zonas
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(empresa)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() =>
                            handleDelete(
                              empresa.id_Empresa ?? empresa.id_empresa ?? 0,
                              empresa.nombreEmpresa
                            )
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredCompanies.length === 0 && (
                  <TableRow key="no-companies">
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      {loading ? "Cargando empresas..." : "No se encontraron empresas registradas"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 🟩 Modal de registro / edición */}
      <EmpresaDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        empresa={editingCompany}
        onSuccess={handleSuccess}
      />

      {/* 🟨 Modal de zonas */}
      <ZonesDialog
        open={zonesCompanyId !== null}
        onOpenChange={(open) => !open && setZonesCompanyId(null)}
        companyId={zonesCompanyId}
        onSuccess={loadCompanies}
      />
    </>
  )
}
