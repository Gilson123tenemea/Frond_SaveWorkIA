"use client"
import { Button } from "@/components/ui/button"
import { Shield, Target, Eye, Zap, Award, CheckCircle, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image";
import logo from "@/components/imagenes/logo_web.png";

export default function AboutPage() {
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
              <Link href="/" className="text-gray-600 hover:text-[#0D47A1] transition-colors">
                Inicio
              </Link>
              <Link href="/about" className="text-gray-900 font-semibold hover:text-[#0D47A1] transition-colors">
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
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
              Sobre <span className="text-[#0D47A1]">Nosotros</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Somos pioneros en soluciones de seguridad industrial impulsadas por inteligencia artificial
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl border-2 border-gray-200 p-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">¿Quiénes Somos?</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                SaveWorkIA nace de la visión de un equipo de desarrolladores especializados en tecnología e innovación,
                comprometidos con transformar la seguridad industrial mediante inteligencia artificial.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Nuestra plataforma representa la convergencia entre tecnología de vanguardia y la necesidad crítica de
                proteger la vida de los trabajadores en entornos industriales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl border-2 border-gray-200 p-10 hover:border-[#0D47A1] hover:shadow-xl transition-all group">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl border-2 border-blue-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-10 h-10 text-[#0D47A1]" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Misión</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Revolucionar la seguridad industrial mediante IA avanzada que detecta, previene y reporta
                incumplimientos de EPP en tiempo real, protegiendo vidas y optimizando operaciones.
              </p>
            </div>

            <div className="bg-white rounded-3xl border-2 border-gray-200 p-10 hover:border-[#4CAF50] hover:shadow-xl transition-all group">
              <div className="w-20 h-20 bg-green-50 rounded-2xl border-2 border-green-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Eye className="w-10 h-10 text-[#4CAF50]" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Visión</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Ser la plataforma líder global en seguridad industrial con IA, reconocida por salvar vidas, transformar
                empresas y establecer nuevos estándares de protección laboral.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Nuestros <span className="text-[#0D47A1]">Valores</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Zap,
                title: "Innovación",
                desc: "Tecnología de vanguardia aplicada a seguridad industrial",
                color: "#0D47A1",
              },
              {
                icon: Shield,
                title: "Protección",
                desc: "Compromiso absoluto con la seguridad de cada trabajador",
                color: "#4CAF50",
              },
              {
                icon: Award,
                title: "Excelencia",
                desc: "Calidad superior en cada aspecto de nuestra plataforma",
                color: "#0D47A1",
              },
            ].map((value, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 p-8 text-center hover:border-[#0D47A1] hover:shadow-xl transition-all group"
              >
                <div
                  className="w-20 h-20 rounded-2xl border-2 border-gray-200 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${value.color}15` }}
                >
                  <value.icon className="w-10 h-10" style={{ color: value.color }} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto bg-white rounded-3xl border-2 border-gray-200 p-12 shadow-xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">¿Qué Ofrecemos?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Plataforma web completa de gestión",
                "Detección IA en tiempo real",
                "Sistema de roles multi-nivel",
                "Aplicación móvil empresarial",
                "Reportes automáticos inteligentes",
                "Soporte técnico especializado 24/7",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-[#4CAF50] flex-shrink-0" />
                  <span className="text-gray-700 text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-[#0D47A1] to-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Transforma la seguridad de tu empresa</h2>
            <Button
              size="lg"
              onClick={() => router.push("/contact")}
              className="bg-white text-[#0D47A1] hover:bg-gray-100 font-semibold text-lg px-12 shadow-2xl"
            >
              Contáctanos Ahora
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
