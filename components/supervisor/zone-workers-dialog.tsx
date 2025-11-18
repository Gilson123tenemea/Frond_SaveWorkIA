"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, UserPlus, Users, MapPin } from "lucide-react"

interface ZoneWorkersDialogProps {
  open: boolean
  onClose: () => void
  zone: any | null
}

export function ZoneWorkersDialog({ open, onClose, zone }: ZoneWorkersDialogProps) {
  const [assignedWorkers, setAssignedWorkers] = useState<any[]>([])
  const [availableWorkers, setAvailableWorkers] = useState<any[]>([])
  const [selectedWorkerId, setSelectedWorkerId] = useState("")

  // MOCK DATA — evita errores y mantiene el diseño
  const MOCK_WORKERS = [
    { id: 1, name: "Luis Andrade", position: "Operario", shift: "Mañana", status: "active" },
    { id: 2, name: "Andrea Pérez", position: "Técnico", shift: "Tarde", status: "active" },
    { id: 3, name: "Carlos Molina", position: "Auxiliar", shift: "Noche", status: "inactive" },
  ]

  useEffect(() => {
    if (zone && open) {
      loadMockWorkers()
    }
  }, [zone, open])

  const loadMockWorkers = () => {
    // Mostrar un asignado y dos disponibles (solo diseño)
    setAssignedWorkers([MOCK_WORKERS[0]])
    setAvailableWorkers([MOCK_WORKERS[1], MOCK_WORKERS[2]])
  }

  const handleAssignWorker = () => {
    if (!selectedWorkerId) return

    const worker = availableWorkers.find((w) => w.id.toString() === selectedWorkerId)
    if (!worker) return

    setAssignedWorkers((prev) => [...prev, worker])
    setAvailableWorkers((prev) => prev.filter((w) => w.id !== worker.id))
    setSelectedWorkerId("")
  }

  const handleRemoveWorker = (workerId: number) => {
    const worker = assignedWorkers.find((w) => w.id === workerId)
    if (!worker) return

    setAssignedWorkers((prev) => prev.filter((w) => w.id !== workerId))
    setAvailableWorkers((prev) => [...prev, worker])
  }

  if (!zone) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Gestionar Trabajadores — {zone.name}
          </DialogTitle>
          <DialogDescription>Asigna y administra los trabajadores de esta zona</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Asignar trabajador */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-muted-foreground" />
                Asignar Trabajador
              </h3>

              <div className="flex gap-2">
                <Select value={selectedWorkerId} onValueChange={setSelectedWorkerId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecciona un trabajador" />
                  </SelectTrigger>

                  <SelectContent>
                    {availableWorkers.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No hay trabajadores disponibles
                      </div>
                    ) : (
                      availableWorkers.map((worker) => (
                        <SelectItem key={worker.id} value={worker.id.toString()}>
                          {worker.name} — {worker.position}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                <Button disabled={!selectedWorkerId} onClick={handleAssignWorker}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Asignar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de trabajadores asignados */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Trabajadores Asignados
                </h3>
                <Badge variant="secondary">{assignedWorkers.length} trabajadores</Badge>
              </div>

              {assignedWorkers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-10 h-10 mx-auto opacity-30 mb-2" />
                  <p>No hay trabajadores asignados</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {assignedWorkers.map((worker) => (
                    <div
                      key={worker.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            {worker.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-medium">{worker.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {worker.position} — {worker.shift}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveWorker(worker.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
