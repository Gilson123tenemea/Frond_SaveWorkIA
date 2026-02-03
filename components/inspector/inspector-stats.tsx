"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Calendar, Download, TrendingUp, PieChart as PieChartIcon, AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import { getUser } from "@/lib/auth"
import reportesService from "@/servicios/reportes_inspector"

interface ChartData {
  label: string
  value: number
}

interface Zona {
  id: number
  nombre: string
}

interface EmpresaData {
  id_Empresa: number
  nombreEmpresa: string
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function ReportsList() {
  const user = getUser()
  const idInspector = user?.id_inspector

  // Estados principales
  const [loading, setLoading] = useState(true)
  const [empresa, setEmpresa] = useState<EmpresaData | null>(null)
  const [zonas, setZonas] = useState<Zona[]>([])
  const [selectedZona, setSelectedZona] = useState<string>("")
  
  // Fechas - inicializar con rango amplio para más probabilidad de encontrar datos
  const [fechaDesde, setFechaDesde] = useState(() => {
    const date = new Date()
    date.setMonth(date.getMonth() - 1) // Un mes atrás
    return date.toISOString().split("T")[0]
  })
  const [fechaHasta, setFechaHasta] = useState(new Date().toISOString().split("T")[0])
  
  // Datos de estadísticas
  const [cumplimientos, setCumplimientos] = useState<ChartData[]>([])
  const [incumplimientos, setIncumplimientos] = useState<ChartData[]>([])
  const [epp, setEpp] = useState<ChartData[]>([])
  
  // Estados de carga y mensajes
  const [loadingStats, setLoadingStats] = useState(false)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [downloadingEXCEL, setDownloadingEXCEL] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // ============================================
  // CARGAR EMPRESA Y ZONAS
  // ============================================
  useEffect(() => {
    if (!idInspector) {
      setError("No se encontró el ID del inspector. Verifica que hayas iniciado sesión.")
      setLoading(false)
      return
    }

    const cargarDatos = async () => {
      try {
        setError(null)
        
        // Obtener empresa
        const empresaData = await reportesService.obtenerEmpresaPorInspector(idInspector)
        setEmpresa(empresaData)

        // Obtener zonas
        const zonasData = await reportesService.obtenerZonasPorInspector(idInspector)
        setZonas(zonasData.zonas || [])

        // Seleccionar primera zona por defecto
        if (zonasData.zonas && zonasData.zonas.length > 0) {
          setSelectedZona(zonasData.zonas[0].id.toString())
        }
      } catch (err) {
        setError(`Error al cargar datos iniciales: ${err instanceof Error ? err.message : "Error desconocido"}`)
        console.error("Error en cargarDatos:", err)
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [idInspector])

  // ============================================
  // CARGAR ESTADÍSTICAS
  // ============================================
  const cargarEstadisticas = async () => {
    if (!empresa || !idInspector) {
      setError("Falta información para cargar estadísticas")
      return
    }

    if (!fechaDesde || !fechaHasta) {
      setError("Por favor, selecciona un rango de fechas válido")
      return
    }

    try {
      setLoadingStats(true)
      setError(null)
      setWarning(null)
      setSuccess(null)


      // Obtener cumplimientos
      const cumplimientosData = await reportesService.obtenerCumplimientosPorZona(
        idInspector,
        empresa.id_Empresa,
        fechaDesde,
        fechaHasta
      )
      setCumplimientos(cumplimientosData.items || [])

      // Obtener incumplimientos
      const incumplimientosData = await reportesService.obtenerIncumplimientosPorZona(
        idInspector,
        empresa.id_Empresa,
        fechaDesde,
        fechaHasta
      )
      setIncumplimientos(incumplimientosData.items || [])

      // Obtener EPP más cumplido
      const eppData = await reportesService.obtenerEPPMasCumplido(
        empresa.id_Empresa,
        idInspector,
        selectedZona ? parseInt(selectedZona) : undefined,
        fechaDesde,
        fechaHasta
      )
      setEpp(eppData.items || [])

      setSuccess("Estadísticas cargadas correctamente")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido"
      setError(`Error al cargar estadísticas: ${errorMsg}`)
      console.error("Error en cargarEstadisticas:", err)
    } finally {
      setLoadingStats(false)
    }
  }

  // ============================================
  // DESCARGAR PDF
  // ============================================
  const handleDescargarPDF = async () => {
    if (!idInspector || !selectedZona) {
      setError("Selecciona una zona para descargar")
      return
    }

    try {
      setDownloadingPDF(true)
      setError(null)
      setWarning(null)
      
      await reportesService.descargarPDFTrabajadoresZona(
        idInspector,
        parseInt(selectedZona),
        fechaDesde,
        fechaHasta
      )
      
      setSuccess("PDF descargado correctamente")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      // Si es 404 → advertencia, no error
      if (err?.code === "NO_DATA") {
        setWarning(err.message)
      } else {
        setError(err instanceof Error ? err.message : "Error desconocido al descargar PDF")
      }
      console.error("Error en descargarPDF:", err)
    } finally {
      setDownloadingPDF(false)
    }
  }

  // ============================================
  // DESCARGAR EXCEL
  // ============================================
  const handleDescargarEXCEL = async () => {
    if (!idInspector || !selectedZona) {
      setError("Selecciona una zona para descargar")
      return
    }

    try {
      setDownloadingEXCEL(true)
      setError(null)
      setWarning(null)
      
      await reportesService.descargarEXCELAsistencia(
        idInspector,
        parseInt(selectedZona),
        fechaDesde,
        fechaHasta
      )
      
      setSuccess("EXCEL descargado correctamente")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      // Si es 404 → advertencia, no error
      if (err?.code === "NO_DATA") {
        setWarning(err.message)
      } else {
        setError(err instanceof Error ? err.message : "Error desconocido al descargar EXCEL")
      }
      console.error("Error en descargarEXCEL:", err)
    } finally {
      setDownloadingEXCEL(false)
    }
  }

  // ============================================
  // RESETEAR FECHAS
  // ============================================
  const resetearFechas = () => {
    const hoy = new Date().toISOString().split("T")[0]
    setFechaDesde(hoy)
    setFechaHasta(hoy)
  }

  // Estado de carga inicial
  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground">Cargando datos del inspector...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Renderizado principal
  return (
    <div className="space-y-6">
      {/* ============================================
          INFORMACIÓN DE EMPRESA
          ============================================ */}
      {empresa && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Empresa Asignada</h3>
                <p className="text-2xl font-bold text-primary mt-1">{empresa.nombreEmpresa}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">Total de Zonas</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{zonas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============================================
          FILTROS Y CONTROLES
          ============================================ */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Reportes</CardTitle>
          <CardDescription>Configura el rango de fechas y la zona para generar reportes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mensajes de Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Mensaje de Advertencia (naranja) - cuando no hay datos */}
          {warning && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
              <span>{warning}</span>
            </div>
          )}

          {/* Mensajes de Éxito */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Rango de Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha-desde">Fecha Desde</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fecha-desde"
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha-hasta">Fecha Hasta</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fecha-hasta"
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Selector de Zona */}
          <div className="space-y-2">
            <Label htmlFor="zona">Zona para Reporte</Label>
            <Select value={selectedZona} onValueChange={setSelectedZona}>
              <SelectTrigger id="zona">
                <SelectValue placeholder="Selecciona una zona" />
              </SelectTrigger>
              <SelectContent>
                {zonas.length > 0 ? (
                  zonas.map((zona) => (
                    <SelectItem key={zona.id} value={zona.id.toString()}>
                      {zona.nombre}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No hay zonas disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-wrap gap-2 pt-4">
            <Button
              onClick={cargarEstadisticas}
              disabled={loadingStats}
              className="flex-1 sm:flex-none"
            >
              {loadingStats ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cargando...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Cargar Estadísticas
                </>
              )}
            </Button>

            <Button
              onClick={handleDescargarPDF}
              disabled={downloadingPDF || !selectedZona}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              {downloadingPDF ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Descargando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </>
              )}
            </Button>

            <Button
              onClick={handleDescargarEXCEL}
              disabled={downloadingEXCEL || !selectedZona}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              {downloadingEXCEL ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Descargando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar EXCEL
                </>
              )}
            </Button>

            <Button
              onClick={resetearFechas}
              variant="secondary"
              className="flex-1 sm:flex-none"
            >
              Hoy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ============================================
          GRÁFICOS DE ESTADÍSTICAS
          ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cumplimientos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cumplimientos por Zona</CardTitle>
            <CardDescription>
              Total: <span className="font-bold text-green-600">{cumplimientos.reduce((sum, item) => sum + item.value, 0)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cumplimientos.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cumplimientos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Carga las estadísticas para ver los datos
              </div>
            )}
          </CardContent>
        </Card>

        {/* Incumplimientos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Incumplimientos por Zona</CardTitle>
            <CardDescription>
              Total: <span className="font-bold text-red-600">{incumplimientos.reduce((sum, item) => sum + item.value, 0)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {incumplimientos.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incumplimientos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Carga las estadísticas para ver los datos
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* EPP Más Cumplido */}
      {epp.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              EPP Más Cumplido
            </CardTitle>
            <CardDescription>
              Distribución del cumplimiento de equipos de protección personal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={epp}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ label, value }) => `${label}: ${value}`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {epp.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Resumen de Información */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Datos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-muted-foreground">Total Cumplimientos</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {cumplimientos.reduce((sum, item) => sum + item.value, 0)}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-muted-foreground">Total Incumplimientos</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {incumplimientos.reduce((sum, item) => sum + item.value, 0)}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-muted-foreground">Zonas Asignadas</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{zonas.length}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-muted-foreground">EPP Registrados</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{epp.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}