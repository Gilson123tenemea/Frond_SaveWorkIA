"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Building2, Pencil, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// 🔹 Importa los servicios reales
import { listarEmpresas } from "../../servicios/empresa"

// 🔹 Importa el modal corregido
import { EmpresaDialog } from "./company-dialog"
import { ZonesDialog } from "./zones-dialog"

export function CompaniesTable() {
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [companies, setCompanies] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<any | null>(null)
  const [zonesCompanyId, setZonesCompanyId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  // =============================
  // 🔹 Cargar empresas desde API
  // =============================
  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      setLoading(true)
      const data = await listarEmpresas()
      setCompanies(data)
    } catch (error: any) {
      toast({
        title: "Error al cargar empresas",
        description: error.message || "No se pudieron obtener las empresas desde el servidor",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // =============================
  // 🔹 Filtrar empresas por nombre
  // =============================
  const filteredCompanies = companies.filter((empresa) =>
    empresa.nombreEmpresa.toLowerCase().includes(search.toLowerCase())
  )

  // =============================
  // 🔹 Abrir modal para crear empresa
  // =============================
  const handleAdd = () => {
    setEditingCompany(null)
    setIsDialogOpen(true)
  }

  // 🔹 Abrir modal para editar empresa
  const handleEdit = (empresa: any) => {
    setEditingCompany(empresa)
    setIsDialogOpen(true)
  }

  // 🔹 Recargar al guardar o actualizar
  const handleSuccess = () => {
    loadCompanies()
    setIsDialogOpen(false)
    setEditingCompany(null)
  }

  // 🔹 Ver zonas (placeholder)
  const handleViewZones = (empresaId: number) => {
    setZonesCompanyId(empresaId)
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
                {filteredCompanies.map((empresa) => (
                  <TableRow key={empresa.id_Empresa}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{empresa.nombreEmpresa}</p>
                          <p className="text-xs text-muted-foreground">ID: {empresa.id_Empresa}</p>
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
                        <Button variant="ghost" size="sm" onClick={() => handleViewZones(empresa.id_Empresa)}>
                          <MapPin className="w-4 h-4 mr-2" />
                          Zonas
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(empresa)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredCompanies.length === 0 && (
                  <TableRow>
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

      {/* Modal de registro / edición */}
      <EmpresaDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        empresa={editingCompany}
        onSuccess={handleSuccess}
      />

      {/* Modal de zonas */}
      <ZonesDialog
        open={zonesCompanyId !== null}
        onOpenChange={(open) => !open && setZonesCompanyId(null)}
        companyId={zonesCompanyId}
        onSuccess={loadCompanies}
      />
    </>
  )
}
