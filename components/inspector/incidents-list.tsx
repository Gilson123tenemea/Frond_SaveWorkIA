"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, AlertTriangle, MapPin, Calendar, Eye } from "lucide-react"

const MOCK_INCIDENTS = [
  {
    id: 1,
    title: "Caída desde altura",
    type: "accident",
    severity: "critical",
    location: "Zona B - Producción",
    date: "2025-01-13",
    status: "investigating",
    reporter: "Maria Supervisor",
  },
  {
    id: 2,
    title: "Derrame de químicos",
    type: "spill",
    severity: "high",
    location: "Almacén de Materiales",
    date: "2025-01-11",
    status: "resolved",
    reporter: "Carlos Operario",
  },
  {
    id: 3,
    title: "Lesión menor en mano",
    type: "injury",
    severity: "medium",
    location: "Área de Montaje",
    date: "2025-01-09",
    status: "resolved",
    reporter: "Ana Torres",
  },
  {
    id: 4,
    title: "Falta de EPP detectada",
    type: "violation",
    severity: "medium",
    location: "Zona A - Almacén",
    date: "2025-01-08",
    status: "investigating",
    reporter: "Sistema IA",
  },
  {
    id: 5,
    title: "Equipo defectuoso",
    type: "equipment",
    severity: "low",
    location: "Línea de Producción 2",
    date: "2025-01-07",
    status: "resolved",
    reporter: "Pedro García",
  },
]

const INCIDENT_TYPES = {
  accident: "Accidente",
  injury: "Lesión",
  spill: "Derrame",
  violation: "Violación",
  equipment: "Equipo",
}

export function IncidentsList() {
  const [search, setSearch] = useState("")

  const filteredIncidents = MOCK_INCIDENTS.filter(
    (incident) =>
      incident.title.toLowerCase().includes(search.toLowerCase()) ||
      incident.location.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Registro de Incidentes</CardTitle>
            <CardDescription>Eventos de seguridad reportados y en seguimiento</CardDescription>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Reportar Incidente
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar incidente..."
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
                <TableHead>Incidente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Severidad</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          incident.severity === "critical"
                            ? "bg-destructive/10"
                            : incident.severity === "high"
                              ? "bg-orange-500/10"
                              : incident.severity === "medium"
                                ? "bg-yellow-500/10"
                                : "bg-blue-500/10"
                        }`}
                      >
                        <AlertTriangle
                          className={`w-4 h-4 ${
                            incident.severity === "critical"
                              ? "text-destructive"
                              : incident.severity === "high"
                                ? "text-orange-600"
                                : incident.severity === "medium"
                                  ? "text-yellow-600"
                                  : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{incident.title}</p>
                        <p className="text-xs text-muted-foreground">Reportado por: {incident.reporter}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{INCIDENT_TYPES[incident.type as keyof typeof INCIDENT_TYPES]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        incident.severity === "critical"
                          ? "destructive"
                          : incident.severity === "high"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {incident.severity === "critical"
                        ? "Crítico"
                        : incident.severity === "high"
                          ? "Alto"
                          : incident.severity === "medium"
                            ? "Medio"
                            : "Bajo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{incident.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{incident.date}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={incident.status === "resolved" ? "default" : "secondary"}>
                      {incident.status === "resolved" ? "Resuelto" : "Investigando"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
