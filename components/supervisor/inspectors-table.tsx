"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Pencil, Trash2, Phone, Mail } from "lucide-react"
import { getInspectors, deleteInspector, getUsers, type Inspector } from "@/lib/storage"
import { getUser } from "@/lib/auth"
import { InspectorDialog } from "./inspector-dialog"

export function InspectorsTable() {
  const currentUser = getUser()
  const [inspectors, setInspectors] = useState<Inspector[]>([])
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingInspector, setEditingInspector] = useState<Inspector | null>(null)

  const loadInspectors = () => {
    const users = getUsers()
    const supervisorUser = users.find((u) => u.email === currentUser?.email)
    if (supervisorUser?.companyId) {
      const allInspectors = getInspectors()
      const companyInspectors = allInspectors.filter((i) => i.companyId === supervisorUser.companyId)
      setInspectors(companyInspectors)
    }
  }

  useEffect(() => {
    loadInspectors()
  }, [currentUser])

  const filteredInspectors = inspectors.filter(
    (inspector) =>
      inspector.name.toLowerCase().includes(search.toLowerCase()) ||
      inspector.email.toLowerCase().includes(search.toLowerCase()),
  )

  const handleDelete = (id: number) => {
    if (confirm("¿Está seguro de eliminar este inspector?")) {
      deleteInspector(id)
      loadInspectors()
    }
  }

  const handleEdit = (inspector: Inspector) => {
    setEditingInspector(inspector)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingInspector(null)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingInspector(null)
    loadInspectors()
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inspectores Registrados</CardTitle>
              <CardDescription>Personal de inspección asignado a tu empresa</CardDescription>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Inspector
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar inspector..."
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
                  <TableHead>Inspector</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInspectors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No hay inspectores registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInspectors.map((inspector) => (
                    <TableRow key={inspector.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{inspector.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{inspector.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {inspector.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{inspector.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{inspector.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={inspector.status === "active" ? "default" : "outline"}>
                          {inspector.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(inspector)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(inspector.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <InspectorDialog open={dialogOpen} onClose={handleDialogClose} inspector={editingInspector} />
    </>
  )
}
