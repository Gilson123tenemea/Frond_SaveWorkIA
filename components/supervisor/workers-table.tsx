"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MapPin, HardHat, Shield, Plus, Pencil, Trash2 } from "lucide-react"
import { getWorkers, deleteWorker, getUsers, type Worker } from "@/lib/storage"
import { getUser } from "@/lib/auth"
import { WorkerDialog } from "./worker-dialog"
// </CHANGE>

export function WorkersTable() {
  const currentUser = getUser()
  const [workers, setWorkers] = useState<Worker[]>([])
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null)

  const loadWorkers = () => {
    const users = getUsers()
    const supervisorUser = users.find((u) => u.email === currentUser?.email)
    if (supervisorUser?.companyId) {
      const allWorkers = getWorkers()
      const companyWorkers = allWorkers.filter((w) => w.companyId === supervisorUser.companyId)
      setWorkers(companyWorkers)
    }
  }

  useEffect(() => {
    loadWorkers()
  }, [currentUser])

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(search.toLowerCase()) ||
      worker.position.toLowerCase().includes(search.toLowerCase()) ||
      worker.dni.includes(search),
  )

  const handleDelete = (id: number) => {
    if (confirm("¿Está seguro de eliminar este trabajador?")) {
      deleteWorker(id)
      loadWorkers()
    }
  }

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingWorker(null)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingWorker(null)
    loadWorkers()
  }

  // Mock PPE status for display
  const getWorkerPPE = (workerId: number) => {
    return Math.random() > 0.3 ? "complete" : "incomplete"
  }
  // </CHANGE>

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Trabajadores Registrados</CardTitle>
              <CardDescription>Personal asignado a tu supervisión</CardDescription>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Trabajador
            </Button>
          </div>
          {/* </CHANGE> */}
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar trabajador..."
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
                  <TableHead>Trabajador</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Zona Actual</TableHead>
                  <TableHead>Turno</TableHead>
                  <TableHead>EPP</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No hay trabajadores registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWorkers.map((worker) => {
                    const ppe = getWorkerPPE(worker.id)
                    return (
                      <TableRow key={worker.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{worker.name}</p>
                              <p className="text-xs text-muted-foreground">ID: {worker.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{worker.dni}</TableCell>
                        <TableCell>{worker.position}</TableCell>
                        <TableCell>
                          {worker.zone ? (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{worker.zone}</span>
                            </div>
                          ) : (
                            <Badge variant="outline">Sin asignar</Badge>
                          )}
                        </TableCell>
                        <TableCell>{worker.shift}</TableCell>
                        <TableCell>
                          <Badge variant={ppe === "complete" ? "default" : "destructive"} className="gap-1">
                            {ppe === "complete" ? (
                              <>
                                <Shield className="w-3 h-3" />
                                Completo
                              </>
                            ) : (
                              <>
                                <HardHat className="w-3 h-3" />
                                Incompleto
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={worker.status === "active" ? "default" : "outline"}>
                            {worker.status === "active" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(worker)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(worker.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
                {/* </CHANGE> */}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <WorkerDialog open={dialogOpen} onClose={handleDialogClose} worker={editingWorker} />
      {/* </CHANGE> */}
    </>
  )
}
