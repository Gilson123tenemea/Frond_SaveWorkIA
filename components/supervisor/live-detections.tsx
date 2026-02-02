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
  X,
} from "lucide-react";

import { WorkerHistoryDialog } from "./worker-history-dialog";

const EPP_RULES = [
  { item: "Casco", ok: "helmet", no: "no-helmet", icon: HardHat },
  { item: "Chaleco", ok: "vest", no: "no-vest", icon: Shirt },
  { item: "Guantes", ok: "gloves", no: "no-gloves", icon: Shield },
  { item: "Botas", ok: "boots", no: "no-boots", icon: Shield },
  { item: "Lentes", ok: "goggles", no: "no-goggles", icon: Glasses },
  { item: "Mascarilla", ok: "mask", no: "no-mask", icon: Shield },
  { item: "Orejeras", ok: "ear-protectors", no: "no-ear-protectors", icon: Shield },
];

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
    const EPP_SYNONYMS: Record<string, string[]> = {
      casco: ["casco", "casco de seguridad"],
      chaleco: ["chaleco", "chaleco reflectivo", "chaleco de seguridad"],
      guantes: ["guantes"],
      botas: ["botas", "botas de seguridad", "calzado"],
      lentes: ["lentes", "gafas", "anteojos"],
      mascarilla: ["mascarilla", "tapabocas", "cubrebocas"],
      orejeras: ["orejeras", "proteccion auditiva", "protección auditiva"],
    };

    const normalizar = (s: string) =>
      (s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const transformado = data.map((item: any, index: number) => {
      const detalleTexto = item.evidencia?.detalle || "";
      const detalle = normalizar(detalleTexto);

      const eppsZona: string[] = Array.isArray(item.epps_zona)
        ? item.epps_zona.map((e: string) => normalizar(e))
        : [];

      if (eppsZona.length === 0) {
        return null;
      }

      const detections = eppsZona.map((eppKey) => {
        const regla = EPP_RULES.find(
          (r) => normalizar(r.item) === eppKey
        );

        const synonyms = (EPP_SYNONYMS[eppKey] || [eppKey]).map(normalizar);

        const esFaltante =
          detalle.includes("falta") &&
          synonyms.some((w) => detalle.includes(w));

        return {
          item: regla?.item ?? eppKey,
          detected: !esFaltante,
          icon: regla?.icon ?? Shield,
        };
      });

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
        detalleTexto,
        severity:
          fails >= 3
            ? "high"
            : fails === 2
              ? "medium"
              : fails === 1
                ? "low"
                : "safe",
        image: item.evidencia?.foto_base64
          ? `data:image/jpeg;base64,${item.evidencia.foto_base64}`
          : null,
      };
    });

    const filtrado = transformado.filter(Boolean);

    const groupedByZone: any = {};
    filtrado.forEach((item: any) => {
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

      const insp = await obtenerInspectores(empresaId);
      setInspectores(insp);

      const zonasBD = await obtenerZonas(empresaId);
      setZonas(zonasBD);

      const data = await obtenerIncumplimientos(user.id_supervisor);
      setGrouped(transformarRegistros(data));
      setLoading(false);
    }

    cargarInicial();
  }, []);

  // ======================================
  // 🔥 Escuchar mensajes de la ventana de detección
  // ======================================
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "NUEVO_REPORTE_CREADO") {
        recargarDatos();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [empresaId]);

  // ======================================
  // 🔥 Detectar cuando el usuario regresa a la pestaña
  // ======================================
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        recargarDatos();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [empresaId, filtroInspector, filtroZona, fechaDesde, fechaHasta]);;

  // ======================================
  // 🔥 Función para recargar datos
  // ======================================
  async function recargarDatos() {
    if (!empresaId || !user?.id_supervisor) return;

    setLoading(true);

    try {
      let data;

      if (filtroInspector || filtroZona || fechaDesde || fechaHasta) {
        const filtros = {
          id_empresa: empresaId,
          fecha_desde: fechaDesde || undefined,
          fecha_hasta: fechaHasta || undefined,
          id_inspector: filtroInspector ? Number(filtroInspector) : undefined,
          id_zona: filtroZona ? Number(filtroZona) : undefined,
        };

        data = await obtenerDeteccionesFiltradas(filtros);
      } else {
        data = await obtenerIncumplimientos(user.id_supervisor);
      }

      setGrouped(transformarRegistros(data));
    } catch (error) {
      console.error("Error al recargar datos:", error);
    } finally {
      setLoading(false);
    }
  }

  // ======================================
  // 🔥 Filtrado en tiempo REAL
  // ======================================
  useEffect(() => {
    async function filtrar() {
      if (!empresaId) return;

      setLoading(true);

      try {
        // 🔥 Si hay filtros activos
        if (filtroInspector || filtroZona || fechaDesde || fechaHasta) {
          const filtros = {
            id_empresa: empresaId,
            fecha_desde: fechaDesde || undefined,
            fecha_hasta: fechaHasta || undefined,
            id_inspector: filtroInspector ? Number(filtroInspector) : undefined,
            id_zona: filtroZona ? Number(filtroZona) : undefined,
          };

          const data = await obtenerDeteccionesFiltradas(filtros);
          setGrouped(transformarRegistros(data));
        } else {
          // 🔥 Si NO hay filtros, cargar datos de HOY
          const hoy = new Date().toISOString().split("T")[0];
          const filtros = {
            id_empresa: empresaId,
            fecha_desde: hoy,
            fecha_hasta: hoy,
            id_inspector: undefined,
            id_zona: undefined,
          };

          const data = await obtenerDeteccionesFiltradas(filtros);
          setGrouped(transformarRegistros(data));
        }
      } catch (error) {
        console.error("Error al filtrar:", error);
      } finally {
        setLoading(false);
      }
    }

    filtrar();
  }, [filtroInspector, filtroZona, fechaDesde, fechaHasta, empresaId]);

  // ===============================
  // 🔥 Cambiar inspector → carga zonas
  // ===============================
  async function cambiarInspector(id: string) {
    const nuevoFiltro = id === "all" ? "" : id;
    setFiltroInspector(nuevoFiltro);
    setFiltroZona("");

    const zonasBD = await obtenerZonas(
      empresaId,
      id && id !== "all" ? Number(id) : undefined
    );

    setZonas(zonasBD);

    // 🔥 Si es "Todos", recargar sin filtros
    if (id === "all" && user?.id_supervisor) {
      const data = await obtenerIncumplimientos(user.id_supervisor);
      setGrouped(transformarRegistros(data));
    }
  }

  // ===============================
  // 🔥 Cambiar zona
  // ===============================
  async function cambiarZona(id: string) {
    const nuevoFiltro = id === "all" ? "" : id;
    setFiltroZona(nuevoFiltro);

    // 🔥 Si es "Todos", recargar sin filtros
    if (id === "all" && user?.id_supervisor) {
      const data = await obtenerIncumplimientos(user.id_supervisor);
      setGrouped(transformarRegistros(data));
    }
  }

  // ===============================
  // 🔥 Limpiar filtros
  // ===============================
  function limpiarFiltros() {
    setFiltroInspector("");
    setFiltroZona("");
    setFechaDesde("");
    setFechaHasta("");
    setLoading(true);
    // 🔥 Forzar recarga inmediata
    setTimeout(() => {
      recargarDatos();
    }, 0);
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

    const normalizar = (s: string) =>
      (s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const transformado = historial.map((item: any, index: number) => {
      // Las faltas están en "detecciones" (array de strings como "Falta gafas")
      const faltas: string[] = item.detecciones || [];
      const eppsZonaOriginal: string[] = Array.isArray(item.epps_zona) ? item.epps_zona : [];

      // Crear un array de detecciones para cada EPP de la zona
      const detections = eppsZonaOriginal.map((eppNombre: string) => {
        // Buscar la regla EPP correspondiente
        const regla = EPP_RULES.find(
          (r) => normalizar(r.item) === normalizar(eppNombre)
        );

        // Verificar si este EPP está en las faltas
        const estaEnFaltas = faltas.some((falta) => {
          const faltaNormalizada = normalizar(falta);
          const eppNormalizado = normalizar(eppNombre);
          // Buscar coincidencia flexible (ej: "falta gafas" contiene "gafas")
          return (
            faltaNormalizada.includes(eppNormalizado) ||
            faltaNormalizada.includes("falta") && faltaNormalizada.includes(eppNormalizado)
          );
        });

        return {
          item: regla?.item ?? eppNombre,
          detected: !estaEnFaltas, // Si NO está en faltas = fue detectado (VERDE)
          icon: regla?.icon ?? Shield,
        };
      });

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
        image: item.evidencia?.foto_base64
          ? `data:image/jpeg;base64,${item.evidencia.foto_base64}`
          : null,
        severity: fails > 0 ? "high" : "safe",
        eppsZona: eppsZonaOriginal,
      };
    });

    setStats(estadisticas);
    setHistorial(transformado);
    setOpenHistorial(true);
  }

  // ===============================
  // 🔥 Detectar si hay filtros activos (solo fechas)
  // ===============================
  const tieneFiltrosFechas = fechaDesde || fechaHasta;

  // ===============================
  // 🔥 UI
  // ===============================
  if (loading) return <p className="text-center">Cargando reportes...</p>;

  return (
    <>
      {openHistorial && stats && (
        <WorkerHistoryDialog
          open={openHistorial}
          onOpenChange={setOpenHistorial}
          workerName={historialWorker}
          stats={stats}
          historial={historial}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-sm font-medium mb-1">Inspector</p>
          <Select value={filtroInspector} onValueChange={cambiarInspector}>
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

        <div>
          <p className="text-sm font-medium mb-1">Zona</p>
          <Select value={filtroZona} onValueChange={cambiarZona}>
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

        <div>
          <p className="text-sm font-medium mb-1">Desde</p>
          <Input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Hasta</p>
          <Input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </div>
      </div>

      {/* 🔥 BOTÓN LIMPIAR FILTROS - SOLO PARA FILTROS DE FECHA */}
      {tieneFiltrosFechas && (
        <div className="mb-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={limpiarFiltros}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </Button>
        </div>
      )}

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
                {data.registros.map((detection: any) => {
                  const faltantes = detection.detections.filter((d: any) => !d.detected);
                  const detectados = detection.detections.filter((d: any) => d.detected);

                  return (
                    <Card
                      key={detection.id}
                      className={`border ${detection.severity === "high"
                        ? "border-destructive"
                        : detection.severity === "medium"
                          ? "border-yellow-500"
                          : "border-border"
                        }`}
                    >
                      <CardContent className="p-4">
                        <div className="grid gap-4 md:grid-cols-[300px_1fr]">
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                            <img
                              src={detection.image}
                              alt="Evidencia"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <h3 className="text-lg font-bold text-foreground">
                                  {detection.worker}
                                </h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {detection.timestamp}
                                </p>
                              </div>
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Camera className="w-4 h-4" />
                                {detection.camera} • {detection.zone}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              {faltantes.map((item: any) => {
                                const Icon = item.icon;
                                return (
                                  <div
                                    key={item.item}
                                    className="flex items-center gap-3 p-3 rounded-lg border bg-red-50 border-red-400"
                                  >
                                    <Icon className="w-4 h-4 text-red-600" />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">{item.item}</p>
                                      <p className="text-xs text-red-600">No detectado</p>
                                    </div>
                                  </div>
                                );
                              })}
                              {detectados.map((item: any) => {
                                const Icon = item.icon;
                                return (
                                  <div
                                    key={item.item}
                                    className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-400"
                                  >
                                    <Icon className="w-4 h-4 text-green-600" />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">{item.item}</p>
                                      <p className="text-xs text-green-600">Detectado</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => verHistorial(detection)}
                                className="flex-1 bg-transparent"
                              >
                                Ver Historial
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}