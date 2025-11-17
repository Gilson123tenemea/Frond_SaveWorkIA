"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, UserCheck } from "lucide-react"
import { getZones, getUsers, getInspectorsByZone, type Zone } from "@/lib/storage"
import { getUser } from "@/lib/auth"

// 👇 AGREGAR IMPORT
import { ZoneAssignForm } from "./zone-assignment-dialog"

export function ZoneAssignmentsTable() {
  const currentUser = getUser()
  const [zones, setZones] = useState<Zone[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  const loadData = () => {
    const users = getUsers()
    const supervisorUser = users.find((u) => u.email === currentUser?.email)
    if (supervisorUser?.companyId) {
      const allZones = getZones()
      const companyZones = allZones.filter((z) => z.companyId === supervisorUser.companyId)
      setZones(companyZones)
    }
  }

  useEffect(() => {
    loadData()
  }, [currentUser])

  const getAssignedInspectors = (zoneId: number) => {
    return getInspectorsByZone(zoneId)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Asignación de Inspectores a Zonas</CardTitle>
          <CardDescription>Gestiona qué inspectores supervisan cada zona</CardDescription>
        </CardHeader>

        <CardContent>

          {/* 🔵 BOTÓN QUE FALTABA */}
          <div className="flex justify-end mb-4">
            <Button onClick={() => setDialogOpen(true)}>
              Agregar Asignación
            </Button>
          </div>

          {/* 🔵 TABLA */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zona</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Inspectores Asignados</TableHead>
                  <TableHead>Cámaras</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No hay zonas registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  zones.map((zone) => {
                    const assignedInspectors = getAssignedInspectors(zone.id)
                    return (
                      <TableRow key={zone.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <MapPin className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{zone.name}</p>
                              <p className="text-xs text-muted-foreground">ID: {zone.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="text-muted-foreground">Lat: {zone.latitude}</p>
                            <p className="text-muted-foreground">Long: {zone.longitude}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {assignedInspectors.length === 0 ? (
                            <Badge variant="outline">Sin asignar</Badge>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {assignedInspectors.map((inspector) => (
                                <Badge key={inspector.id} variant="default" className="text-xs">
                                  {inspector.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{zone.cameras} cámaras</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <UserCheck className="w-4 h-4 mr-2" />
                            Asignar
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 🔵 FORMULARIO QUE SE ABRE */}
      <ZoneAssignForm 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
      />
    </>
  )
}
