"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, MapPin, Calendar, Eye, Edit } from "lucide-react"

const MOCK_INSPECTIONS = [
  {
    id: 1,
    title: "Inspección de EPP",
    location: "Almacén Principal",
    date: "2025-01-15",
    status: "completed",
    score: 94,
    inspector: "Juan Inspector",
  },
  {
    id: 2,
    title: "Auditoría de Extintores",
    location: "Todas las Áreas",
    date: "2025-01-12",
    status: "completed",
    score: 88,
    inspector: "Juan Inspector",
  },
  {
    id: 3,
    title: "Revisión de Señalización",
    location: "Zona de Producción",
    date: "2025-01-10",
    status: "completed",
    score: 92,
    inspector: "Juan Inspector",
  },
  {
    id: 4,
    title: "Inspección de Emergencia",
    location: "Salidas de Emergencia",
    date: "2025-01-08",
    status: "pending",
    score: null,
    inspector: "Juan Inspector",
  },
  {
    id: 5,
    title: "Revisión de Iluminación",
    location: "Áreas Comunes",
    date: "2025-01-05",
    status: "in-progress",
    score: null,
    inspector: "Juan Inspector",
  },
]

export function InspectionsList() {
  const [search, setSearch] = useState("")

  const filteredInspections = MOCK_INSPECTIONS.filter(
    (inspection) =>
      inspection.title.toLowerCase().includes(search.toLowerCase()) ||
      inspection.location.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Historial de Inspecciones</CardTitle>
            <CardDescription>Todas las inspecciones realizadas y programadas</CardDescription>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Inspección
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar inspección..."
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
                <TableHead>Inspección</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Puntuación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{inspection.title}</p>
                      <p className="text-xs text-muted-foreground">ID: {inspection.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{inspection.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{inspection.date}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        inspection.status === "completed"
                          ? "default"
                          : inspection.status === "in-progress"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {inspection.status === "completed"
                        ? "Completada"
                        : inspection.status === "in-progress"
                          ? "En Progreso"
                          : "Pendiente"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {inspection.score ? (
                      <span
                        className={`font-semibold ${
                          inspection.score >= 90
                            ? "text-success"
                            : inspection.score >= 70
                              ? "text-yellow-600"
                              : "text-destructive"
                        }`}
                      >
                        {inspection.score}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {inspection.status === "completed" ? (
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Continuar
                        </Button>
                      )}
                    </div>
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
