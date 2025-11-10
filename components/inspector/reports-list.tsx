"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Plus, Calendar, FileText } from "lucide-react"
import { getReports } from "@/lib/storage"

export function ReportsList() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const reports = getReports()

  const filteredReports = reports.filter((report) => report.date === selectedDate)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Reportes de Inspección</CardTitle>
            <CardDescription>Historial de reportes por día</CardDescription>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Reporte
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Filter */}
        <div className="space-y-2">
          <Label htmlFor="date">Filtrar por Fecha</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}>
              Hoy
            </Button>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{report.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{report.zoneName}</p>
                      <p className="text-sm mt-2">{report.content}</p>
                    </div>
                  </div>
                  <Badge variant={report.status === "published" ? "default" : "secondary"}>
                    {report.status === "published" ? "Publicado" : "Borrador"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      Inspector: <span className="font-medium">{report.inspectorName}</span>
                    </span>
                    <span>
                      Tipo:{" "}
                      <span className="font-medium">
                        {report.type === "daily" ? "Diario" : report.type === "weekly" ? "Semanal" : "Mensual"}
                      </span>
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center border rounded-lg">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No hay reportes para el {new Date(selectedDate).toLocaleDateString("es-ES")}
              </p>
              <Button variant="outline" className="mt-4 bg-transparent" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Crear Reporte para Este Día
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
