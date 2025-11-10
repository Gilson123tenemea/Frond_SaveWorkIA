import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardCheck, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { getSafetyAlerts, getWorkers } from "@/lib/storage"

interface InspectorStatsProps {
  zoneId: number
}

export function InspectorStats({ zoneId }: InspectorStatsProps) {
  // <CHANGE> Calculate real stats from zone data
  const alerts = getSafetyAlerts().filter((a) => a.zoneId === zoneId)
  const todayAlerts = alerts.filter(
    (a) => new Date(a.timestamp).toDateString() === new Date().toDateString()
  )
  const pendingAlerts = alerts.filter((a) => a.status === "pending")
  const workers = getWorkers().filter((w) => w.zoneId === zoneId)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Alertas Hoy</CardTitle>
          <AlertTriangle className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayAlerts.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {pendingAlerts.length} pendientes
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Alertas</CardTitle>
          <ClipboardCheck className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{alerts.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Este mes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Trabajadores</CardTitle>
          <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{workers.length}</div>
          <p className="text-xs text-muted-foreground mt-1">En la zona</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Incumplimientos</CardTitle>
          <XCircle className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {alerts.filter((a) => a.severity === "high" || a.severity === "critical").length}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Alta prioridad</p>
        </CardContent>
      </Card>
    </div>
  )
}
