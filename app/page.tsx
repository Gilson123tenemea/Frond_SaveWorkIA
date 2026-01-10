"use client"
import { Button } from "@/components/ui/button"
import { Shield, Camera, Users, BarChart, CheckCircle, ArrowRight, Sparkles, Smartphone, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image";
import logo from "@/components/imagenes/logo_web.png";

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src={logo}
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                  width={24}
                  height={24}
                />
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">SaveWorkIA</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-900 font-semibold hover:text-[#0D47A1] transition-colors">
                Inicio
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-[#0D47A1] transition-colors">
                Sobre Nosotros
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-[#0D47A1] transition-colors">
                Contacto
              </Link>
            </div>
            <Button
              onClick={() => router.push("/login")}
              className="bg-[#0D47A1] text-white hover:bg-[#0D47A1]/90 font-semibold shadow-lg"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxMywgNzEsIDE2MSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
                <Sparkles className="w-4 h-4 text-[#0D47A1]" />
                <span className="text-sm font-medium text-[#0D47A1]">
                  Inteligencia Artificial · Seguridad Industrial
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Protección. <span className="text-[#0D47A1]">Inteligencia.</span> Seguridad.
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                SaveWorkIA revoluciona la seguridad industrial mediante IA avanzada que detecta incumplimientos de EPP
                en tiempo real, protegiendo a tu equipo 24/7.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => router.push("/contact")}
                  className="bg-[#0D47A1] text-white hover:bg-[#0D47A1]/90 font-semibold text-lg px-8 shadow-xl"
                >
                  Solicitar Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/about")}
                  className="text-[#0D47A1] border-2 border-[#0D47A1] hover:bg-blue-50 text-lg px-8"
                >
                  Conocer Más
                </Button>
              </div>
            </div>

            {/* Right 3D Illustration */}
            <div className="relative h-[600px] flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative">
                  {/* Center platform */}
                  <div className="w-80 h-80 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl border-2 border-blue-200 shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-500"></div>

                    <div className="absolute inset-6 bg-gradient-to-br from-[#0D47A1] to-blue-600 rounded-2xl border border-blue-300 flex items-center justify-center shadow-xl">
                      <Shield className="w-32 h-32 text-white opacity-90" />
                    </div>
                  </div>

                  {/* Floating cards */}
                  <div className="absolute -top-10 -left-20 w-44 h-32 bg-white rounded-2xl border-2 border-blue-200 shadow-xl p-4 animate-float">
                    <div className="w-12 h-12 bg-[#0D47A1] rounded-xl flex items-center justify-center mb-3">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-900 font-semibold text-sm">Detección IA</p>
                    <p className="text-gray-600 text-xs mt-1">Tiempo Real</p>
                  </div>

                  <div className="absolute -top-10 -right-20 w-44 h-32 bg-white rounded-2xl border-2 border-blue-200 shadow-xl p-4 animate-float animation-delay-1000">
                    <div className="w-12 h-12 bg-[#4CAF50] rounded-xl flex items-center justify-center mb-3">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-900 font-semibold text-sm">Gestión</p>
                    <p className="text-gray-600 text-xs mt-1">Multi-Rol</p>
                  </div>

                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-44 h-32 bg-white rounded-2xl border-2 border-blue-200 shadow-xl p-4 animate-float animation-delay-2000">
                    <div className="w-12 h-12 bg-[#0D47A1] rounded-xl flex items-center justify-center mb-3">
                      <BarChart className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-900 font-semibold text-sm">Reportes</p>
                    <p className="text-gray-600 text-xs mt-1">Automáticos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Funcionalidades <span className="text-[#0D47A1]">Principales</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tecnología de vanguardia para proteger a tus trabajadores
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Camera,
                title: "Detección Automática",
                desc: "IA identifica incumplimientos de EPP en tiempo real",
                color: "#0D47A1",
              },
              {
                icon: Users,
                title: "Gestión Integral",
                desc: "Administra empresas, zonas y trabajadores",
                color: "#4CAF50",
              },
              {
                icon: BarChart,
                title: "Reportes Inteligentes",
                desc: "Análisis y estadísticas automatizadas",
                color: "#0D47A1",
              },
              {
                icon: Shield,
                title: "Seguridad Garantizada",
                desc: "Control de accesos y roles personalizados",
                color: "#4CAF50",
              },
            ].map((service, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#0D47A1] hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className="w-16 h-16 rounded-2xl border-2 border-gray-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${service.color}15` }}
                >
                  <service.icon className="w-8 h-8" style={{ color: service.color }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Roles del <span className="text-[#0D47A1]">Sistema</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cada rol con funciones específicas y permisos diferenciados
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Administrador",
                features: [
                  "Gestión total del sistema",
                  "Control de empresas",
                  "Usuarios y permisos",
                  "Cámaras y zonas",
                ],
              },
              {
                title: "Supervisor",
                features: [
                  "Monitoreo de trabajadores",
                  "Gestión de zonas",
                  "Asignación de inspectores",
                  "Detecciones IA",
                ],
              },
              {
                title: "Inspector",
                features: ["Inspección de zonas", "Registro de alertas", "Generación de reportes", "Seguimiento EPP"],
              },
            ].map((role, i) => (
              <div
                key={i}
                className="relative bg-white rounded-3xl border-2 border-gray-200 p-8 hover:border-[#0D47A1] hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">{role.title}</h3>
                  <ul className="space-y-3">
                    {role.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
                  <Smartphone className="w-4 h-4 text-[#0D47A1]" />
                  <span className="text-sm font-medium text-[#0D47A1]">Aplicación Móvil Exclusiva</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                  Acceso <span className="text-[#0D47A1]">Móvil</span> para Clientes
                </h2>
                <p className="text-xl text-gray-600">
                  Nuestra aplicación móvil exclusiva para Android permite a supervisores e inspectores gestionar la
                  seguridad desde cualquier lugar.
                </p>
                <ul className="space-y-3">
                  {[
                    "Monitoreo en tiempo real",
                    "Alertas instantáneas",
                    "Gestión de zonas y trabajadores",
                    "Reportes desde el móvil",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#4CAF50]" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  onClick={() => router.push("/contact")}
                  className="bg-[#0D47A1] text-white hover:bg-[#0D47A1]/90 font-semibold text-lg px-8 shadow-xl"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Solicitar Acceso a la App
                </Button>
              </div>

              <div className="relative h-[500px] flex items-center justify-center">
                <div className="relative w-72 h-[500px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-8 bg-gray-800 flex items-center justify-center">
                    <div className="w-24 h-6 bg-gray-900 rounded-full"></div>
                  </div>
                  <div className="pt-8 h-full bg-gradient-to-br from-[#0D47A1] to-blue-600 flex flex-col items-center justify-center p-6">
                  <div className="relative w-10 h-10 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src={logo}
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                  width={24}
                  height={24}
                />
              </div>
                    <h3 className="text-2xl font-bold text-white mb-2">SaveWorkIA</h3>
                    <p className="text-blue-100 text-center text-sm">App Móvil</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#0D47A1] to-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">¿Listo para proteger a tu equipo?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Únete a las empresas que ya confían en SaveWorkIA para garantizar la seguridad de sus trabajadores
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/contact")}
              className="bg-white text-[#0D47A1] hover:bg-gray-100 font-semibold text-lg px-12 shadow-2xl"
            >
              Contactar Ahora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              <div className="relative w-10 h-10 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src={logo}
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                  width={24}
                  height={24}
                />
              </div>
                <span className="text-xl font-bold text-gray-900">SaveWorkIA</span>
              </div>
              <p className="text-gray-600">Protegiendo trabajadores con IA avanzada</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Navegación</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/" className="hover:text-[#0D47A1] transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#0D47A1] transition-colors">
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#0D47A1] transition-colors">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/privacy" target="_blank" className="hover:text-[#0D47A1] transition-colors">
                    Privacidad y Términos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2026 SaveWorkIA. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
