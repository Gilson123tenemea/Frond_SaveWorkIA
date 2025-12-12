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
import { Alert, AlertDescription } from "@/components/ui/alert"

import {
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react"

import {
  loginAdministrador,
  loginSupervisor,
  loginInspector,
} from "../servicios/login"

export function LoginForm() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      let userData: any = null
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
        name: userData.nombre,
        role: role,
      }

      localStorage.setItem("user", JSON.stringify(user))

      // 🔀 Redirección por rol
      if (role === "admin") router.push("/admin")
      else if (role === "supervisor") router.push("/supervisor")
      else if (role === "inspector") router.push("/inspector")
      else throw new Error("Rol no reconocido")

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError("Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
          <Shield className="w-9 h-9 text-primary-foreground" />
        </div>

        <CardTitle className="text-3xl font-bold">
          SaveWorkIA
        </CardTitle>

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
  )
}
