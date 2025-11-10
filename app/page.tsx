"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield, Camera, Users, AlertTriangle, ArrowRight } from "lucide-react"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-success/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center">
            <Shield className="w-12 h-12 text-primary-foreground" />
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-balance">SaveWorkIA</h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl">
              Plataforma inteligente de gestión y monitoreo de seguridad industrial con detección de EPP impulsada por
              IA
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex gap-4">
            <Button size="lg" onClick={() => router.push("/login")} className="gap-2">
              Iniciar Sesión
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-16">
            <div className="p-6 bg-card border rounded-lg space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Monitoreo en Tiempo Real</h3>
              <p className="text-sm text-muted-foreground">
                Vigilancia continua de zonas de trabajo con cámaras inteligentes
              </p>
            </div>

            <div className="p-6 bg-card border rounded-lg space-y-3">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold">Detección de EPP con IA</h3>
              <p className="text-sm text-muted-foreground">
                Identificación automática de equipos de protección personal
              </p>
            </div>

            <div className="p-6 bg-card border rounded-lg space-y-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Gestión de Personal</h3>
              <p className="text-sm text-muted-foreground">Control completo de trabajadores y supervisores por zona</p>
            </div>

            <div className="p-6 bg-card border rounded-lg space-y-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold">Alertas Inteligentes</h3>
              <p className="text-sm text-muted-foreground">Notificaciones inmediatas de incumplimientos de seguridad</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
