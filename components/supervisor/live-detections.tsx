"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HardHat, Shield, Glasses, Shirt, AlertTriangle, CheckCircle2, Camera, Clock } from "lucide-react"

const DETECTIONS = [
  {
    id: 1,
    timestamp: "Hace 2 min",
    worker: "Luis Mendoza",
    camera: "CAM-B03",
    zone: "Zona B - Producción",
    detections: [
      { item: "Casco", detected: false, icon: HardHat },
      { item: "Chaleco", detected: true, icon: Shirt },
      { item: "Botas", detected: true, icon: Shield },
      { item: "Gafas", detected: true, icon: Glasses },
    ],
    image: "industrial worker production line",
    severity: "high" as const,
  },
  {
    id: 2,
    timestamp: "Hace 5 min",
    worker: "Pedro García",
    camera: "CAM-A01",
    zone: "Zona A - Almacén",
    detections: [
      { item: "Casco", detected: true, icon: HardHat },
      { item: "Chaleco", detected: true, icon: Shirt },
      { item: "Botas", detected: true, icon: Shield },
      { item: "Gafas", detected: true, icon: Glasses },
    ],
    image: "warehouse worker with safety equipment",
    severity: "safe" as const,
  },
  {
    id: 3,
    timestamp: "Hace 12 min",
    worker: "Marco Silva",
    camera: "CAM-D01",
    zone: "Zona D - Exterior",
    detections: [
      { item: "Casco", detected: true, icon: HardHat },
      { item: "Chaleco", detected: false, icon: Shirt },
      { item: "Botas", detected: true, icon: Shield },
      { item: "Gafas", detected: false, icon: Glasses },
    ],
    image: "outdoor construction worker",
    severity: "medium" as const,
  },
]

export function LiveDetections() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Detecciones de IA en Tiempo Real
            </CardTitle>
            <CardDescription>Análisis automático de equipos de protección personal</CardDescription>
          </div>
          <Badge variant="outline" className="gap-1.5">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            En Vivo
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {DETECTIONS.map((detection) => (
            <Card
              key={detection.id}
              className={`${
                detection.severity === "high"
                  ? "border-destructive"
                  : detection.severity === "medium"
                    ? "border-yellow-500"
                    : "border-border"
              }`}
            >
              <CardContent className="p-4">
                <div className="grid gap-4 md:grid-cols-[300px_1fr]">
                  {/* Detection Image */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={`/.jpg?height=200&width=300&query=${detection.image}`}
                      alt="Detection"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant={
                          detection.severity === "high"
                            ? "destructive"
                            : detection.severity === "medium"
                              ? "outline"
                              : "default"
                        }
                      >
                        {detection.severity === "high" ? (
                          <>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Alto Riesgo
                          </>
                        ) : detection.severity === "medium" ? (
                          <>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Riesgo Medio
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Seguro
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>

                  {/* Detection Details */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{detection.worker}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Camera className="w-3 h-3" />
                            {detection.camera}
                          </span>
                          <span>•</span>
                          <span>{detection.zone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {detection.timestamp}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {detection.detections.map((item) => {
                        const Icon = item.icon
                        return (
                          <div
                            key={item.item}
                            className={`flex items-center gap-3 p-2 rounded-lg border ${
                              item.detected
                                ? "bg-success/5 border-success/20"
                                : "bg-destructive/5 border-destructive/20"
                            }`}
                          >
                            <div className={`p-1.5 rounded ${item.detected ? "bg-success/10" : "bg-destructive/10"}`}>
                              <Icon className={`w-4 h-4 ${item.detected ? "text-success" : "text-destructive"}`} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.item}</p>
                              <p className={`text-xs ${item.detected ? "text-success" : "text-destructive"}`}>
                                {item.detected ? "Detectado" : "No detectado"}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        Ver Historial
                      </Button>
                      {detection.severity !== "safe" && (
                        <Button size="sm" className="flex-1">
                          Notificar Trabajador
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
