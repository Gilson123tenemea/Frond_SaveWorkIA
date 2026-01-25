"use client"

import { Button } from "@/components/ui/button"
import { Shield, Target, Eye, Zap, Award, CheckCircle, ArrowRight, Users, Globe, TrendingUp, Heart, Building, Clock, BarChart, Headphones, Cpu, Rocket } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import logo from "@/components/imagenes/logo_web.png"
import { useState } from "react"

export default function AboutPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("historia")

  const teamMembers = [
    {
      name: "Dr. Ana Rodríguez",
      role: "CEO & Fundadora",
      expertise: "IA & Visión Computacional",
      experience: "15+ años",
      image: "👩‍🔬"
    },
    {
      name: "Ing. Carlos Méndez",
      role: "CTO",
      expertise: "Machine Learning & DevOps",
      experience: "12+ años",
      image: "👨‍💻"
    },
    {
      name: "Dra. Laura Gómez",
      role: "Directora de Seguridad",
      expertise: "Seguridad Industrial",
      experience: "18+ años",
      image: "👩‍🏭"
    },
    {
      name: "Lic. Pedro Vargas",
      role: "Director Comercial",
      expertise: "Transformación Digital",
      experience: "10+ años",
      image: "👨‍💼"
    }
  ]

  const milestones = [
    { year: "2023", title: "Fundación", description: "Investigación y desarrollo inicial", icon: Rocket },
    { year: "2024", title: "Primer Cliente", description: "Implementación exitosa en industria minera", icon: Building },
    { year: "2025", title: "Expansión", description: "Presencia en 10 países de Latinoamérica", icon: Globe },
    { year: "2026", title: "Innovación", description: "Premio a la Innovación en Seguridad", icon: Award }
  ]

  const certifications = [
    "ISO 45001:2018 - Seguridad y Salud",
    "ISO 27001 - Seguridad de la Información",
    "GDPR Compliance",
    "Certificación en IA Ética"
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Professional */}
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
                />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  SaveWorkIA
                </span>
                <p className="text-xs text-gray-500">Inteligencia para la seguridad</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
              >
                Inicio
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/about"
                className="text-blue-600 font-semibold relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
              >
                Sobre Nosotros
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
              >
                Contacto
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
            </div>

            <Button
              onClick={() => router.push("/login")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2 rounded-xl"
            >
              Acceso Plataforma
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced */}
      <section className="pt-36 pb-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200">
                <Heart className="w-4 h-4" />
                <span>Comprometidos con la seguridad laboral</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
                Sobre <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Nosotros</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Somos pioneros en soluciones de seguridad industrial impulsadas por inteligencia artificial.
                Combinamos tecnología de vanguardia con pasión por proteger vidas.
              </p>
            </div>

            {/* Stats Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <div className="text-blue-100">Empresas Protegidas</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">50K+</div>
                  <div className="text-blue-100">Trabajadores Monitoreados</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">99.8%</div>
                  <div className="text-blue-100">Precisión en Detección</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">15+</div>
                  <div className="text-blue-100">Países</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Historia y Visión con Tabs - Enhanced */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setActiveTab("historia")}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${activeTab === "historia"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white"
                    }`}
                >
                  Nuestra Historia
                </button>
                <button
                  onClick={() => setActiveTab("vision")}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${activeTab === "vision"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white"
                    }`}
                >
                  Visión Estratégica
                </button>
                <button
                  onClick={() => setActiveTab("equipo")}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${activeTab === "equipo"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white"
                    }`}
                >
                  Nuestro Equipo
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl border-2 border-gray-200 p-12 shadow-lg">
              {activeTab === "historia" ? (
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-lg text-gray-700 leading-relaxed">
                        SaveWorkIA nació en 2023 de la visión compartida de un equipo multidisciplinario de ingenieros,
                        científicos de datos y expertos en seguridad industrial. Observamos una brecha crítica entre la
                        tecnología disponible y las necesidades reales de protección en entornos industriales.
                      </p>
                      <p className="text-lg text-gray-700 leading-relaxed">
                        Lo que comenzó como un proyecto de investigación universitaria se transformó en una solución
                        empresarial completa, validada por más de 500 implementaciones exitosas en sectores como minería,
                        construcción, petróleo y manufactura.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <p className="text-lg text-gray-700 leading-relaxed">
                        Nuestro enfoque siempre ha sido claro: utilizar la inteligencia artificial para prevenir
                        accidentes antes de que ocurran, no solo para reportarlos después.
                      </p>
                      <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center gap-3 mb-3">
                          <Target className="w-6 h-6 text-blue-600" />
                          <h3 className="font-bold text-gray-900">Objetivo Inicial</h3>
                        </div>
                        <p className="text-gray-600">
                          Reducir accidentes laborales en un 70% mediante detección preventiva con IA
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeTab === "vision" ? (
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">Visión Estratégica</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-lg text-gray-700 leading-relaxed">
                        Aspiramos a crear un mundo donde ningún trabajador sufra accidentes prevenibles. Nuestra visión
                        es ser el estándar global en seguridad industrial predictiva, integrando IA en cada aspecto de
                        la protección laboral.
                      </p>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                        <h3 className="font-bold text-gray-900 mb-2">Meta 2030</h3>
                        <p className="text-gray-600">
                          Expandir nuestra tecnología a 50 países y reducir accidentes en un 90%
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 text-lg">Nuestros Pilares Estratégicos</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Cpu className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-gray-700">Innovación continua en IA</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Globe className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-gray-700">Expansión global responsable</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-gray-700">Formación y capacitación continua</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">Nuestro Equipo</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-lg text-gray-700 leading-relaxed">
                        Contamos con un equipo multidisciplinario de más de 50 profesionales especializados en IA,
                        seguridad industrial, desarrollo de software y gestión empresarial.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                          <div className="text-2xl font-bold text-blue-600">50+</div>
                          <div className="text-sm text-gray-600">Expertos</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                          <div className="text-2xl font-bold text-blue-600">15+</div>
                          <div className="text-sm text-gray-600">Nacionalidades</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-900">Áreas de Especialización</h3>
                      <ul className="space-y-2">
                        <li className="text-gray-700">• Visión por computadora y Machine Learning</li>
                        <li className="text-gray-700">• Seguridad industrial y normativas</li>
                        <li className="text-gray-700">• Desarrollo de software empresarial</li>
                        <li className="text-gray-700">• Experiencia de usuario (UX/UI)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Nuestra <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Trayectoria</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Un viaje de innovación y compromiso con la seguridad industrial
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-600 via-blue-400 to-blue-600 hidden md:block" />

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    {/* Content Card */}
                    <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                            <milestone.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-blue-600">{milestone.year}</div>
                            <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                          </div>
                        </div>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white border-4 border-blue-600 rounded-full z-10 hidden md:flex items-center justify-center">
                      <div className="w-4 h-4 bg-blue-600 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Liderazgo <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Ejecutivo</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expertos apasionados que guían nuestra visión y estrategia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-300"
              >
                <div className="w-24 h-24 text-5xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  {member.image}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <div className="text-blue-600 font-semibold mb-2">{member.role}</div>
                <div className="text-gray-700 mb-3">{member.expertise}</div>
                <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  {member.experience}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Awards */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Certificaciones y <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Reconocimientos</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Certifications */}
              <div className="bg-white rounded-3xl border-2 border-gray-200 p-10 shadow-lg">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Shield className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Certificaciones</h3>
                </div>
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Awards */}
              <div className="bg-white rounded-3xl border-2 border-gray-200 p-10 shadow-lg">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <Award className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Premios</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Innovación en Seguridad 2025</div>
                    <div className="text-gray-600 text-sm">Mejor solución de IA para seguridad industrial</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Tech Excellence Award 2024</div>
                    <div className="text-gray-600 text-sm">Implementación tecnológica destacada</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Premio a la Responsabilidad Social</div>
                    <div className="text-gray-600 text-sm">Compromiso con la seguridad laboral</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer - Enhanced */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Lo que <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Ofrecemos</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Soluciones integrales para cada necesidad de seguridad industrial
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Cpu,
                  title: "Plataforma Web Completa",
                  description: "Gestión centralizada con dashboard intuitivo",
                  features: ["Multi-empresa", "Roles personalizados", "API Integración"]
                },
                {
                  icon: BarChart,
                  title: "Analítica Predictiva",
                  description: "Reportes inteligentes y métricas avanzadas",
                  features: ["KPIs en tiempo real", "Tendencias históricas", "Alertas proactivas"]
                },
                {
                  icon: Headphones,
                  title: "Soporte 24/7",
                  description: "Equipo técnico especializado disponible siempre",
                  features: ["Asistencia remota", "Capacitación continua", "Updates regulares"]
                },
                {
                  icon: Shield,
                  title: "Seguridad Garantizada",
                  description: "Protección de datos y cumplimiento normativo",
                  features: ["Encriptación AES-256", "Backup automático", "Auditorías"]
                },
                {
                  icon: TrendingUp,
                  title: "Escalabilidad",
                  description: "Crece con tu empresa sin límites",
                  features: ["Infraestructura cloud", "Multi-sede", "Integración ERP"]
                },
                {
                  icon: Globe,
                  title: "Cobertura Global",
                  description: "Soluciones adaptadas a cada mercado",
                  features: ["Multi-idioma", "Normativas locales", "Soporte regional"]
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <ul className="space-y-2">
                    {item.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
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
              <Shield className="w-4 h-4" />
              <span>Compromiso con la Excelencia</span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              ¿Listo para Proteger a tu Equipo con la Mejor Tecnología?
            </h2>

            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Descubre cómo SaveWorkIA puede transformar la seguridad de tu empresa. Más de 500 empresas ya confían en nosotros.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.push("/contact")}
                className="bg-white text-blue-900 hover:bg-gray-100 font-bold text-lg px-10 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 group"
              >
                Solicitar Reunión con Expertos
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/login")}
                className="relative border-2 border-white/40 text-black font-semibold px-10 py-6 text-lg rounded-xl transition-all duration-300 overflow-hidden group hover:border-white/60 hover:bg-white/5"
              >
                <span className="relative z-30">Acceso Demo</span> 
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500" /> {/* Reduce opacidad */}
              </Button>
            </div>

            <p className="text-white/90 mt-8 text-sm font-medium tracking-wide">
              Demo gratuita • Implementación personalizada • Soporte técnico 24/7
            </p>
          </div>
        </div>
      </section>

      {/* Footer Professional */}
      <footer className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
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

            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Enlaces Rápidos</h3>
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

            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Soluciones</h3>
              <ul className="space-y-3">
                <li className="text-gray-600 font-medium">Detección de EPP</li>
                <li className="text-gray-600 font-medium">Monitoreo en Tiempo Real</li>
                <li className="text-gray-600 font-medium">Analítica Predictiva</li>
                <li className="text-gray-600 font-medium">Gestión Centralizada</li>
              </ul>
            </div>

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

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2026 SaveWorkIA. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}