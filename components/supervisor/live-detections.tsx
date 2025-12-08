"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";

import {
  obtenerIncumplimientos,
  obtenerHistorialTrabajador,
  obtenerInspectores,
  obtenerZonas,
  obtenerDeteccionesFiltradas,
} from "@/servicios/reporte_incumplimiento";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  Camera,
  Clock,
  UserCheck,
  HardHat,
  Shield,
  Glasses,
  Shirt,
} from "lucide-react";

import { WorkerHistoryDialog } from "./worker-history-dialog";

// ===============================
// 🔥 ICONOS IMPLEMENTOS
// ===============================
const ICON_MAP: any = {
  casco: HardHat,
  chaleco: Shirt,
  botas: Shield,
  guantes: Shield,
  lentes: Glasses,
};

export function LiveDetections() {
  const [grouped, setGrouped] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Historial
  const [openHistorial, setOpenHistorial] = useState(false);
  const [historial, setHistorial] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [historialWorker, setHistorialWorker] = useState<string>("");

  // Filtros
  const [inspectores, setInspectores] = useState<any[]>([]);
  const [zonas, setZonas] = useState<any[]>([]);
  const [filtroInspector, setFiltroInspector] = useState<string>("");
  const [filtroZona, setFiltroZona] = useState<string>("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const user = getUser();
  const empresaId = user?.id_empresa_supervisor ?? null;

  // ======================================================
  // 🔥 TRANSFORMAR REGISTROS PARA MOSTRARLOS AGRUPADOS
  // ======================================================
  function transformarRegistros(data: any[]) {
    const transformado = data.map((item: any, index: number) => {
      const detalle = item.evidencia.detalle.toLowerCase();

      const detections = [
        { item: "Casco", key: "casco" },
        { item: "Chaleco", key: "chaleco" },
        { item: "Botas", key: "botas" },
        { item: "Guantes", key: "guantes" },
        { item: "Lentes", key: "lentes" },
      ].map((det) => ({
        item: det.item,
        key: det.key,
        detected: !detalle.includes(det.key),
        icon: ICON_MAP[det.key],
      }));

      const fails = detections.filter((d) => !d.detected).length;

      return {
        id: index + 1,
        timestamp: new Date(item.fecha_registro).toLocaleString(),
        worker: `${item.trabajador.nombre} ${item.trabajador.apellido}`,
        cedula: item.trabajador.cedula,
        camera: item.camara.codigo,
        zone: item.camara.zona,
        inspector: item.inspector?.nombre
          ? `${item.inspector.nombre} ${item.inspector.apellido}`
          : "Sin inspector asignado",
        detections,
        severity:
          fails >= 3 ? "high" : fails === 2 ? "medium" : fails === 1 ? "low" : "safe",
        image: item.evidencia.foto_base64
          ? `data:image/jpeg;base64,${item.evidencia.foto_base64}`
          : null,
      };
    });

    const groupedByZone: any = {};
    transformado.forEach((item) => {
      if (!groupedByZone[item.zone]) {
        groupedByZone[item.zone] = {
          inspector: item.inspector,
          registros: [],
        };
      }
      groupedByZone[item.zone].registros.push(item);
    });

    return groupedByZone;
  }

  // ======================================
  // 🔥 Cargar datos iniciales
  // ======================================
  useEffect(() => {
    async function cargarInicial() {
      if (!empresaId || !user?.id_supervisor) return;

      // Inspectores
      const insp = await obtenerInspectores(empresaId);
      setInspectores(insp);

      // Zonas sin inspector
      const zonasBD = await obtenerZonas(empresaId);
      setZonas(zonasBD);

      // Datos del día
      const data = await obtenerIncumplimientos(user.id_supervisor);
      setGrouped(transformarRegistros(data));
      setLoading(false);
    }

    cargarInicial();
  }, []);

  // ======================================
  // 🔥 Filtrado en tiempo REAL
  // ======================================
  useEffect(() => {
    async function filtrar() {
      if (!empresaId) return;

      setLoading(true);

      const filtros = {
        id_empresa: empresaId,
        fecha_desde: fechaDesde || undefined,
        fecha_hasta: fechaHasta || undefined,
        id_inspector: filtroInspector ? Number(filtroInspector) : undefined,
        id_zona: filtroZona ? Number(filtroZona) : undefined,
      };

      const data = await obtenerDeteccionesFiltradas(filtros);
      setGrouped(transformarRegistros(data));
      setLoading(false);
    }

    filtrar();
  }, [filtroInspector, filtroZona, fechaDesde, fechaHasta]);

  // ===============================
  // 🔥 Cambiar inspector → carga zonas
  // ===============================
  async function cambiarInspector(id: string) {
    setFiltroInspector(id);
    setFiltroZona("");

    const zonasBD = await obtenerZonas(
      empresaId,
      id ? Number(id) : undefined
    );

    setZonas(zonasBD);
  }

  // =======================================================
  // 🔥 Ver historial del trabajador
  // =======================================================
  async function verHistorial(detection: any) {
    const cedula = detection.cedula;
    if (!cedula) return;

    setHistorialWorker(detection.worker);

    const data = await obtenerHistorialTrabajador({ cedula });
    const { estadisticas, historial } = data;

    const transformado = historial.map((item: any, index: number) => {
      const detalle = item.evidencia.detalle.toLowerCase();

      const detections = [
        { item: "Casco", key: "casco" },
        { item: "Chaleco", key: "chaleco" },
        { item: "Botas", key: "botas" },
        { item: "Guantes", key: "guantes" },
        { item: "Lentes", key: "lentes" },
      ].map((det) => ({
        item: det.item,
        detected: !detalle.includes(det.key),
        icon: ICON_MAP[det.key],
      }));

      const fails = detections.filter((d) => !d.detected).length;

      return {
        id: index + 1,
        timestamp: new Date(item.fecha_registro).toLocaleString(),
        worker: `${item.trabajador.nombre} ${item.trabajador.apellido}`,
        camera: item.camara.codigo,
        zone: item.camara.zona,
        inspector: item.inspector?.nombre
          ? `${item.inspector.nombre} ${item.inspector.apellido}`
          : "Sin inspector asignado",
        detections,
        image: item.evidencia.foto_base64
          ? `data:image/jpeg;base64,${item.evidencia.foto_base64}`
          : null,
        severity: fails > 0 ? "high" : "safe",
      };
    });

    setStats(estadisticas);
    setHistorial(transformado);
    setOpenHistorial(true);
  }

  // ===============================
  // 🔥 UI
  // ===============================
  if (loading) return <p className="text-center">Cargando reportes...</p>;

  return (
    <>
      {/* MODAL HISTORIAL */}
      {openHistorial && stats && (
        <WorkerHistoryDialog
          open={openHistorial}
          onOpenChange={setOpenHistorial}
          workerName={historialWorker}
          stats={stats}
          historial={historial}
        />
      )}

      {/* ==========================================
          🔥 FILTROS (Tiempo real)
      ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* INSPECTOR */}
        <div>
          <p className="text-sm font-medium mb-1">Inspector</p>
          <Select onValueChange={cambiarInspector}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
             <SelectItem value="all">Todos</SelectItem>

              {inspectores.map((i) => (
                <SelectItem key={i.id} value={String(i.id)}>
                  {i.nombre} {i.apellido}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ZONA */}
        <div>
          <p className="text-sm font-medium mb-1">Zona</p>
          <Select onValueChange={(v) => setFiltroZona(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>

              {zonas.map((z) => (
                <SelectItem key={z.id} value={String(z.id)}>
                  {z.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* FECHAS */}
        <div>
          <p className="text-sm font-medium mb-1">Desde</p>
          <Input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Hasta</p>
          <Input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
        </div>
      </div>

      {/* ===============================
          🔥 REPORTES
      =============================== */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([zona, data]: any) => (
          <Card key={zona}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Zona: {zona}
              </CardTitle>

              <CardDescription className="flex items-center gap-2 mt-2">
                <UserCheck className="w-4 h-4" />
                Inspector:
                <span className="font-medium text-foreground">
                  {data.inspector}
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {data.registros.map((detection: any) => (
                  <Card
                    key={detection.id}
                    className={`border ${
                      detection.severity === "high"
                        ? "border-destructive"
                        : detection.severity === "medium"
                        ? "border-yellow-500"
                        : "border-border"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="grid gap-4 md:grid-cols-[300px_1fr]">
                        {/* IMAGEN */}
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                          <img
                            src={detection.image}
                            alt="Evidencia"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* INFO */}
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">
                                {detection.worker}
                              </h4>

                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <Camera className="w-3 h-3" />
                                {detection.camera}
                                <span>•</span>
                                <span>{zona}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {detection.timestamp}
                            </div>
                          </div>

                          {/* DETECCIONES */}
                          <div className="grid grid-cols-2 gap-3">
                            {detection.detections.map((item: any) => {
                              const Icon = item.icon;

                              return (
                                <div
                                  key={item.item}
                                  className={`flex items-center gap-3 p-2 rounded-lg border ${
                                    item.detected
                                      ? "bg-green-50 border-green-400"
                                      : "bg-red-50 border-red-400"
                                  }`}
                                >
                                  <Icon
                                    className={`w-4 h-4 ${
                                      item.detected
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  />

                                  <div className="flex-1">
                                    <p className="text-sm font-medium">
                                      {item.item}
                                    </p>

                                    <p
                                      className={`text-xs ${
                                        item.detected
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {item.detected ? "Detectado" : "No detectado"}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* ACCIONES */}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => verHistorial(detection)}
                              className="flex-1 bg-transparent"
                            >
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
        ))}
      </div>
    </>
  );
}
