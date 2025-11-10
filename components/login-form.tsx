"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Camera, AlertTriangle } from "lucide-react"

// Mock users for authentication
const MOCK_USERS = [
  { email: "admin@savework.com", password: "admin123", role: "admin", name: "Carlos Admin" },
  { email: "supervisor@savework.com", password: "super123", role: "supervisor", name: "Maria Supervisor" },
  { email: "inspector@savework.com", password: "insp123", role: "inspector", name: "Juan Inspector" },
]

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (user) {
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(user))

      // Redirect based on role
      switch (user.role) {
        case "admin":
          router.push("/admin")
          break
        case "supervisor":
          router.push("/supervisor")
          break
        case "inspector":
          router.push("/inspector")
          break
      }
    } else {
      setError("Credenciales incorrectas. Por favor, verifica tu email y contraseña.")
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
          <Shield className="w-9 h-9 text-primary-foreground" />
        </div>
        <CardTitle className="text-3xl font-bold text-balance">SaveWorkIA</CardTitle>
        <CardDescription className="text-base">Sistema de Gestión de Seguridad Industrial</CardDescription>
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
      <CardFooter className="flex-col space-y-4">
        <div className="w-full border-t pt-4">
          <p className="text-sm text-muted-foreground text-center mb-3">Usuarios de prueba:</p>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 justify-between p-2 bg-muted/50 rounded">
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3" />
                <span className="font-medium">Admin:</span>
              </div>
              <span>admin@savework.com / admin123</span>
            </div>
            <div className="flex items-center gap-2 justify-between p-2 bg-muted/50 rounded">
              <div className="flex items-center gap-2">
                <Camera className="w-3 h-3" />
                <span className="font-medium">Supervisor:</span>
              </div>
              <span>supervisor@savework.com / super123</span>
            </div>
            <div className="flex items-center gap-2 justify-between p-2 bg-muted/50 rounded">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" />
                <span className="font-medium">Inspector:</span>
              </div>
              <span>inspector@savework.com / insp123</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
