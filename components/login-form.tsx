"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle } from "lucide-react"
import { loginAdministrador, loginSupervisor } from "../servicios/login"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      let userData = null
      let role = ""

      // 🔹 Intentar ADMINISTRADOR
      try {
        userData = await loginAdministrador(email, password)
        role = userData.role || "admin"
        console.log("✅ Login administrador exitoso:", userData)
      } catch (adminErr) {
        console.warn("⚠️ No es administrador:", adminErr)
      }

      // 🔹 Intentar SUPERVISOR si el admin falló
      if (!userData) {
        try {
          userData = await loginSupervisor(email, password)
          role = userData.rol || "supervisor"
          console.log("✅ Login supervisor exitoso:", userData)
        } catch (superErr) {
          console.warn("⚠️ No es supervisor:", superErr)
        }
      }

      // ❌ Si sigue sin datos, lanzar error final
      if (!userData) {
        throw new Error("Correo o contraseña incorrectos")
      }

      // ✅ Guardar usuario en localStorage
      const user = {
        email: userData.correo,
        name: userData.nombre,
        role: role,
      }
      localStorage.setItem("user", JSON.stringify(user))

      // ✅ Redirigir según el rol
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
        <CardTitle className="text-3xl font-bold">SaveWorkIA</CardTitle>
        <CardDescription>Sistema de Gestión de Seguridad Industrial</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
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
