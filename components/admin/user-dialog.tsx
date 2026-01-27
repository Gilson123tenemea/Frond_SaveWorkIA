"use client"

import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Shield, Loader2, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"

import toast from "react-hot-toast"
import {
  registrarSupervisor,
  obtenerEmpresasDisponibles,
  validarCorreoSupervisor,
} from "../../servicios/supervisor"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function UserDialog({ open, onOpenChange, onSuccess }: UserDialogProps) {
  const [loading, setLoading] = useState(false)
  const [empresas, setEmpresas] = useState<any[]>([])
  const [showPassword, setShowPassword] = useState(false)

  const [correoDisponible, setCorreoDisponible] = useState(true)
  const [mensajeCorreo, setMensajeCorreo] = useState("")
  const [validandoCorreo, setValidandoCorreo] = useState(false)

  const [formData, setFormData] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    direccion: "",
    genero: "",
    fecha_nacimiento: "",
    contrasena: "",
    especialidad_seguridad: "",
    experiencia: "",
    id_empresa_supervisor: "",
  })

  const debounceRef = useRef<number | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (open) {
      cargarEmpresas()
      setShowPassword(false)
      setCorreoDisponible(true)
      setMensajeCorreo("")
      setValidandoCorreo(false)
    }

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current)
        debounceRef.current = null
      }

      if (abortRef.current) {
        abortRef.current.abort()
        abortRef.current = null
      }
    }
  }, [open])

  const cargarEmpresas = async () => {
    try {
      const data = await obtenerEmpresasDisponibles()
      setEmpresas(data)
    } catch {
      toast.error("Error al cargar empresas")
    }
  }

  const esCorreoValido = (correo: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(correo)
  }

  const validarCorreo = async (correo: string) => {
    console.log("🔍 Iniciando validación de:", correo)
    
    if (!esCorreoValido(correo)) {
      setCorreoDisponible(false)
      setMensajeCorreo("Formato de correo inválido")
      setValidandoCorreo(false)
      return
    }

    setValidandoCorreo(true)
    setMensajeCorreo("")

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current)
    }

    if (abortRef.current) {
      abortRef.current.abort()
    }

    debounceRef.current = window.setTimeout(async () => {
      abortRef.current = new AbortController()

      try {
        console.log("📡 Llamando a la API...")
        const resp = await validarCorreoSupervisor(correo, abortRef.current.signal)
        console.log("✅ Respuesta:", resp)

        setValidandoCorreo(false)

        if (!resp?.disponible) {
          setCorreoDisponible(false)
          setMensajeCorreo("Este correo ya está registrado")
        } else {
          setCorreoDisponible(true)
          setMensajeCorreo("Correo disponible")
        }
      } catch (err: any) {
        if (err?.name === "AbortError") return

        console.error("❌ Error:", err)
        setValidandoCorreo(false)
        setCorreoDisponible(true)
        setMensajeCorreo("No se pudo validar el correo")
      }
    }, 500)
  }

  const handleCorreoChange = (value: string) => {
    console.log("🎯 handleCorreoChange llamado con:", value)
    
    const correo = value.trim()
    setFormData((prev) => ({ ...prev, correo }))

    if (!correo) {
      setCorreoDisponible(true)
      setMensajeCorreo("")
      setValidandoCorreo(false)
      return
    }

    validarCorreo(correo)
  }

  const validarFormulario = () => {
    return (
      formData.cedula &&
      formData.nombre &&
      formData.apellido &&
      formData.correo &&
      formData.contrasena &&
      formData.id_empresa_supervisor &&
      correoDisponible &&
      !validandoCorreo
    )
  }

  const handleSubmit = async () => {
    if (!validarFormulario()) {
      toast.error("Por favor completa todos los campos correctamente")
      return
    }

    setLoading(true)

    const payload = {
      persona: {
        cedula: formData.cedula,
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        correo: formData.correo,
        direccion: formData.direccion,
        genero: formData.genero,
        fecha_nacimiento: formData.fecha_nacimiento,
        contrasena: formData.contrasena,
      },
      especialidad_seguridad: formData.especialidad_seguridad,
      experiencia: Number(formData.experiencia),
      id_empresa_supervisor: Number(formData.id_empresa_supervisor),
    }

    const promise = registrarSupervisor(payload)

    toast.promise(promise, {
      loading: "Registrando supervisor...",
      success: "Supervisor registrado correctamente",
      error: "Error al registrar supervisor",
    })

    try {
      await promise
      onSuccess()
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  const inputState = !formData.correo
    ? "default"
    : validandoCorreo
    ? "validating"
    : !correoDisponible
    ? "error"
    : correoDisponible && mensajeCorreo
    ? "success"
    : "default"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Registrar Supervisor
          </DialogTitle>
          <DialogDescription>Completa la información requerida</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Cédula */}
          <div className="flex flex-col gap-1">
            <Label>Cédula</Label>
            <Input
              type="text"
              value={formData.cedula}
              onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
              placeholder="Ej: 1723456789"
            />
          </div>

          {/* Nombre */}
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Juan"
            />
          </div>

          {/* Apellido */}
          <div className="flex flex-col gap-1">
            <Label>Apellido</Label>
            <Input
              type="text"
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              placeholder="Ej: Pérez"
            />
          </div>

          {/* Teléfono */}
          <div className="flex flex-col gap-1">
            <Label>Teléfono</Label>
            <Input
              type="text"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="Ej: 0987654321"
            />
          </div>

          {/* ✅ CORREO CON VALIDACIÓN */}
          <div className="flex flex-col gap-1">
            <Label>Correo</Label>

            <div className="relative">
              <Input
                type="email"
                value={formData.correo}
                onChange={(e) => {
                  console.log("🎯 Input onChange:", e.target.value)
                  handleCorreoChange(e.target.value)
                }}
                placeholder="Ej: supervisor@empresa.com"
                className={`pr-10 ${
                  inputState === "error"
                    ? "border-red-500 focus-visible:ring-red-500"
                    : inputState === "success"
                    ? "border-green-500 focus-visible:ring-green-500"
                    : ""
                }`}
              />

              {/* Icono de estado */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {validandoCorreo && (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                )}
                {!validandoCorreo && correoDisponible && mensajeCorreo && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                {!validandoCorreo && !correoDisponible && mensajeCorreo && (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
            </div>

            {/* Mensaje de validación */}
            <div className="min-h-[18px]">
              {mensajeCorreo && (
                <p
                  className={`text-xs font-medium ${
                    !correoDisponible ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {mensajeCorreo}
                </p>
              )}
            </div>
          </div>

          {/* Dirección */}
          <div className="flex flex-col gap-1">
            <Label>Dirección</Label>
            <Input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              placeholder="Ej: Av. Amazonas N12-345"
            />
          </div>

          {/* Género */}
          <div className="flex flex-col gap-1">
            <Label>Género</Label>
            <Select
              value={formData.genero}
              onValueChange={(value) => setFormData({ ...formData, genero: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Femenino">Femenino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fecha de nacimiento */}
          <div className="flex flex-col gap-1">
            <Label>Fecha de nacimiento</Label>
            <Input
              type="date"
              value={formData.fecha_nacimiento}
              onChange={(e) =>
                setFormData({ ...formData, fecha_nacimiento: e.target.value })
              }
            />
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <Label>Contraseña</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.contrasena}
                onChange={(e) =>
                  setFormData({ ...formData, contrasena: e.target.value })
                }
                placeholder="Mínimo 8 caracteres"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Especialidad */}
          <div className="flex flex-col gap-1">
            <Label>Especialidad</Label>
            <Input
              type="text"
              value={formData.especialidad_seguridad}
              onChange={(e) =>
                setFormData({ ...formData, especialidad_seguridad: e.target.value })
              }
              placeholder="Ej: Seguridad Industrial, Salud Ocupacional"
            />
          </div>

          {/* Empresa */}
          <div className="flex flex-col gap-1">
            <Label>Empresa</Label>
            <Select
              value={formData.id_empresa_supervisor}
              onValueChange={(value) =>
                setFormData({ ...formData, id_empresa_supervisor: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar empresa" />
              </SelectTrigger>
              <SelectContent>
                {empresas.map((e) => (
                  <SelectItem key={e.id_Empresa} value={e.id_Empresa.toString()}>
                    {e.nombreEmpresa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Experiencia */}
          <div className="flex flex-col gap-1">
            <Label>Experiencia (años)</Label>
            <Input
              type="number"
              value={formData.experiencia}
              onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
              placeholder="Ej: 5"
              min="0"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button
            disabled={loading || validandoCorreo || !correoDisponible || !validarFormulario()}
            onClick={handleSubmit}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}