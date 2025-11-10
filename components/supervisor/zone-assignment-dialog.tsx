"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  getInspectors,
  getUsers,
  getZoneInspectorAssignments,
  saveZoneInspectorAssignment,
  deleteZoneInspectorAssignment,
  type Zone,
  type Inspector,
} from "@/lib/storage"
import { getUser } from "@/lib/auth"

interface ZoneAssignmentDialogProps {
  open: boolean
  onClose: () => void
  zone: Zone | null
}

export function ZoneAssignmentDialog({ open, onClose, zone }: ZoneAssignmentDialogProps) {
  const currentUser = getUser()
  const [inspectors, setInspectors] = useState<Inspector[]>([])
  const [selectedInspectors, setSelectedInspectors] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    if (zone && open) {
      // Load inspectors from the same company
      const users = getUsers()
      const supervisorUser = users.find((u) => u.email === currentUser?.email)
      if (supervisorUser?.companyId) {
        const allInspectors = getInspectors()
        const companyInspectors = allInspectors.filter(
          (i) => i.companyId === supervisorUser.companyId && i.status === "active",
        )
        setInspectors(companyInspectors)

        // Load current assignments
        const assignments = getZoneInspectorAssignments()
        const zoneAssignments = assignments.filter((a) => a.zoneId === zone.id).map((a) => a.inspectorId)
        setSelectedInspectors(zoneAssignments)
        setSelectAll(zoneAssignments.length === companyInspectors.length && companyInspectors.length > 0)
      }
    }
  }, [zone, open, currentUser])

  const handleToggleInspector = (inspectorId: number) => {
    setSelectedInspectors((prev) => {
      if (prev.includes(inspectorId)) {
        return prev.filter((id) => id !== inspectorId)
      } else {
        return [...prev, inspectorId]
      }
    })
  }

  const handleToggleAll = () => {
    if (selectAll) {
      setSelectedInspectors([])
    } else {
      setSelectedInspectors(inspectors.map((i) => i.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSubmit = () => {
    if (!zone) return

    const users = getUsers()
    const supervisorUser = users.find((u) => u.email === currentUser?.email)
    if (!supervisorUser?.companyId) return

    // Remove all current assignments
    const assignments = getZoneInspectorAssignments()
    assignments
      .filter((a) => a.zoneId === zone.id)
      .forEach((a) => {
        deleteZoneInspectorAssignment(zone.id, a.inspectorId)
      })

    // Add new assignments
    selectedInspectors.forEach((inspectorId) => {
      saveZoneInspectorAssignment({
        zoneId: zone.id,
        inspectorId,
        companyId: supervisorUser.companyId!,
      })
    })

    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Asignar Inspectores</DialogTitle>
          <DialogDescription>Selecciona los inspectores que supervisarán la zona: {zone?.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {inspectors.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No hay inspectores disponibles. Registra inspectores primero.
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2 pb-3 border-b">
                <Checkbox id="select-all" checked={selectAll} onCheckedChange={handleToggleAll} />
                <Label htmlFor="select-all" className="font-semibold cursor-pointer">
                  Seleccionar Todos
                </Label>
                <Badge variant="outline" className="ml-auto">
                  {selectedInspectors.length} seleccionados
                </Badge>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {inspectors.map((inspector) => (
                  <div
                    key={inspector.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={`inspector-${inspector.id}`}
                      checked={selectedInspectors.includes(inspector.id)}
                      onCheckedChange={() => handleToggleInspector(inspector.id)}
                    />
                    <Label htmlFor={`inspector-${inspector.id}`} className="flex-1 cursor-pointer">
                      <p className="font-medium">{inspector.name}</p>
                      <p className="text-xs text-muted-foreground">{inspector.email}</p>
                    </Label>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={inspectors.length === 0}>
            Guardar Asignaciones
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
