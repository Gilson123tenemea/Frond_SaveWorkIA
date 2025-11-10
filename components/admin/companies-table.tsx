"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Building2, Users, Camera, Pencil, MapPin } from "lucide-react"
import { getCompanies, type Company } from "@/lib/storage"
import { CompanyDialog } from "./company-dialog"
import { ZonesDialog } from "./zones-dialog"

export function CompaniesTable() {
  const [search, setSearch] = useState("")
  const [companies, setCompanies] = useState<Company[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [zonesCompanyId, setZonesCompanyId] = useState<number | null>(null)

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = () => {
    setCompanies(getCompanies())
  }

  const filteredCompanies = companies.filter((company) => company.name.toLowerCase().includes(search.toLowerCase()))

  const handleAdd = () => {
    setEditingCompany(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (company: Company) => {
    setEditingCompany(company)
    setIsDialogOpen(true)
  }

  const handleSuccess = () => {
    loadCompanies()
    setIsDialogOpen(false)
    setEditingCompany(null)
  }

  const handleViewZones = (companyId: number) => {
    setZonesCompanyId(companyId)
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
                  <TableHead>Empresa</TableHead>
                  <TableHead>Trabajadores</TableHead>
                  <TableHead>Zonas</TableHead>
                  <TableHead>Cámaras</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {company.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{company.workers}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{company.zones}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-muted-foreground" />
                        <span>{company.cameras}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={company.plan === "Enterprise" ? "default" : "secondary"}>{company.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={company.status === "active" ? "default" : "outline"}>
                        {company.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewZones(company.id)}>
                          <MapPin className="w-4 h-4 mr-2" />
                          Zonas
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(company)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CompanyDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        company={editingCompany}
        onSuccess={handleSuccess}
      />

      <ZonesDialog
        open={zonesCompanyId !== null}
        onOpenChange={(open) => !open && setZonesCompanyId(null)}
        companyId={zonesCompanyId}
        onSuccess={loadCompanies}
      />
    </>
  )
}
