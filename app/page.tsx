"use client"

import { Button } from "@/components/ui/button"
import { Shield, Camera, Users, BarChart, CheckCircle, ArrowRight, Sparkles, Smartphone, Download, Zap, Target, Award, Globe, Clock, Star, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import logo from "@/components/imagenes/logo_web.png"
import { useState } from "react"

export default function Home() {
  const router = useRouter()
  const [hoveredService, setHoveredService] = useState<number | null>(null)

  const stats = [
    { value: "99.8%", label: "Precisión en detección", icon: Target },
    { value: "24/7", label: "Monitoreo continuo", icon: Clock },
    { value: "85%", label: "Reducción de accidentes", icon: Shield },
    { value: "50+", label: "Países", icon: Globe }
  ]

  const testimonials = [
    {
      name: "Ing. Carlos Méndez",
      company: "Minera Andina",
      content: "Desde que implementamos SaveWorkIA, redujimos accidentes laborales en un 85%.",
      rating: 5
    },
    {
      name: "Dra. María Fernández",
      company: "Petroquímica SA",
      content: "La mejor inversión en seguridad industrial. La IA detecta riesgos antes que nuestros supervisores.",
      rating: 5
    },
    {
      name: "Ing. Luis Gómez",
      company: "Constructora Norte",
      content: "Sistema intuitivo y efectivo. Los reportes automáticos han transformado nuestra gestión.",
      rating: 4
    }
  ]

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation Professional */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Image
                  src={logo}
                  alt="SaveWorkIA Logo"
                  className="w-10 h-10 object-contain"
                  width={40}
                  height={40}
                  priority
                />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                  SaveWorkIA
                </span>
                <p className="text-xs text-gray-500">Inteligencia Industrial Avanzada</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-blue-700 font-semibold relative group"
              >
                Inicio
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-700 transition-colors font-medium relative group"
              >
                Sobre Nosotros
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-700 transition-colors font-medium relative group"
              >
                Contacto
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            </div>

            <Button
              onClick={() => router.push("/login")}
              className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2 rounded-xl"
            >
              Plataforma
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Professional Redesign */}
      <section className="pt-40 pb-32 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                <Sparkles className="w-4 h-4" />
                <span>Revolucionando la Seguridad Industrial con IA</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Seguridad Industrial
                <span className="block bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                  Reinventada con IA
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Protege a tus trabajadores con nuestra plataforma de detección de EPP en tiempo real.
                Tecnología de punta que previene accidentes y salva vidas.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 max-w-md">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <stat.icon className="w-5 h-5 text-blue-700" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={() => router.push("/contact")}
                  className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold text-lg px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  Solicitar Demo Gratis
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/about")}
                  className="border-2 border-gray-300 hover:border-blue-700 hover:text-blue-700 text-gray-700 font-semibold text-lg px-8 py-6 rounded-xl transition-all duration-300"
                >
                  Ver Soluciones
                </Button>
              </div>
            </div>

            {/* Right 3D Illustration - Enhanced */}
            <div className="relative h-[600px] flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Main Platform */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-96 h-96">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl blur-xl opacity-20 animate-pulse" />

                    {/* Platform */}
                    <div className="relative w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-3xl border-2 border-gray-200 shadow-2xl p-8">
                      {/* Center Shield */}
                      <div className="w-full h-full bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl flex flex-col items-center justify-center p-6">
                        <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                          <Shield className="w-16 h-16 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">SaveWorkIA</h3>
                        <p className="text-blue-200 text-center">Inteligencia Artificial para Seguridad Industrial</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                {[
                  {
                    icon: Camera,
                    title: "Detección IA",
                    subtitle: "Tiempo Real",
                    color: "bg-blue-600",
                    position: "top-0 left-0"
                  },
                  {
                    icon: Users,
                    title: "Gestión",
                    subtitle: "Multi-Rol",
                    color: "bg-emerald-600",
                    position: "top-0 right-0"
                  },
                  {
                    icon: BarChart,
                    title: "Analítica",
                    subtitle: "Predictiva",
                    color: "bg-indigo-600",
                    position: "bottom-0 left-1/4"
                  },
                  {
                    icon: Zap,
                    title: "Alertas",
                    subtitle: "Inmediatas",
                    color: "bg-amber-600",
                    position: "bottom-0 right-1/4"
                  }
                ].map((card, index) => (
                  <div
                    key={index}
                    className={`absolute ${card.position} w-48 h-32 bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-4 animate-float animation-delay-${index * 1000} hover:scale-105 transition-transform duration-300`}
                    style={{ animationDelay: `${index * 1000}ms` }}
                  >
                    <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-900 font-bold text-sm">{card.title}</p>
                    <p className="text-gray-600 text-xs mt-1">{card.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-blue-700 mb-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
              <span className="text-sm font-semibold tracking-wider uppercase">SOLUCIONES INTEGRALES</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Plataforma Completa de
              <span className="block bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                Seguridad Industrial
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Todo lo que necesitas para proteger a tu equipo en una sola plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Camera,
                title: "Visión por Computadora",
                description: "Algoritmos de IA que detectan EPP en tiempo real con 99.8% de precisión",
                features: ["Detección en tiempo real", "Múltiples cámaras", "Análisis continuo"],
                color: "from-blue-600 to-blue-700"
              },
              {
                icon: Shield,
                title: "Protección Total",
                description: "Sistema de alertas y prevención de accidentes automatizado",
                features: ["Alertas inmediatas", "Protocolos automáticos", "Respuesta rápida"],
                color: "from-emerald-600 to-emerald-700"
              },
              {
                icon: BarChart,
                title: "Analítica Avanzada",
                description: "Dashboard con métricas y reportes detallados de seguridad",
                features: ["KPIs en tiempo real", "Reportes personalizados", "Tendencias"],
                color: "from-indigo-600 to-indigo-700"
              },
              {
                icon: Users,
                title: "Gestión Centralizada",
                description: "Control completo de empresas, zonas, trabajadores y supervisores",
                features: ["Multi-empresa", "Roles diferenciados", "Gestión remota"],
                color: "from-amber-600 to-amber-700"
              }
            ].map((service, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                onMouseEnter={() => setHoveredService(index)}
                onMouseLeave={() => setHoveredService(null)}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>

                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-blue-700 hover:text-blue-800 hover:bg-blue-50"
                    >
                      Saber más
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-blue-700 mb-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
              <span className="text-sm font-semibold tracking-wider uppercase">TESTIMONIOS</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Confiado por
              <span className="block bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                Líderes Industriales
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 p-8 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 italic text-lg mb-8 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="border-t border-gray-200 pt-6">
                  <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Section - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                  <Smartphone className="w-4 h-4" />
                  <span>App Móvil Exclusiva</span>
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                  Control Total desde
                  <span className="block bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                    tu Smartphone
                  </span>
                </h2>

                <p className="text-xl text-gray-600">
                  Nuestra aplicación móvil exclusiva permite gestión completa de seguridad industrial desde cualquier lugar.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Shield, text: "Alertas en tiempo real" },
                    { icon: Camera, text: "Vista de cámaras" },
                    { icon: BarChart, text: "Reportes móviles" },
                    { icon: Users, text: "Gestión de equipos" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-blue-700" />
                      </div>
                      <span className="text-gray-700 font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <a
                    href="/downloads/app-release.apk"
                    download="SaveWorkIA.apk"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Descargar Aplicación
                  </a>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-gray-300 hover:border-blue-700 hover:text-blue-700 text-gray-700 px-8 py-6 rounded-xl transition-all duration-300"
                  >
                    Ver Características
                  </Button>
                </div>


              </div>

              {/* Mobile Mockup - Enhanced */}
              <div className="relative">
                <div className="relative w-80 h-[600px] mx-auto">
                  {/* Device Frame */}
                  <div className="absolute inset-0 bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden">
                    {/* Notch */}
                    <div className="absolute top-0 inset-x-0 h-8 bg-gray-800 flex items-center justify-center">
                      <div className="w-40 h-6 bg-gray-900 rounded-full"></div>
                    </div>

                    {/* Screen Content */}
                    <div className="pt-12 h-full bg-gradient-to-br from-blue-50 to-gray-50">
                      {/* App Header */}
                      <div className="bg-gradient-to-r from-blue-700 to-blue-800 p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              <Image
                                src={logo}
                                alt="Logo"
                                className="w-8 h-8 object-contain"
                                width={24}
                                height={24}
                              />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white">SaveWorkIA</h3>
                              <p className="text-blue-200 text-xs">App Móvil</p>
                            </div>
                          </div>
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Bell className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* App Content */}
                      <div className="p-6 space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="text-2xl font-bold text-gray-900">12</div>
                            <div className="text-sm text-gray-600">Cámaras activas</div>
                          </div>
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="text-2xl font-bold text-gray-900">0</div>
                            <div className="text-sm text-gray-600">Alertas hoy</div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { icon: Camera, label: "Cámaras" },
                            { icon: Users, label: "Equipo" },
                            { icon: BarChart, label: "Reportes" }
                          ].map((action, index) => (
                            <button
                              key={index}
                              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <action.icon className="w-6 h-6 text-blue-700 mx-auto mb-2" />
                              <span className="text-xs text-gray-700">{action.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Notification */}
                  <div className="absolute -right-4 top-1/4 bg-white rounded-xl p-4 shadow-2xl border border-gray-200 animate-bounce">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Alerta detectada</div>
                        <div className="text-sm text-gray-600">Zona B - Sin casco</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              <span>Solución Empresarial Premium</span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              ¿Listo para Transformar la
              <span className="block">Seguridad de tu Empresa?</span>
            </h2>

            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Únete a más de 500 empresas líderes que ya protegen a sus trabajadores con tecnología de punta.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.push("/contact")}
                className="bg-white text-blue-900 hover:bg-gray-100 font-bold text-lg px-10 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 group"
              >
                Solicitar Demo Personalizada
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/login")}
                className="border-2 border-white/70 text-white bg-white/5 hover:bg-white/10 hover:border-white font-semibold px-10 py-6 text-lg rounded-xl transition-all duration-300 backdrop-blur-sm shadow-lg"
              >
                Acceso Clientes
              </Button>
            </div>

            <p className="text-blue-200 mt-8 text-sm">
              Demo gratuita • Implementación en 72 horas • Soporte 24/7
            </p>
          </div>
        </div>
      </section>

      {/* Footer Professional */}
      <footer className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                  <Image
                    src={logo}
                    alt="Logo"
                    className="w-8 h-8 object-contain"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                    SaveWorkIA
                  </span>
                  <p className="text-xs text-gray-500">Inteligencia Industrial</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Protegiendo trabajadores con IA avanzada desde 2023. Soluciones empresariales de seguridad industrial.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Navegación</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-blue-700 transition-colors font-medium">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-blue-700 transition-colors font-medium">
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-blue-700 transition-colors font-medium">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-600 hover:text-blue-700 transition-colors font-medium">
                    Plataforma
                  </Link>
                </li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Soluciones</h3>
              <ul className="space-y-3">
                <li className="text-gray-600 font-medium">Detección de EPP</li>
                <li className="text-gray-600 font-medium">Monitoreo en Tiempo Real</li>
                <li className="text-gray-600 font-medium">Analítica Predictiva</li>
                <li className="text-gray-600 font-medium">Gestión Centralizada</li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-blue-700 transition-colors font-medium">
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-blue-700 transition-colors font-medium">
                    Términos de Servicio
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-blue-700 transition-colors font-medium">
                    Soporte
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 text-sm">
                &copy; 2026 SaveWorkIA. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">contacto@saveworkia.com</span>
                <span className="text-gray-600 text-sm">+51 999 888 777</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  )
}

// Missing icon component
function AlertTriangle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function Bell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}