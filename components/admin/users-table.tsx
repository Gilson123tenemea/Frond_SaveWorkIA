"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"
import { listarEmpresas } from "@/servicios/empresa"

import {
  listarSupervisores,
  eliminarSupervisor,
  editarSupervisor,
  registrarSupervisor,
  verificarCedula,
  validarCorreoSupervisor, // ✅ AGREGAR ESTA IMPORTACIÓN
} from "@/servicios/supervisor"

import { obtenerEmpresasDisponibles } from "@/servicios/supervisor"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import { Label } from "@/components/ui/label"

// VALIDACIONES
import {
  validarCedulaEcuatoriana,
  validarNombre,
  validarApellido,
  validarTelefono,
  validarCorreo,
  validarDireccion,
  validarGenero,
  validarFechaNacimiento,
  validarEspecialidad,
  validarExperiencia,
  validarContrasena,
} from "../validaciones/validaciones"

// TIPOS
type SupervisorRow = {
  id_supervisor: number
  id_persona: number
  cedula: string
  nombre: string
  apellido: string
  telefono?: string | null
  correo: string
  direccion: string
  genero: string
  fecha_nacimiento: string
  especialidad_seguridad: string
  experiencia: number
  id_empresa_supervisor: number
  borrado: boolean
}

type SupervisorPayload = {
  persona: {
    cedula: string
    nombre: string
    apellido: string
    telefono: string
    correo: string
    direccion: string
    genero: string
    fecha_nacimiento: string
    contrasena: string
  }
  especialidad_seguridad: string
  experiencia: number
  id_empresa_supervisor?: number
}

export function SupervisoresTable() {
  const [search, setSearch] = useState("")
  const [supervisores, setSupervisores] = useState<SupervisorRow[]>([])
  const [loading, setLoading] = useState(true)
  const [empresasDisponibles, setEmpresasDisponibles] = useState<any[]>([])
  const [empresasTodas, setEmpresasTodas] = useState<any[]>([])

  const [openDialog, setOpenDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<SupervisorRow | null>(null)

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<any>({})

  const [form, setForm] = useState<SupervisorPayload>({
    persona: {
      cedula: "",
      nombre: "",
      apellido: "",
      telefono: "",
      correo: "",
      direccion: "",
      genero: "",
      fecha_nacimiento: "",
      contrasena: "",
    },
    especialidad_seguridad: "",
    experiencia: 0,
    id_empresa_supervisor: undefined,
  })

  useEffect(() => {
    cargarSupervisores()
    cargarEmpresasDisponibles()
    cargarEmpresasTodas()
  }, [])

  const cargarEmpresasDisponibles = async () => {
    try {
      const data = await obtenerEmpresasDisponibles()
      setEmpresasDisponibles(data)
    } catch (error) {
      console.error("Error al cargar empresas disponibles:", error)
    }
  }

  const cargarEmpresasTodas = async () => {
    try {
      const data = await listarEmpresas()
      const activas = data.filter((e: any) => e.borrado === true || e.borrado === 1)
      setEmpresasTodas(activas)
    } catch (error) {
      console.error("Error al cargar todas las empresas:", error)
    }
  }

  const cargarSupervisores = async () => {
    try {
      setLoading(true)
      const data = await listarSupervisores()

      if (!Array.isArray(data)) {
        toast.error("Respuesta inesperada del servidor")
      } else {
        setSupervisores(data)
      }
    } catch (error) {
      toast.error("Error al cargar los supervisores")
    } finally {
      setLoading(false)
    }
  }

  const openNewSupervisor = () => {
    setIsEditing(false)
    setErrors({})
    setShowPassword(false)

    setForm({
      persona: {
        cedula: "",
        nombre: "",
        apellido: "",
        telefono: "",
        correo: "",
        direccion: "",
        genero: "",
        fecha_nacimiento: "",
        contrasena: "",
      },
      especialidad_seguridad: "",
      experiencia: 0,
      id_empresa_supervisor: empresasDisponibles[0]?.id_Empresa ?? undefined,
    })

    setOpenDialog(true)
  }

  const openEditDialog = (row: SupervisorRow) => {
    setIsEditing(true)
    setEditing(row)
    setErrors({})
    setShowPassword(false)

    setForm({
      persona: {
        cedula: row.cedula,
        nombre: row.nombre,
        apellido: row.apellido,
        telefono: row.telefono ?? "",
        correo: row.correo,
        direccion: row.direccion,
        genero: row.genero,
        fecha_nacimiento: row.fecha_nacimiento.slice(0, 10),
        contrasena: "",
      },
      especialidad_seguridad: row.especialidad_seguridad,
      experiencia: row.experiencia,
      id_empresa_supervisor: row.id_empresa_supervisor,
    })

    // ✅ AGREGAR LA EMPRESA ACTUAL A LAS DISPONIBLES SI NO ESTÁ
    const empresaActual = empresasTodas.find((e) => e.id_Empresa === row.id_empresa_supervisor)
    if (empresaActual && !empresasDisponibles.some((e) => e.id_Empresa === empresaActual.id_Empresa)) {
      setEmpresasDisponibles((prev) => [...prev, empresaActual])
    }

    setOpenDialog(true)
  }

  const validarFormulario = () => {
    const newErrors: any = {}

    newErrors.cedula = validarCedulaEcuatoriana(form.persona.cedula)
    newErrors.nombre = validarNombre(form.persona.nombre)
    newErrors.apellido = validarApellido(form.persona.apellido)
    newErrors.telefono = validarTelefono(form.persona.telefono)
    newErrors.correo = validarCorreo(form.persona.correo)
    newErrors.direccion = validarDireccion(form.persona.direccion)
    newErrors.genero = validarGenero(form.persona.genero)
    newErrors.fecha_nacimiento = validarFechaNacimiento(form.persona.fecha_nacimiento)

    if (!isEditing) {
      newErrors.contrasena = validarContrasena(form.persona.contrasena)
    }

    newErrors.especialidad_seguridad = validarEspecialidad(form.especialidad_seguridad)
    newErrors.experiencia = validarExperiencia(form.experiencia)

    if (!form.id_empresa_supervisor) {
      newErrors.id_empresa_supervisor = "Debe seleccionar una empresa"
    }

    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key]
    })

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validarFormulario()) {
      toast.error("Por favor corrige los errores antes de guardar", {
        style: {
          background: "#dc2626",
          color: "#fff",
          fontWeight: 600,
          borderRadius: "8px",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#7f1d1d",
        },
      })

      return
    }

    setSaving(true)
    try {
      if (isEditing && editing) {
        const promise = editarSupervisor(editing.id_supervisor, form)

        toast.promise(
          promise,
          {
            loading: "Actualizando supervisor...",
            success: `Supervisor "${form.persona.nombre} ${form.persona.apellido}" actualizado con éxito`,
            error: "❌ Ocurrió un error al actualizar el supervisor",
          },
          {
            style: {
              background: "#2563eb",
              color: "#fff",
              borderRadius: "8px",
              fontWeight: 500,
              boxShadow: "0 2px 20px rgba(0, 0, 0, 0.25)",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#1e3a8a",
            },
          }
        )

        await promise
      } else {
        const promise = registrarSupervisor(form)

        toast.promise(
          promise,
          {
            loading: "Registrando supervisor...",
            success: `Supervisor "${form.persona.nombre} ${form.persona.apellido}" registrado exitosamente`,
            error: "❌ Ocurrió un error al registrar el supervisor",
          },
          {
            style: {
              background: "#16a34a",
              color: "#fff",
              borderRadius: "8px",
              fontWeight: 500,
              boxShadow: "0 2px 20px rgba(0, 0, 0, 0.2)",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#15803d",
            },
          }
        )

        await promise
      }
      await cargarEmpresasDisponibles()
      await cargarEmpresasTodas()
      setOpenDialog(false)
      await cargarSupervisores()
      cargarSupervisores()
    } catch (err: any) {
      toast.error(err?.message || "Error al guardar el supervisor")
    } finally {
      setSaving(false)
    }
  }

  // ✅ VALIDACIÓN EN TIEMPO REAL CON CORREO
  const onChangePersona = (field: keyof SupervisorPayload["persona"], value: string) => {
    let formateado = value

    if (field === "cedula") formateado = value.replace(/[^0-9]/g, "").slice(0, 10)
    if (field === "telefono") formateado = value.replace(/[^0-9]/g, "").slice(0, 10)
    if (field === "nombre") formateado = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, "")
    if (field === "apellido") formateado = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, "")
    if (field === "direccion") formateado = value.replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúñÑ #.,-]/g, "")

    setForm((prev) => ({
      ...prev,
      persona: { ...prev.persona, [field]: formateado },
    }))

    // VALIDACIÓN LOCAL
    let error = null
    if (field === "cedula") error = validarCedulaEcuatoriana(formateado)
    if (field === "nombre") error = validarNombre(formateado)
    if (field === "apellido") error = validarApellido(formateado)
    if (field === "telefono") error = validarTelefono(formateado)
    if (field === "correo") error = validarCorreo(formateado)
    if (field === "direccion") error = validarDireccion(formateado)
    if (field === "genero") error = validarGenero(formateado)
    if (field === "fecha_nacimiento") error = validarFechaNacimiento(formateado)
    if (field === "contrasena" && !isEditing) error = validarContrasena(formateado)

    setErrors((prev: any) => ({ ...prev, [field]: error }))

    // VALIDACIÓN BACKEND - CÉDULA
    if (field === "cedula" && formateado.length === 10 && !error) {
      verificarCedula(formateado).then((existe) => {
        if (existe) {
          setErrors((prev: any) => ({
            ...prev,
            cedula: "Ya existe un usuario activo con esta cédula",
          }))
        } else {
          setErrors((prev: any) => ({ ...prev, cedula: null }))
        }
      })
    }

    // ✅ VALIDACIÓN BACKEND - CORREO
    if (field === "correo" && formateado.includes("@") && !error) {
      const controller = new AbortController()

      validarCorreoSupervisor(formateado, controller.signal)
        .then((resp) => {
          if (!resp?.disponible) {
            setErrors((prev: any) => ({
              ...prev,
              correo: "Ya existe un usuario activo con este correo",
            }))
          } else {
            setErrors((prev: any) => ({ ...prev, correo: null }))
          }
        })
        .catch((err) => {
          if (err?.name !== "AbortError") {
            console.error("Error validando correo:", err)
          }
        })
    }
  }

  const onChangeField = (field: keyof SupervisorPayload, value: any) => {
    let val = value

    if (field === "especialidad_seguridad") {
      val = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ()/-]/g, "")
    }

    if (field === "experiencia") {
      val = Number(value)
    }

    setForm((prev) => ({ ...prev, [field]: val }))

    let error = null
    if (field === "especialidad_seguridad") error = validarEspecialidad(val)
    if (field === "experiencia") error = validarExperiencia(val)

    setErrors((prev: any) => ({ ...prev, [field]: error }))
  }

  const handleDelete = async (idSupervisor: number, nombreSupervisor: string) => {
    const overlay = document.createElement("div")
    overlay.style.position = "fixed"
    overlay.style.top = "0"
    overlay.style.left = "0"
    overlay.style.width = "100vw"
    overlay.style.height = "100vh"
    overlay.style.background = "rgba(0,0,0,0.4)"
    overlay.style.zIndex = "999"
    overlay.style.transition = "opacity 0.3s ease"
    document.body.appendChild(overlay)

    const confirmToast = toast(
      (t) => (
        <div className="flex flex-col gap-4 p-2 text-center">
          <p className="text-base font-semibold text-gray-800">
            ¿Estás seguro de eliminar al supervisor <b>{nombreSupervisor}</b>?
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                toast.dismiss(t.id)
                document.body.removeChild(overlay)
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t.id)
                document.body.removeChild(overlay)

                const promise = eliminarSupervisor(idSupervisor).catch((err) => {
                  const msg = err?.message || ""

                  if (msg.includes("inspectores asignados")) {
                    throw new Error(
                      "Este supervisor está relacionado con uno o más inspectores. Debe eliminarlos primero."
                    )
                  }

                  throw new Error(msg)
                })

                toast.promise(
                  promise,
                  {
                    loading: "Eliminando supervisor...",
                    success: `Supervisor "${nombreSupervisor}" eliminado correctamente`,
                    error: (err: any) => err.message || "❌ Error desconocido",
                  },
                  {
                    style: {
                      background: "#dc2626",
                      color: "#fff",
                      borderRadius: "8px",
                      fontWeight: 500,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                    },
                    iconTheme: {
                      primary: "#fff",
                      secondary: "#b91c1c",
                    },
                  }
                )

                try {
                  await promise

                  await cargarSupervisores()
                  await cargarEmpresasDisponibles()
                  await cargarEmpresasTodas()
                } catch (err) {}
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      ),
      {
        duration: 8000,
        position: "top-center",
        style: {
          background: "#fff",
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          borderRadius: "12px",
          padding: "20px",
          width: "380px",
        },
      }
    )

    setTimeout(() => {
      if (document.body.contains(overlay)) {
        overlay.style.opacity = "0"
        setTimeout(() => {
          if (document.body.contains(overlay)) document.body.removeChild(overlay)
        }, 300)
      }
    }, 8000)
  }

  const filtered = supervisores.filter((s) => {
    const q = search.toLowerCase()
    return (
      s.nombre.toLowerCase().includes(q) ||
      s.apellido.toLowerCase().includes(q) ||
      s.correo.toLowerCase().includes(q)
    )
  })

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Supervisores Registrados</CardTitle>
              <CardDescription>Gestiona todos los supervisores del sistema</CardDescription>
            </div>
            <Button onClick={openNewSupervisor}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Supervisor
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar supervisor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Experiencia</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Cargando supervisores...
                    </TableCell>
                  </TableRow>
                ) : filtered.length > 0 ? (
                  filtered.map((s) => (
                    <TableRow key={s.id_supervisor}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{s.nombre.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {s.nombre} {s.apellido}
                            </p>
                            <p className="text-xs text-muted-foreground">Cédula: {s.cedula}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{s.correo}</TableCell>
                      <TableCell>{s.especialidad_seguridad}</TableCell>
                      <TableCell>{s.experiencia}</TableCell>
                      <TableCell>
                        {empresasTodas.find((e) => e.id_Empresa === s.id_empresa_supervisor)
                          ?.nombreEmpresa || "—"}
                      </TableCell>

                      <TableCell>
                        <Badge variant={s.borrado ? "default" : "outline"}>
                          {s.borrado ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600"
                            onClick={() => openEditDialog(s)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() => handleDelete(s.id_supervisor, `${s.nombre} ${s.apellido}`)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      No hay supervisores registrados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border bg-white">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Supervisor" : "Registrar Supervisor"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 py-4">
            <div className="flex flex-col gap-1">
              <Label>Cédula</Label>
              <Input
                maxLength={10}
                inputMode="numeric"
                value={form.persona.cedula}
                onChange={(e) => onChangePersona("cedula", e.target.value)}
                readOnly={isEditing}
                className={isEditing ? "bg-gray-200 cursor-not-allowed" : ""}
              />
              {errors.cedula && <p className="text-red-500 text-sm">{errors.cedula}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Nombre</Label>
              <Input
                value={form.persona.nombre}
                maxLength={50}
                onChange={(e) => onChangePersona("nombre", e.target.value)}
              />
              {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Apellido</Label>
              <Input
                value={form.persona.apellido}
                maxLength={50}
                onChange={(e) => onChangePersona("apellido", e.target.value)}
              />
              {errors.apellido && <p className="text-red-500 text-sm">{errors.apellido}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Teléfono</Label>
              <Input
                maxLength={10}
                inputMode="numeric"
                value={form.persona.telefono}
                onChange={(e) => onChangePersona("telefono", e.target.value)}
              />
              {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
            </div>

            {/* ✅ CORREO CON VALIDACIÓN EN TIEMPO REAL */}
            <div className="flex flex-col gap-1">
              <Label>Correo</Label>
              <Input
                type="email"
                value={form.persona.correo}
                onChange={(e) => onChangePersona("correo", e.target.value)}
              />
              {errors.correo && <p className="text-red-500 text-sm">{errors.correo}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Dirección</Label>
              <Input
                value={form.persona.direccion}
                onChange={(e) => onChangePersona("direccion", e.target.value)}
                maxLength={100}
              />
              {errors.direccion && <p className="text-red-500 text-sm">{errors.direccion}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Género</Label>
              <Select
                value={form.persona.genero}
                onValueChange={(value) => onChangePersona("genero", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Femenino">Femenino</SelectItem>
                </SelectContent>
              </Select>
              {errors.genero && <p className="text-red-500 text-sm">{errors.genero}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Fecha de nacimiento</Label>
              <Input
                type="date"
                value={form.persona.fecha_nacimiento}
                onChange={(e) => onChangePersona("fecha_nacimiento", e.target.value)}
              />
              {errors.fecha_nacimiento && (
                <p className="text-red-500 text-sm">{errors.fecha_nacimiento}</p>
              )}
            </div>

            {!isEditing && (
              <div className="flex flex-col gap-1 md:col-span-2">
                <Label>Contraseña</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.persona.contrasena}
                    onChange={(e) => onChangePersona("contrasena", e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.contrasena && <p className="text-red-500 text-sm">{errors.contrasena}</p>}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <Label>Especialidad</Label>
              <Input
                value={form.especialidad_seguridad}
                maxLength={50}
                onChange={(e) => onChangeField("especialidad_seguridad", e.target.value)}
              />
              {errors.especialidad_seguridad && (
                <p className="text-red-500 text-sm">{errors.especialidad_seguridad}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Empresa</Label>
              <Select
                value={form.id_empresa_supervisor ? String(form.id_empresa_supervisor) : ""}
                onValueChange={(value) => onChangeField("id_empresa_supervisor", Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empresa" />
                </SelectTrigger>
                <SelectContent>
                  {(isEditing 
                    ? [...empresasDisponibles, empresasTodas.find(e => e.id_Empresa === editing?.id_empresa_supervisor)].filter(Boolean)
                    : empresasDisponibles
                  ).length > 0 ? (
                    (isEditing 
                      ? [...empresasDisponibles, empresasTodas.find(e => e.id_Empresa === editing?.id_empresa_supervisor)].filter((e, i, arr) => e && arr.findIndex(x => x?.id_Empresa === e.id_Empresa) === i)
                      : empresasDisponibles
                    ).map((e: any) => (
                      <SelectItem key={e.id_Empresa} value={String(e.id_Empresa)}>
                        {e.nombreEmpresa}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No hay empresas activas
                    </div>
                  )}
                </SelectContent>
              </Select>
              {errors.id_empresa_supervisor && (
                <p className="text-red-500 text-sm">{errors.id_empresa_supervisor}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Experiencia (años)</Label>
              <Input
                type="number"
                value={form.experiencia}
                onChange={(e) => onChangeField("experiencia", e.target.value)}
              />
              {errors.experiencia && <p className="text-red-500 text-sm">{errors.experiencia}</p>}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}