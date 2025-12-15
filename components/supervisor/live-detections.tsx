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

const EPP_RULES = [
  { item: "Casco", ok: "helmet", no: "no-helmet", icon: HardHat },
  { item: "Chaleco", ok: "vest", no: "no-vest", icon: Shirt },
  { item: "Guantes", ok: "gloves", no: "no-gloves", icon: Shield },
  { item: "Botas", ok: "boots", no: "no-boots", icon: Shield },
  { item: "Lentes", ok: "goggles", no: "no-goggles", icon: Glasses },
  { item: "Mascarilla", ok: "mask", no: "no-mask", icon: Shield },
  { item: "Orejeras", ok: "ear-protectors", no: "no-ear-protectors", icon: Shield },
];

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

    // ✅ 1️⃣ EPP configurados en la ZONA (OBLIGATORIO)
    const eppsZona: string[] = Array.isArray(item.epps_zona)
      ? item.epps_zona.map((e: string) => normalizar(e))
      : [];

    // ⚠️ Si la zona NO tiene EPP → no mostramos nada
    if (eppsZona.length === 0) {
      return null;
    }

    // ✅ 2️⃣ Evaluar CADA EPP de la zona
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
        detected: !esFaltante, // 🟢 si NO aparece en "Falta ..."
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

  // 🔥 Quitar nulls (zonas sin EPP)
  const filtrado = transformado.filter(Boolean);

  // 🔥 Agrupar por zona
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
      // 🔥 Clases detectadas por YOLO (nuevo sistema)
      const clasesDetectadas: string[] = item.detecciones || [];

      // 🔁 Fallback para registros antiguos
      const detalle = (item.evidencia?.detalle || "").toLowerCase();

      const detections = EPP_RULES.map((epp) => {
        const tieneOk = clasesDetectadas.includes(epp.ok);
        const tieneNo = clasesDetectadas.includes(epp.no);

        const falloPorTexto =
          !clasesDetectadas.length &&
          (detalle.includes(epp.no) ||
            (detalle && !detalle.includes(epp.ok)));

        const detected = clasesDetectadas.length
          ? tieneOk && !tieneNo
          : !falloPorTexto;

        return {
          item: epp.item,
          detected,
          icon: epp.icon,
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

                            {/* 🔥 MENSAJE HUMANO */}
                            {detection.detalleTexto && (
                              <div className="flex items-start gap-3 p-3 rounded-lg border border-red-400 bg-red-50">
                                <span className="text-red-600 text-lg">⚠️</span>
                                <div>
                                  <p className="text-sm font-semibold text-red-700">
                                    Incumplimiento detectado
                                  </p>
                                  <p className="text-sm text-red-600">
                                    {detection.detalleTexto}
                                  </p>
                                </div>
                              </div>
                            )}

                            {faltantes.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold text-red-700 mb-2">
                                  ❌ Implementos faltantes
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                  {faltantes.map((item: any) => {
                                    const Icon = item.icon;
                                    return (
                                      <div
                                        key={item.item}
                                        className="flex items-center gap-3 p-2 rounded-lg border bg-red-50 border-red-400"
                                      >
                                        <Icon className="w-4 h-4 text-red-600" />
                                        <div>
                                          <p className="text-sm font-medium">{item.item}</p>
                                          <p className="text-xs text-red-600">No detectado</p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                            {detectados.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold text-green-700 mb-2">
                                  ✅ Implementos detectados
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                  {detectados.map((item: any) => {
                                    const Icon = item.icon;
                                    return (
                                      <div
                                        key={item.item}
                                        className="flex items-center gap-3 p-2 rounded-lg border bg-green-50 border-green-400"
                                      >
                                        <Icon className="w-4 h-4 text-green-600" />
                                        <div>
                                          <p className="text-sm font-medium">{item.item}</p>
                                          <p className="text-xs text-green-600">Detectado</p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}


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
