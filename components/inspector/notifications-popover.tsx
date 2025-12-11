"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, AlertTriangle } from "lucide-react";
import {
  obtenerNotificacionesInspector,
  marcarNotificacionComoLeida
} from "@/servicios/notificaciones";

interface NotificationsPopoverProps {
  idInspector: number;
}

export function NotificationsPopover({ idInspector }: NotificationsPopoverProps) {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);

  // ===========================================================
  // 🔥 FUNCIÓN PARA RECARGAR NOTIFICACIONES
  // ===========================================================
  async function loadNotifications() {
    try {
      const data = await obtenerNotificacionesInspector(idInspector);
      setAlerts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error cargando notificaciones:", error);
    }
  }

  // ===========================================================
  // 🔥 CARGAR + ESCUCHAR EVENTOS
  // ===========================================================
  useEffect(() => {
    if (!idInspector) return;

    loadNotifications(); // cargar al inicio

    const handler = () => {
      console.log("🔔 Evento recibido → actualización del popover");
      loadNotifications();
    };

    window.addEventListener("notification-updated", handler);

    return () => {
      window.removeEventListener("notification-updated", handler);
    };
  }, [idInspector]);

  // 🔥 Solo notificaciones pendientes (estado null, true o 1)
  const pendingAlerts = alerts.filter(a =>
    a.estado === true || a.estado === 1 || a.estado === null
  );
  const unreadCount = pendingAlerts.length;

  // ===========================================================
  // 🔥 MARCAR COMO REVISADA DESDE EL POPOVER
  // ===========================================================
  const handleMarkAsRead = async (id: number) => {
    try {
      await marcarNotificacionComoLeida(id);

      // 1️⃣ Quitar del estado local inmediatamente
      setAlerts(prev => prev.filter(alert => alert.id !== id));

      // 2️⃣ Enviar señal global a todos los componentes
      window.dispatchEvent(new CustomEvent("notification-updated"));

    } catch (error) {
      console.error("❌ Error al marcar como revisada:", error);
    }
  };

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
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} nuevas</Badge>
            )}
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {pendingAlerts.length > 0 ? (
              pendingAlerts.map(alert => (
                <div
                  key={alert.id}
                  onClick={() => handleMarkAsRead(alert.id)}
                  className="p-3 border rounded-lg space-y-2 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 rounded-full mt-0.5 bg-destructive/10">
                      <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{alert.trabajador}</p>
                      <p className="text-xs text-muted-foreground">{alert.detalle}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.zona}</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {new Date(alert.fecha).toLocaleString("es-ES")}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No hay notificaciones pendientes
                </p>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
