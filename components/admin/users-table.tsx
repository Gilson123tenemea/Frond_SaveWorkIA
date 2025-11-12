"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { listarSupervisores, eliminarSupervisor, editarSupervisor, registrarSupervisor } from "@/servicios/supervisor"
import { listarEmpresas } from "../../servicios/empresa"

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

// --- Tipos ---
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
    telefono?: string | null
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
  const [empresas, setEmpresas] = useState<any[]>([])

  // Modal de edición / creación
  const [openDialog, setOpenDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<SupervisorRow | null>(null)

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
    id_empresa_supervisor: 1,
  })

  // Cargar datos
  useEffect(() => {
    cargarSupervisores()
    cargarEmpresas()
  }, [])

  const cargarEmpresas = async () => {
    try {
      const data = await listarEmpresas()
      const activas = data.filter((e: any) => e.borrado === true || e.borrado === 1)
      setEmpresas(activas)
    } catch (error) {
      console.error("Error al cargar empresas:", error)
    }
  }


  const cargarSupervisores = async () => {
    try {
      setLoading(true)
      const data = await listarSupervisores()

      if (!Array.isArray(data)) {
        toast.error("Respuesta inesperada del servidor")
        setSupervisores([])
      } else {
        setSupervisores(data)
      }
    } catch (error: any) {
      toast.error("Error al cargar los supervisores")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // --- Abrir modal para crear o editar ---
  const openNewSupervisor = () => {

    setIsEditing(false)
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
      id_empresa_supervisor: empresas[0]?.id_Empresa ?? undefined,
    })
    setOpenDialog(true)
  }

  const openEditDialog = (row: SupervisorRow) => {
    setIsEditing(true)
    setEditing(row)
    setForm({
      persona: {
        cedula: row.cedula || "",
        nombre: row.nombre || "",
        apellido: row.apellido || "",
        telefono: row.telefono || "",
        correo: row.correo || "",
        direccion: row.direccion || "",
        genero: row.genero || "",
        fecha_nacimiento: (row.fecha_nacimiento || "").slice(0, 10),
        contrasena: "",
      },
      especialidad_seguridad: row.especialidad_seguridad || "",
      experiencia: Number(row.experiencia) || 0,
      id_empresa_supervisor: row.id_empresa_supervisor,
    })
    setOpenDialog(true)
  }

  // --- Guardar supervisor (crear o editar) ---
  const handleSave = async () => {
    setSaving(true)
    try {
      if (isEditing && editing) {
        await editarSupervisor(editing.id_supervisor, form)
        toast.success("Supervisor actualizado correctamente")
      } else {
        await registrarSupervisor(form)
        toast.success("Supervisor registrado correctamente")
      }
      setOpenDialog(false)
      cargarSupervisores()
    } catch (err: any) {
      toast.error(err?.message || "Error al guardar el supervisor")
    } finally {
      setSaving(false)
    }
  }

  // --- Eliminar supervisor ---
  // 🔹 Eliminar supervisor con confirmación visual
  const handleDelete = async (idSupervisor: number, nombreSupervisor: string) => {
    // Crear fondo semitransparente (overlay)
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.4)";
    overlay.style.zIndex = "999";
    overlay.style.transition = "opacity 0.3s ease";
    document.body.appendChild(overlay);

    // Mostrar confirmación
    const confirmToast = toast(
      (t) => (
        <div className="flex flex-col gap-4 p-2 text-center">
          <p className="text-base font-semibold text-gray-800">
            ¿Estás seguro de eliminar al supervisor <b>{nombreSupervisor}</b>?
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                document.body.removeChild(overlay);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t.id);
                document.body.removeChild(overlay);

                const promise = eliminarSupervisor(idSupervisor);

                toast.promise(
                  promise,
                  {
                    loading: "Eliminando supervisor...",
                    success: `Supervisor "${nombreSupervisor}" eliminado correctamente`,
                    error: "❌ Error al eliminar el supervisor",
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
                );

                try {
                  await promise;
                  await cargarSupervisores();
                } catch (err) {
                  console.error("Error al eliminar:", err);
                }
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
    );

    setTimeout(() => {
      if (document.body.contains(overlay)) {
        overlay.style.opacity = "0";
        setTimeout(() => {
          if (document.body.contains(overlay)) document.body.removeChild(overlay);
        }, 300);
      }
    }, 8000);
  };

  // --- Filtro ---
  const filtered = supervisores.filter((s) => {
    const q = search.toLowerCase()
    return (
      s.nombre.toLowerCase().includes(q) ||
      s.apellido.toLowerCase().includes(q) ||
      s.correo.toLowerCase().includes(q)
    )
  })

  const onChangePersona = (field: keyof SupervisorPayload["persona"], value: string) => {
    setForm((prev) => ({ ...prev, persona: { ...prev.persona, [field]: value } }))
  }

  const onChangeField = (field: keyof SupervisorPayload, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

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
          {/* Buscador */}
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

          {/* Tabla */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Experiencia (años)</TableHead>
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
                        {empresas.find((e) => e.id_Empresa === s.id_empresa_supervisor)?.nombreEmpresa || "—"}
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
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => openEditDialog(s)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(s.id_supervisor, s.nombre + " " + s.apellido)}

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
  {/* Modal Crear/Editar */}
  <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-lg border border-gray-200">
    <DialogHeader className="pb-2">
      <DialogTitle className="text-lg font-semibold text-gray-800">
        {isEditing ? "Editar Supervisor" : "Registrar Supervisor"}
      </DialogTitle>
    </DialogHeader>

    {/* Contenedor scrollable */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 py-5 px-1">
      {/* Cédula */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-gray-700 text-sm font-medium">Cédula</Label>
        <Input
          value={form.persona.cedula}
          onChange={(e) => onChangePersona("cedula", e.target.value)}
          readOnly={isEditing}
          className={`h-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
            isEditing ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
      </div>

      {/* Nombre */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-gray-700 text-sm font-medium">Nombre</Label>
        <Input
          value={form.persona.nombre}
          onChange={(e) => onChangePersona("nombre", e.target.value)}
          className="h-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Apellido */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-gray-700 text-sm font-medium">Apellido</Label>
        <Input
          value={form.persona.apellido}
          onChange={(e) => onChangePersona("apellido", e.target.value)}
          className="h-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Teléfono */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-gray-700 text-sm font-medium">Teléfono</Label>
        <Input
          value={form.persona.telefono ?? ""}
          onChange={(e) => onChangePersona("telefono", e.target.value)}
          className="h-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Correo */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-gray-700 text-sm font-medium">Correo</Label>
        <Input
          type="email"
          value={form.persona.correo}
          onChange={(e) => onChangePersona("correo", e.target.value)}
          className="h-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Dirección */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-gray-700 text-sm font-medium">Dirección</Label>
        <Input
          value={form.persona.direccion}
          onChange={(e) => onChangePersona("direccion", e.target.value)}
          className="h-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Género */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-gray-700 text-sm font-medium">Género</Label>
        <Select
          value={form.persona.genero}
          onValueChange={(value) => onChangePersona("genero", value)}
        >
          <SelectTrigger className="h-10 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
            <SelectValue placeholder="Seleccionar género" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Masculino">Masculino</SelectItem>
            <SelectItem value="Femenino">Femenino</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Fecha nacimiento */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-gray-700 text-sm font-medium">Fecha nacimiento</Label>
        <Input
          type="date"
          value={form.persona.fecha_nacimiento}
          onChange={(e) => onChangePersona("fecha_nacimiento", e.target.value)}
          className="h-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Contraseña */}
      {!isEditing && (
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label className="text-gray-700 text-sm font-medium">Contraseña</Label>
          <Input
            type="password"
            value={form.persona.contrasena}
            onChange={(e) => onChangePersona("contrasena", e.target.value)}
            placeholder="•••••••"
            className="h-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      )}

      {/* Especialidad */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-gray-700 text-sm font-medium">Especialidad</Label>
        <Input
          value={form.especialidad_seguridad}
          onChange={(e) => onChangeField("especialidad_seguridad", e.target.value)}
          className="h-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Empresa */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-gray-700 text-sm font-medium">Empresa</Label>
        <Select
          value={form.id_empresa_supervisor ? String(form.id_empresa_supervisor) : ""}
          onValueChange={(value) => onChangeField("id_empresa_supervisor", Number(value))}
        >
          <SelectTrigger className="h-10 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
            <SelectValue placeholder="Seleccionar empresa" />
          </SelectTrigger>
          <SelectContent>
            {empresas.length > 0 ? (
              empresas.map((empresa) => (
                <SelectItem key={empresa.id_Empresa} value={String(empresa.id_Empresa)}>
                  {empresa.nombreEmpresa}
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled value="">
                No hay empresas activas
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Experiencia */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-gray-700 text-sm font-medium">Experiencia (años)</Label>
        <Input
          type="number"
          value={form.experiencia}
          onChange={(e) => onChangeField("experiencia", Number(e.target.value))}
          className="h-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>
    </div>

    {/* Footer al final del scroll */}
    <DialogFooter className="pt-4 mt-4 border-t flex justify-end gap-3">
      <Button
        variant="outline"
        onClick={() => setOpenDialog(false)}
        className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-100"
      >
        Cancelar
      </Button>
      <Button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
      >
        {saving ? "Guardando..." : "Guardar"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </>
  )
}
