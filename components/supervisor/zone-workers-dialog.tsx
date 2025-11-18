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

import { listarTrabajadoresNoAsignados } from "@/servicios/trabajador"
import {
  listarAsignacionesTrabajadorZona,
  crearAsignacionTrabajadorZona,
  eliminarAsignacionFisico,
} from "@/servicios/trabajador_zona"
import { getUser } from "@/lib/auth"

export function ZoneWorkersDialog({ open, onClose, zone }: any) {
  const [assignedWorkers, setAssignedWorkers] = useState<any[]>([])
  const [availableWorkers, setAvailableWorkers] = useState<any[]>([])
  const [selectedWorkerId, setSelectedWorkerId] = useState("")


  const loadRealWorkers = async () => {
    const user = getUser()
    if (!user || !user.id_supervisor) return

    try {
      const workers = await listarTrabajadoresNoAsignados(user.id_supervisor)

      const formatted = workers.map((t: any) => ({
        id: t.id_trabajador,
        name: `${t.persona.nombre} ${t.persona.apellido}`,
        cedula: t.persona.cedula,
        position: t.cargo,
      }))

      setAvailableWorkers(formatted)
    } catch (error) {
      console.error("❌ Error cargando trabajadores no asignados:", error)
    }
  }

 
  const loadAssignedWorkers = async () => {
    if (!zone) return

    try {
      const asignaciones = await listarAsignacionesTrabajadorZona()

      const filtered = asignaciones
        .filter((a: any) => a.id_zona_trabajadorzona === zone.id_Zona)
        .map((a: any) => ({
          asignacionId: a.id_trabajador_zona,
          id: a.trabajador.id_trabajador,
          name: `${a.trabajador.persona.nombre} ${a.trabajador.persona.apellido}`,
          cedula: a.trabajador.persona.cedula,
          position: a.trabajador.cargo,
        }))

      setAssignedWorkers(filtered)
    } catch (error) {
      console.error("❌ Error cargando asignados:", error)
    }
  }


  useEffect(() => {
    if (zone && open) {
      loadRealWorkers()
      loadAssignedWorkers()
    }
  }, [zone, open])


  const handleAssignWorker = async () => {
    if (!selectedWorkerId) return

    const payload = {
      id_trabajador_trabajadorzona: Number(selectedWorkerId),
      id_zona_trabajadorzona: zone.id,

    }

    try {
      await crearAsignacionTrabajadorZona(payload)

      // refrescar
      await loadRealWorkers()
      await loadAssignedWorkers()
      setSelectedWorkerId("")
    } catch (error) {
      console.error("❌ Error al asignar trabajador:", error)
    }
  }

  // ============================================================
  // 🔹 Eliminar asignación
  // ============================================================
  const handleDeleteAssigned = async (asignacionId: number) => {
    try {
      await eliminarAsignacionFisico(asignacionId)

      await loadRealWorkers()
      await loadAssignedWorkers()
    } catch (error) {
      console.error("❌ Error eliminando asignación:", error)
    }
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

          {/* Asignar Trabajador */}
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
                          {worker.name} — {worker.cedula}
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

          {/* Lista de asignados */}
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
                      key={worker.asignacionId}
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
                          <p className="text-xs text-muted-foreground">{worker.position}</p>
                          <p className="text-xs text-muted-foreground">{worker.cedula}</p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteAssigned(worker.asignacionId)}
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
