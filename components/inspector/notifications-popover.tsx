"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell, AlertTriangle, CheckCircle2 } from "lucide-react"
import { getWorkerAlerts } from "@/lib/storage"

interface NotificationsPopoverProps {
  unreadCount: number
}

export function NotificationsPopover({ unreadCount }: NotificationsPopoverProps) {
  const [open, setOpen] = useState(false)
  const alerts = getWorkerAlerts().slice(0, 5)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notificaciones</h3>
            {unreadCount > 0 && <Badge variant="secondary">{unreadCount} nuevas</Badge>}
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 border rounded-lg space-y-2 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`p-1.5 rounded-full mt-0.5 ${
                        alert.severity === "high"
                          ? "bg-destructive/10"
                          : alert.severity === "medium"
                            ? "bg-orange-500/10"
                            : "bg-yellow-500/10"
                      }`}
                    >
                      <AlertTriangle
                        className={`w-3.5 h-3.5 ${
                          alert.severity === "high"
                            ? "text-destructive"
                            : alert.severity === "medium"
                              ? "text-orange-600"
                              : "text-yellow-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{alert.workerName}</p>
                      <p className="text-xs text-muted-foreground">{alert.violation}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.zoneName}</p>
                    </div>
                    {alert.status === "reviewed" && <CheckCircle2 className="w-4 h-4 text-success" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleString("es-ES")}</p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No hay notificaciones</p>
              </div>
            )}
          </div>

          {alerts.length > 0 && (
            <Button variant="outline" className="w-full bg-transparent" size="sm" onClick={() => setOpen(false)}>
              Ver todas las alertas
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
