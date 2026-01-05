"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import toast from "react-hot-toast"

import {
  loginAdministrador,
  loginSupervisor,
  loginInspector,
} from "@/servicios/login"

import {
  solicitarCambioContrasena,
  confirmarCambioContrasena,
} from "@/servicios/cambio_contraseña"
import { buscarPersonaPorCorreo } from "@/servicios/persona"

export function LoginForm() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Estados para recuperación de contraseña
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState("request")
  const [isLoadingToken, setIsLoadingToken] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      let userData = null
      let role = ""

      // 🔹 ADMINISTRADOR
      try {
        userData = await loginAdministrador(email, password)
        role = userData.role || "admin"
      } catch {}

      // 🔹 SUPERVISOR
      if (!userData) {
        try {
          userData = await loginSupervisor(email, password)
          role = userData.rol || "supervisor"
        } catch {}
      }

      // 🔹 INSPECTOR
      if (!userData) {
        try {
          userData = await loginInspector(email, password)
          role = userData.rol || "inspector"
        } catch {}
      }

      if (!userData) {
        throw new Error("Correo o contraseña incorrectos")
      }

      // 🔹 Normalizar usuario
      const user = {
        id:
          userData.id_supervisor ||
          userData.id_administrador ||
          userData.id_inspector ||
          null,

        id_supervisor: userData.id_supervisor || null,
        id_administrador: userData.id_administrador || null,
        id_inspector: userData.id_inspector || null,

        id_empresa_supervisor: userData.id_empresa_supervisor || null,

        email: userData.correo,
        nombre: userData.nombre,
        role: role,
      }

      localStorage.setItem("user", JSON.stringify(user))

      // 🔀 Redirección por rol
      if (role === "admin") router.push("/admin")
      else if (role === "supervisor") router.push("/supervisor")
      else if (role === "inspector") router.push("/inspector")
      else throw new Error("Rol no reconocido")
    } catch (err) {
      if (err instanceof Error) setError(err.message)
      else setError("Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm({ ...passwordForm, [name]: value })

    if (passwordErrors[name as keyof typeof passwordErrors]) {
      setPasswordErrors({ ...passwordErrors, [name]: "" })
    }

    if (name === "confirmarContraseña" && passwordErrors.confirmarContraseña) {
      setPasswordErrors({ ...passwordErrors, confirmarContraseña: "" })
    }
  }

  const handleRequestPasswordToken = async () => {
    if (!recoveryEmail.trim()) {
      return toast.error("Por favor ingresa tu correo electrónico")
    }

    setIsLoadingToken(true)

    try {
      // 🔍 Buscar el id_persona por correo
      const personaData = await buscarPersonaPorCorreo(recoveryEmail)
      const id_persona = personaData.id_persona

      // 📧 Solicitar cambio de contraseña
      await solicitarCambioContrasena(recoveryEmail, id_persona)

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
        setForgotPasswordStep("verify")
        setIsLoadingToken(false)
      }, 2000)
    } catch (error) {
      setIsLoadingToken(false)
      const errorMessage = error instanceof Error ? error.message : "Error al enviar el token";
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

    setIsChangingPassword(true)

    try {
      // 🔍 Buscar el id_persona por correo
      const personaData = await buscarPersonaPorCorreo(recoveryEmail)
      const id_persona = personaData.id_persona

      await confirmarCambioContrasena(
        passwordForm.token,
        passwordForm.nuevaContraseña,
        id_persona
      )

      toast.success(
        "Contraseña actualizada correctamente. Ahora puedes iniciar sesión",
        {
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
        }
      )

      closeForgotPasswordModal()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al cambiar la contraseña";

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

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false)
    setForgotPasswordStep("request")
    setIsLoadingToken(false)
    setRecoveryEmail("")
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

  return (
    <>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
            <Shield className="w-9 h-9 text-primary-foreground" />
          </div>

          <CardTitle className="text-3xl font-bold">SaveWorkIA</CardTitle>

          <CardDescription>
            Sistema de Gestión de Seguridad Industrial
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* CONTRASEÑA CON OJITO 👁️ */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* ENLACE OLVIDÉ MI CONTRASEÑA */}
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-sm text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* ERROR */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* BOTÓN */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground text-center">
          Usa el correo y contraseña registrados en FastAPI.
        </CardFooter>
      </Card>

      {/* MODAL DE RECUPERACIÓN DE CONTRASEÑA */}
      <Dialog open={showForgotPasswordModal} onOpenChange={closeForgotPasswordModal}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Recuperar Contraseña
            </DialogTitle>
          </DialogHeader>

          <div className="pt-2">
            {isLoadingToken ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground mt-6">
                  Enviando token...
                </p>
              </div>
            ) : forgotPasswordStep === "request" ? (
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ingresa tu correo electrónico y te enviaremos un token de
                  validación para restablecer tu contraseña.
                </p>

                <div className="space-y-2">
                  <Label htmlFor="recovery-email">Correo Electrónico</Label>
                  <Input
                    id="recovery-email"
                    type="email"
                    placeholder="ejemplo@empresa.com"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="h-10"
                  />
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
                  {passwordForm.nuevaContraseña &&
                    !passwordErrors.nuevaContraseña && (
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
                  <Label
                    htmlFor="confirmarContraseña"
                    className="text-sm font-medium"
                  >
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
                      setForgotPasswordStep("request")
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