"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Plus } from "lucide-react"
import { getWorkerAlerts, addObservationToAlert, updateAlertStatus } from "@/lib/storage"

export function WorkerAlertsList() {
  const [alerts, setAlerts] = useState(getWorkerAlerts())
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null)
  const [observation, setObservation] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "reviewed">("all")

  const filteredAlerts = alerts.filter((alert) => filter === "all" || alert.status === filter)

  const handleAddObservation = () => {
    if (selectedAlert && observation.trim()) {
      addObservationToAlert(selectedAlert, observation)
      setAlerts(getWorkerAlerts())
      setObservation("")
      setSelectedAlert(null)
    }
  }

  const selectedAlertData = alerts.find((a) => a.id === selectedAlert)

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Alertas de Trabajadores</CardTitle>
              <CardDescription>Incumplimientos de equipos de protección personal detectados</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                Todas
              </Button>
              <Button
                variant={filter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("pending")}
              >
                Pendientes
              </Button>
              <Button
                variant={filter === "reviewed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("reviewed")}
              >
                Revisadas
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg overflow-hidden">
                <div className="grid md:grid-cols-[200px,1fr] gap-4">
                  {/* Photo */}
                  <div className="relative bg-muted aspect-square md:aspect-auto">
                    <img
                      src={alert.photoUrl || "/placeholder.svg"}
                      alt={`Alerta de ${alert.workerName}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant={
                          alert.severity === "high"
                            ? "destructive"
                            : alert.severity === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {alert.severity === "high" ? "Alta" : alert.severity === "medium" ? "Media" : "Baja"}
                      </Badge>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <AlertTriangle
                            className={`w-5 h-5 ${
                              alert.severity === "high"
                                ? "text-destructive"
                                : alert.severity === "medium"
                                  ? "text-orange-600"
                                  : "text-yellow-600"
                            }`}
                          />
                          <h3 className="font-semibold text-lg">{alert.workerName}</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">DNI: </span>
                            <span className="font-medium">{alert.workerDni}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Zona: </span>
                            <span className="font-medium">{alert.zoneName}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Violación: </span>
                            <span className="font-medium text-destructive">{alert.violation}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Fecha y hora: </span>
                            <span className="font-medium">{new Date(alert.timestamp).toLocaleString("es-ES")}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={alert.status === "pending" ? "destructive" : "default"}>
                        {alert.status === "pending"
                          ? "Pendiente"
                          : alert.status === "reviewed"
                            ? "Revisada"
                            : "Resuelta"}
                      </Badge>
                    </div>

                    {/* Observations */}
                    {alert.observations.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold">Observaciones:</Label>
                        <div className="space-y-2">
                          {alert.observations.map((obs, idx) => (
                            <div key={idx} className="text-sm p-2 bg-muted rounded">
                              {obs}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedAlert(alert.id)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Observación
                      </Button>
                      {alert.status === "pending" && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => {
                            updateAlertStatus(alert.id, "resolved")
                            setAlerts(getWorkerAlerts())
                          }}
                        >
                          Marcar como Resuelta
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredAlerts.length === 0 && (
              <div className="py-12 text-center">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No hay alertas {filter !== "all" && filter}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Observation Dialog */}
      <Dialog open={selectedAlert !== null} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Observación</DialogTitle>
            <DialogDescription>Agrega una observación sobre esta alerta de incumplimiento</DialogDescription>
          </DialogHeader>
          {selectedAlertData && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg space-y-1">
                <p className="font-medium">{selectedAlertData.workerName}</p>
                <p className="text-sm text-muted-foreground">{selectedAlertData.violation}</p>
                <p className="text-xs text-muted-foreground">{selectedAlertData.zoneName}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observation">Observación</Label>
                <Textarea
                  id="observation"
                  placeholder="Describe las acciones tomadas o comentarios sobre esta alerta..."
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAlert(null)}>
              Cancelar
            </Button>
            <Button onClick={handleAddObservation} disabled={!observation.trim()}>
              Agregar Observación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
