"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Eye, EyeOff, Lock, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import toast from "react-hot-toast"

import {
  obtenerPerfilInspector,
  actualizarPerfilInspector,
} from "@/servicios/inspector"
import { actualizarFotoPersona } from "@/servicios/persona"
import {
  solicitarCambioContrasena,
  confirmarCambioContrasena,
} from "@/servicios/cambio_contraseña"

interface InspectorProfileProps {
  open: boolean
  onClose: () => void
  idInspector?: number | null
}

export function InspectorProfile({
  open,
  onClose,
  idInspector,
}: InspectorProfileProps) {
  const [data, setData] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordStep, setPasswordStep] = useState<"request" | "verify">("request")
  const [isLoadingToken, setIsLoadingToken] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  })

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
  })

  const [passwordForm, setPasswordForm] = useState({
    nuevaContraseña: "",
    confirmarContraseña: "",
    token: "",
  })

  const [passwordErrors, setPasswordErrors] = useState({
    token: "",
    nuevaContraseña: "",
    confirmarContraseña: "",
  })

  // Validaciones de contraseña
  const passwordValidations = {
    minLength: passwordForm.nuevaContraseña.length >= 8,
    hasLowercase: /[a-z]/.test(passwordForm.nuevaContraseña),
    hasUppercase: /[A-Z]/.test(passwordForm.nuevaContraseña),
    hasNumber: /\d/.test(passwordForm.nuevaContraseña),
    hasSpecial: /[@$!%*#?&]/.test(passwordForm.nuevaContraseña),
  }

  const isPasswordValid = Object.values(passwordValidations).every(Boolean)

  useEffect(() => {
    if (open && idInspector) {
      obtenerPerfilInspector(idInspector).then((res) => {
        setData(res)
        setForm({
          nombre: res.nombre,
          apellido: res.apellido ?? "",
          correo: res.correo,
          telefono: res.telefono ?? "",
        })

        if (res.fotoBase64) {
          setProfileImage(`data:image/jpeg;base64,${res.fotoBase64}`)
        }
      })
    }
  }, [open, idInspector])

  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result as string
      setProfileImage(base64)

      toast.promise(
        actualizarFotoPersona(data.id_persona, base64),
        {
          loading: "Subiendo foto...",
          success: "Foto actualizada correctamente",
          error: "Error al subir la foto",
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
    }
    reader.readAsDataURL(file)
  }

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e: any) => {
    const { name, value } = e.target
    setPasswordForm({ ...passwordForm, [name]: value })

    if (passwordErrors[name as keyof typeof passwordErrors]) {
      setPasswordErrors({ ...passwordErrors, [name]: "" })
    }

    if (name === "confirmarContraseña" && passwordErrors.confirmarContraseña) {
      setPasswordErrors({ ...passwordErrors, confirmarContraseña: "" })
    }
  }

  const handleSave = async () => {
    if (!form.nombre || !form.correo || !form.apellido) {
      return toast.error("Completa todos los campos obligatorios")
    }

    try {
      await actualizarPerfilInspector(idInspector!, form)

      toast.success("Perfil actualizado correctamente", {
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
      })

      setData({ ...data, ...form })
      setEditMode(false)
    } catch {
      toast.error("Error al guardar los cambios", {
        style: {
          background: "#dc2626",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: 500,
          boxShadow: "0 2px 20px rgba(0, 0, 0, 0.25)",
        },
      })
    }
  }

  const handleCancel = () => {
    setForm({
      nombre: data.nombre,
      apellido: data.apellido ?? "",
      correo: data.correo,
      telefono: data.telefono ?? "",
    })
    setEditMode(false)
  }

  const handleClose = () => {
    if (editMode) {
      handleCancel()
    }
    onClose()
  }

  const handleRequestPasswordToken = async () => {
    if (!form.correo) {
      return toast.error("El correo es requerido")
    }

    if (!data?.id_persona) {
      return toast.error("No se pudo identificar el usuario")
    }

    setIsLoadingToken(true)

    try {
      await solicitarCambioContrasena(form.correo, data.id_persona)

      toast.success("Token enviado a tu correo", {
        style: {
          background: "#059669",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: 500,
          boxShadow: "0 2px 20px rgba(0, 0, 0, 0.25)",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#047857",
        },
      })

      setTimeout(() => {
        setPasswordStep("verify")
        setIsLoadingToken(false)
      }, 2000)
    } catch (error: any) {
      setIsLoadingToken(false)
      toast.error(error.message || "Error al enviar el token", {
        style: {
          background: "#dc2626",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: 500,
          boxShadow: "0 2px 20px rgba(0, 0, 0, 0.25)",
        },
      })
    }
  }

  const handleChangePassword = async () => {
    setPasswordErrors({
      token: "",
      nuevaContraseña: "",
      confirmarContraseña: "",
    })

    if (!passwordForm.token.trim()) {
      setPasswordErrors((prev) => ({ ...prev, token: "El token es obligatorio" }))
      return
    }

    if (!passwordForm.nuevaContraseña.trim()) {
      setPasswordErrors((prev) => ({
        ...prev,
        nuevaContraseña: "La contraseña es obligatoria",
      }))
      return
    }

    if (!passwordForm.confirmarContraseña.trim()) {
      setPasswordErrors((prev) => ({
        ...prev,
        confirmarContraseña: "Debes confirmar la contraseña",
      }))
      return
    }

    if (passwordForm.nuevaContraseña.length < 8) {
      setPasswordErrors((prev) => ({
        ...prev,
        nuevaContraseña: "La contraseña debe tener mínimo 8 caracteres",
      }))
      return
    }

    if (!isPasswordValid) {
      setPasswordErrors((prev) => ({
        ...prev,
        nuevaContraseña:
          "La contraseña debe tener mayúsculas, minúsculas, números y caracteres especiales (@$!%*#?&)",
      }))
      return
    }

    if (passwordForm.nuevaContraseña !== passwordForm.confirmarContraseña) {
      setPasswordErrors((prev) => ({
        ...prev,
        confirmarContraseña: "Las contraseñas no coinciden",
      }))
      return
    }

    if (!data?.id_persona) {
      return toast.error("No se pudo identificar el usuario")
    }

    setIsChangingPassword(true)

    try {
      await confirmarCambioContrasena(
        passwordForm.token,
        passwordForm.nuevaContraseña,
        data.id_persona
      )

      toast.success("Contraseña actualizada correctamente", {
        style: {
          background: "#059669",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: 500,
          boxShadow: "0 2px 20px rgba(0, 0, 0, 0.25)",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#047857",
        },
      })

      setShowPasswordModal(false)
      setPasswordStep("request")
      setPasswordForm({
        nuevaContraseña: "",
        confirmarContraseña: "",
        token: "",
      })
      setPasswordErrors({
        token: "",
        nuevaContraseña: "",
        confirmarContraseña: "",
      })
    } catch (error: any) {
      const errorMessage = error.message || "Error al cambiar la contraseña"

      if (
        errorMessage.includes("Token inválido") ||
        errorMessage.includes("Token") ||
        errorMessage.toLowerCase().includes("token")
      ) {
        setPasswordErrors((prev) => ({
          ...prev,
          token: errorMessage.includes("expirado")
            ? "El token ha expirado. Solicita uno nuevo"
            : errorMessage.includes("utilizado")
            ? "Este token ya fue utilizado"
            : "Token incorrecto o inválido",
        }))
      } else if (
        errorMessage.includes("contraseña") ||
        errorMessage.includes("mayúscula") ||
        errorMessage.includes("minúscula") ||
        errorMessage.includes("número") ||
        errorMessage.includes("caracter")
      ) {
        setPasswordErrors((prev) => ({
          ...prev,
          nuevaContraseña: errorMessage,
        }))
      } else {
        toast.error(errorMessage, {
          style: {
            background: "#dc2626",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: 500,
            boxShadow: "0 2px 20px rgba(0, 0, 0, 0.25)",
          },
        })
      }
    } finally {
      setIsChangingPassword(false)
    }
  }

  const closePasswordModal = () => {
    setShowPasswordModal(false)
    setPasswordStep("request")
    setIsLoadingToken(false)
    setPasswordForm({
      nuevaContraseña: "",
      confirmarContraseña: "",
      token: "",
    })
    setPasswordErrors({
      token: "",
      nuevaContraseña: "",
      confirmarContraseña: "",
    })
  }

  if (!data) return null

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 rounded-xl">
          {/* HEADER */}
          <div className="bg-primary text-primary-foreground px-5 py-3">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Perfil del Inspector
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="p-5 space-y-5">
            {/* FOTO + NOMBRE */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={profileImage || "/default-avatar.png"}
                  alt="Foto de perfil"
                  className="w-20 h-20 rounded-full object-cover border"
                />
                <label className="absolute -bottom-1 -right-1 bg-primary p-1 rounded-full cursor-pointer hover:bg-primary/90 transition">
                  <Camera className="w-4 h-4 text-white" />
                  <input 
                    type="file" 
                    hidden 
                    accept="image/*"
                    onChange={handleImageUpload} 
                  />
                </label>
              </div>

              <div>
                {editMode ? (
                  <div className="space-y-1">
                    <Input
                      name="nombre"
                      placeholder="Nombre"
                      value={form.nombre}
                      onChange={handleChange}
                    />
                    <Input
                      name="apellido"
                      placeholder="Apellido"
                      value={form.apellido}
                      onChange={handleChange}
                    />
                  </div>
                ) : (
                  <h2 className="font-semibold text-lg">
                    {data.nombre} {data.apellido}
                  </h2>
                )}
                <p className="text-sm text-muted-foreground">Inspector</p>
              </div>
            </div>

            {/* INFORMACIÓN PERSONAL */}
            <section>
              <h3 className="font-semibold mb-2">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <Label>Correo</Label>
                  {editMode ? (
                    <Input
                      name="correo"
                      value={form.correo}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{data.correo}</p>
                  )}
                </div>

                <div>
                  <Label>Teléfono</Label>
                  <p>{data.telefono || "No especificado"}</p>
                </div>

                <div>
                  <Label>Dirección</Label>
                  <p>{data.direccion || "No especificado"}</p>
                </div>

                <div>
                  <Label>Género</Label>
                  <p>{data.genero || "No especificado"}</p>
                </div>

                {/* CAMPO CONTRASEÑA */}
                <div className="md:col-span-2">
                  <Label>Contraseña</Label>
                  <div className="relative">
                    <Input
                      type="password"
                      value="••••••••••••"
                      disabled
                      className="bg-muted"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="text-sm text-primary hover:underline mt-1"
                  >
                    Cambiar contraseña
                  </button>
                </div>
              </div>
            </section>

            {/* INFORMACIÓN LABORAL */}
            <section>
              <h3 className="font-semibold mb-2">Información Laboral</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <Label>Especialidad</Label>
                  <p>{data.especialidad_seguridad || "No especificado"}</p>
                </div>
                <div>
                  <Label>Experiencia</Label>
                  <p>{data.experiencia ? `${data.experiencia} años` : "No especificado"}</p>
                </div>
              </div>
            </section>

            {/* INFORMACIÓN ADICIONAL */}
            <section>
              <h3 className="font-semibold mb-2">Información del Sistema</h3>
              <div className="bg-muted p-3 rounded text-sm space-y-1">
                <p>
                  <b>Frecuencia de Visita:</b> {data.frecuenciaVisita || "No especificado"}
                </p>
                <p>
                  <b>Estado:</b> <span className="text-green-600">Activo</span>
                </p>
              </div>
            </section>

            {/* BOTONES */}
            <div className="flex justify-end gap-2">
              {!editMode ? (
                <>
                  <Button variant="outline" size="sm" onClick={onClose}>
                    Cerrar
                  </Button>
                  <Button size="sm" onClick={() => setEditMode(true)}>
                    Editar
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Guardar
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DE CAMBIO DE CONTRASEÑA */}
      <Dialog open={showPasswordModal} onOpenChange={closePasswordModal}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Cambiar Contraseña
            </DialogTitle>
          </DialogHeader>

          <div className="pt-2">
            {isLoadingToken ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground mt-6">Enviando token...</p>
              </div>
            ) : passwordStep === "request" ? (
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Se enviará un token de validación a tu correo electrónico para verificar tu identidad.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold">Correo:</span> {form.correo}
                  </p>
                </div>
                <Button
                  onClick={handleRequestPasswordToken}
                  className="w-full"
                  size="lg"
                >
                  Enviar Token
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* TOKEN */}
                <div className="space-y-2">
                  <Label htmlFor="token" className="text-sm font-medium">
                    Token de Validación
                  </Label>
                  <Input
                    id="token"
                    name="token"
                    placeholder="Ingresa el token recibido por correo"
                    value={passwordForm.token}
                    onChange={handlePasswordChange}
                    className={`h-10 ${
                      passwordErrors.token
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                  />
                  {passwordErrors.token && (
                    <div className="flex items-start gap-1.5 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{passwordErrors.token}</span>
                    </div>
                  )}
                </div>

                {/* NUEVA CONTRASEÑA */}
                <div className="space-y-2">
                  <Label htmlFor="nuevaContraseña" className="text-sm font-medium">
                    Nueva Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="nuevaContraseña"
                      name="nuevaContraseña"
                      type={showPasswords.new ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={passwordForm.nuevaContraseña}
                      onChange={handlePasswordChange}
                      className={`h-10 pr-10 ${
                        passwordErrors.nuevaContraseña
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  {passwordErrors.nuevaContraseña && (
                    <div className="flex items-start gap-1.5 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{passwordErrors.nuevaContraseña}</span>
                    </div>
                  )}

                  {/* Indicadores de requisitos */}
                  {passwordForm.nuevaContraseña && !passwordErrors.nuevaContraseña && (
                    <div className="space-y-1.5 text-xs mt-2">
                      <div className="flex items-center gap-1.5">
                        {passwordValidations.minLength ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
                        )}
                        <span
                          className={
                            passwordValidations.minLength
                              ? "text-green-600"
                              : "text-muted-foreground"
                          }
                        >
                          Mínimo 8 caracteres
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {passwordValidations.hasLowercase ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
                        )}
                        <span
                          className={
                            passwordValidations.hasLowercase
                              ? "text-green-600"
                              : "text-muted-foreground"
                          }
                        >
                          Al menos una minúscula
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {passwordValidations.hasUppercase ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
                        )}
                        <span
                          className={
                            passwordValidations.hasUppercase
                              ? "text-green-600"
                              : "text-muted-foreground"
                          }
                        >
                          Al menos una mayúscula
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {passwordValidations.hasNumber ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
                        )}
                        <span
                          className={
                            passwordValidations.hasNumber
                              ? "text-green-600"
                              : "text-muted-foreground"
                          }
                        >
                          Al menos un número
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {passwordValidations.hasSpecial ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
                        )}
                        <span
                          className={
                            passwordValidations.hasSpecial
                              ? "text-green-600"
                              : "text-muted-foreground"
                          }
                        >
                          Al menos un caracter especial (@$!%*#?&)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* CONFIRMAR CONTRASEÑA */}
                <div className="space-y-2">
                  <Label htmlFor="confirmarContraseña" className="text-sm font-medium">
                    Confirmar Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmarContraseña"
                      name="confirmarContraseña"
                      type={showPasswords.confirm ? "text" : "password"}
                      placeholder="Repite la contraseña"
                      value={passwordForm.confirmarContraseña}
                      onChange={handlePasswordChange}
                      className={`h-10 pr-10 ${
                        passwordErrors.confirmarContraseña
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmarContraseña && (
                    <div className="flex items-start gap-1.5 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{passwordErrors.confirmarContraseña}</span>
                    </div>
                  )}
                </div>

                {/* BOTONES */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPasswordStep("request")
                      setPasswordForm({
                        nuevaContraseña: "",
                        confirmarContraseña: "",
                        token: "",
                      })
                      setPasswordErrors({
                        token: "",
                        nuevaContraseña: "",
                        confirmarContraseña: "",
                      })
                    }}
                    className="flex-1"
                    disabled={isChangingPassword}
                  >
                    Atrás
                  </Button>
                  <Button
                    onClick={handleChangePassword}
                    className="flex-1"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Cambiando...
                      </>
                    ) : (
                      "Cambiar Contraseña"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}