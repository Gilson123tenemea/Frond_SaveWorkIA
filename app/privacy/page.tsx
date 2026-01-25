"use client"

import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft, FileText, Lock, Eye, CheckCircle, AlertCircle, Users, Database, Globe, Key, Clock, Mail, ChevronRight, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import logo from "@/components/imagenes/logo_web.png"

export default function PrivacyPage() {
    const router = useRouter()
    const [activeSection, setActiveSection] = useState("privacy")

    const privacyPoints = [
        { icon: Shield, title: "Encriptación AES-256", description: "Todos los datos protegidos con encriptación militar" },
        { icon: Database, title: "Backup Automático", description: "Copias de seguridad diarias en múltiples ubicaciones" },
        { icon: Users, title: "Control de Accesos", description: "Permisos granulares por rol y función" },
        { icon: Globe, title: "Cumplimiento Global", description: "GDPR, CCPA y regulaciones locales" }
    ]

    const complianceStandards = [
        { name: "GDPR", region: "Unión Europea", status: "Cumplido" },
        { name: "CCPA", region: "California, USA", status: "Cumplido" },
        { name: "LOPD", region: "España", status: "Cumplido" },
        { name: "LGPD", region: "Brasil", status: "En proceso" }
    ]

    const dataRights = [
        "Derecho de acceso a tus datos personales",
        "Derecho de rectificación de información inexacta",
        "Derecho de supresión (derecho al olvido)",
        "Derecho a la limitación del tratamiento",
        "Derecho a la portabilidad de datos",
        "Derecho de oposición al tratamiento"
    ]

    return (
        <div className="min-h-screen bg-white">
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
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
                            >
                                Sobre Nosotros
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
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
                            onClick={() => router.push("/")}
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-6 py-2 rounded-xl transition-all duration-300"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver al Inicio
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section Enhanced */}
            <section className="pt-36 pb-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Compromiso con la Seguridad y Transparencia</span>
                            </div>
                            
                            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
                                Privacidad y
                                <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                    Términos Legales
                                </span>
                            </h1>
                            
                            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                                Tu seguridad y privacidad son nuestra máxima prioridad. Conoce nuestras políticas de protección de datos y términos de servicio.
                            </p>
                        </div>

                        {/* Last Update & Quick Stats */}
                        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm max-w-2xl mx-auto">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Última actualización</div>
                                        <div className="text-gray-600">15 de Enero, 2026</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">100%</div>
                                        <div className="text-sm text-gray-600">Cumplimiento</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">0</div>
                                        <div className="text-sm text-gray-600">Incidentes</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation Tabs */}
            <section className="sticky top-16 bg-white border-b border-gray-100 z-40 shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex overflow-x-auto py-4">
                        <button
                            onClick={() => setActiveSection("privacy")}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                                activeSection === "privacy" 
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg" 
                                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                        >
                            <Shield className="w-5 h-5" />
                            Política de Privacidad
                        </button>
                        
                        <button
                            onClick={() => setActiveSection("terms")}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                                activeSection === "terms" 
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg" 
                                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                        >
                            <FileText className="w-5 h-5" />
                            Términos de Servicio
                        </button>
                        
                        <button
                            onClick={() => setActiveSection("security")}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                                activeSection === "security" 
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg" 
                                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                        >
                            <Lock className="w-5 h-5" />
                            Seguridad de Datos
                        </button>
                        
                        <button
                            onClick={() => setActiveSection("compliance")}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                                activeSection === "compliance" 
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg" 
                                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                        >
                            <CheckCircle className="w-5 h-5" />
                            Cumplimiento Normativo
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        {/* Privacy Policy Content */}
                        {activeSection === "privacy" && (
                            <div className="space-y-8">
                                <div className="bg-white rounded-3xl border-2 border-gray-200 p-10 shadow-lg">
                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center">
                                            <Shield className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-bold text-gray-900">Política de Privacidad</h2>
                                            <p className="text-gray-600 mt-2">Cómo protegemos y gestionamos tus datos</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-8">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <span className="font-bold text-blue-600">1</span>
                                                    </div>
                                                    Recopilación de Información
                                                </h3>
                                                <div className="space-y-3 text-gray-700">
                                                    <p className="leading-relaxed">
                                                        En SaveWorkIA, recopilamos únicamente la información necesaria para proporcionar y mejorar nuestros servicios de seguridad industrial.
                                                    </p>
                                                    <ul className="space-y-2 pl-5">
                                                        <li className="flex items-start gap-2">
                                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                            <span>Datos de empresas y usuarios para gestión de cuentas</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                            <span>Registros de detección de IA para seguridad laboral</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                            <span>Información técnica para optimización del servicio</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <span className="font-bold text-blue-600">2</span>
                                                    </div>
                                                    Uso de la Información
                                                </h3>
                                                <div className="space-y-3 text-gray-700">
                                                    <p className="leading-relaxed">
                                                        Utilizamos tus datos exclusivamente para los siguientes propósitos:
                                                    </p>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {[
                                                            "Proveer servicios de monitoreo de seguridad en tiempo real",
                                                            "Detectar incumplimientos de EPP mediante inteligencia artificial",
                                                            "Generar reportes analíticos de seguridad industrial",
                                                            "Mejorar y optimizar nuestros algoritmos de IA",
                                                            "Cumplir con regulaciones de seguridad laboral",
                                                            "Ofrecer soporte técnico y atención al cliente"
                                                        ].map((item, index) => (
                                                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                                                    <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                                                                </div>
                                                                <span className="text-gray-700">{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <span className="font-bold text-blue-600">3</span>
                                                    </div>
                                                    Derechos del Usuario
                                                </h3>
                                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                                                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Tus derechos incluyen:</h4>
                                                    <div className="space-y-3">
                                                        {dataRights.map((right, index) => (
                                                            <div key={index} className="flex items-center gap-3">
                                                                <Key className="w-4 h-4 text-blue-600" />
                                                                <span className="text-gray-700">{right}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                                                        <div className="flex items-center gap-3">
                                                            <Mail className="w-5 h-5 text-blue-600" />
                                                            <div>
                                                                <div className="font-semibold text-gray-900">Para ejercer tus derechos:</div>
                                                                <div className="text-blue-600">privacidad@saveworkia.com</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <span className="font-bold text-blue-600">4</span>
                                                    </div>
                                                    Compartir Información
                                                </h3>
                                                <div className="space-y-3 text-gray-700">
                                                    <p className="leading-relaxed">
                                                        No vendemos, intercambiamos ni transferimos tu información personal a terceros, excepto en los siguientes casos:
                                                    </p>
                                                    <div className="space-y-4">
                                                        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                                                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                <div className="font-semibold text-gray-900 mb-1">Casos Excepcionales</div>
                                                                <div className="text-gray-700 text-sm">
                                                                    • Requerimiento legal o judicial<br/>
                                                                    • Investigación de seguridad<br/>
                                                                    • Protección de derechos vitales
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                <div className="font-semibold text-gray-900 mb-1">Con tu Consentimiento</div>
                                                                <div className="text-gray-700 text-sm">
                                                                    • Integraciones con sistemas empresariales<br/>
                                                                    • Servicios de procesamiento autorizados
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Terms of Service Content */}
                        {activeSection === "terms" && (
                            <div className="space-y-8">
                                <div className="bg-white rounded-3xl border-2 border-gray-200 p-10 shadow-lg">
                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center">
                                            <FileText className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-bold text-gray-900">Términos de Servicio</h2>
                                            <p className="text-gray-600 mt-2">Condiciones para el uso de nuestra plataforma</p>
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        {[
                                            {
                                                title: "Aceptación de Términos",
                                                content: "Al acceder y utilizar SaveWorkIA, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de los términos, no podrá acceder al servicio.",
                                                icon: "📋"
                                            },
                                            {
                                                title: "Uso del Servicio",
                                                content: "SaveWorkIA proporciona una plataforma de seguridad industrial con detección de IA. Los usuarios deben utilizar el servicio de manera responsable, conforme a las leyes aplicables y respetando los derechos de terceros.",
                                                restrictions: [
                                                    "No utilizar el servicio para actividades ilegales",
                                                    "No intentar vulnerar la seguridad del sistema",
                                                    "No violar la privacidad de otros usuarios",
                                                    "No interferir con el funcionamiento normal del servicio"
                                                ],
                                                icon: "⚖️"
                                            },
                                            {
                                                title: "Cuentas de Usuario",
                                                content: "Los usuarios son responsables de mantener la confidencialidad de sus credenciales de acceso. Debe notificar inmediatamente cualquier uso no autorizado de su cuenta.",
                                                requirements: [
                                                    "Información veraz y actualizada",
                                                    "Contraseñas seguras y únicas",
                                                    "Notificación de actividades sospechosas",
                                                    "Responsabilidad por actividades en su cuenta"
                                                ],
                                                icon: "👤"
                                            },
                                            {
                                                title: "Propiedad Intelectual",
                                                content: "Todos los derechos de propiedad intelectual de SaveWorkIA y su contenido pertenecen a SaveWorkIA. No se permite la reproducción, distribución, modificación o uso comercial sin autorización expresa por escrito.",
                                                icon: "©️"
                                            },
                                            {
                                                title: "Limitación de Responsabilidad",
                                                content: "SaveWorkIA no se hace responsable de daños indirectos, incidentales o consecuentes derivados del uso o imposibilidad de uso del servicio. El servicio se proporciona 'tal cual' sin garantías implícitas de comerciabilidad o idoneidad para un propósito particular.",
                                                icon: "⚠️"
                                            },
                                            {
                                                title: "Modificaciones",
                                                content: "Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en esta página. El uso continuado del servicio constituye la aceptación de los términos modificados.",
                                                icon: "🔄"
                                            }
                                        ].map((term, index) => (
                                            <div key={index} className="border-l-4 border-blue-500 pl-6">
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="text-2xl">{term.icon}</div>
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{term.title}</h3>
                                                        <p className="text-gray-700 leading-relaxed">{term.content}</p>
                                                        
                                                        {term.restrictions && (
                                                            <div className="mt-4">
                                                                <h4 className="font-semibold text-gray-900 mb-2">Restricciones:</h4>
                                                                <ul className="space-y-2">
                                                                    {term.restrictions.map((item, i) => (
                                                                        <li key={i} className="flex items-center gap-2 text-gray-700">
                                                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                                                            {item}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        
                                                        {term.requirements && (
                                                            <div className="mt-4">
                                                                <h4 className="font-semibold text-gray-900 mb-2">Requisitos:</h4>
                                                                <ul className="space-y-2">
                                                                    {term.requirements.map((item, i) => (
                                                                        <li key={i} className="flex items-center gap-2 text-gray-700">
                                                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                                            {item}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Features */}
                        {activeSection === "security" && (
                            <div className="space-y-8">
                                <div className="bg-white rounded-3xl border-2 border-gray-200 p-10 shadow-lg">
                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center">
                                            <Lock className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-bold text-gray-900">Seguridad de Datos</h2>
                                            <p className="text-gray-600 mt-2">Medidas de protección de última generación</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* Security Features Grid */}
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Medidas de Protección</h3>
                                            <div className="space-y-4">
                                                {privacyPoints.map((point, index) => (
                                                    <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                                                                <point.icon className="w-6 h-6 text-white" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-gray-900 text-lg mb-1">{point.title}</h4>
                                                                <p className="text-gray-600">{point.description}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Security Stats */}
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Métricas de Seguridad</h3>
                                            <div className="space-y-6">
                                                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
                                                    <div className="text-5xl font-bold mb-2">99.99%</div>
                                                    <div className="text-blue-100">Disponibilidad del Servicio</div>
                                                    <div className="text-sm text-blue-200 mt-2">Uptime anual garantizado</div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-white rounded-xl p-4 border-2 border-gray-200 text-center">
                                                        <div className="text-2xl font-bold text-green-600">0</div>
                                                        <div className="text-gray-600 text-sm">Brechas 2025</div>
                                                    </div>
                                                    <div className="bg-white rounded-xl p-4 border-2 border-gray-200 text-center">
                                                        <div className="text-2xl font-bold text-blue-600">256-bit</div>
                                                        <div className="text-gray-600 text-sm">Encriptación</div>
                                                    </div>
                                                    <div className="bg-white rounded-xl p-4 border-2 border-gray-200 text-center">
                                                        <div className="text-2xl font-bold text-purple-600">30</div>
                                                        <div className="text-gray-600 text-sm">Auditorías anuales</div>
                                                    </div>
                                                    <div className="bg-white rounded-xl p-4 border-2 border-gray-200 text-center">
                                                        <div className="text-2xl font-bold text-amber-600">24/7</div>
                                                        <div className="text-gray-600 text-sm">Monitoreo</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Compliance Section */}
                        {activeSection === "compliance" && (
                            <div className="space-y-8">
                                <div className="bg-white rounded-3xl border-2 border-gray-200 p-10 shadow-lg">
                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center">
                                            <CheckCircle className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-bold text-gray-900">Cumplimiento Normativo</h2>
                                            <p className="text-gray-600 mt-2">Adherencia a estándares internacionales de privacidad</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Compliance Standards */}
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Estándares de Cumplimiento</h3>
                                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {complianceStandards.map((standard, index) => (
                                                    <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border-2 border-gray-200">
                                                        <div className="text-center">
                                                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                                                                standard.status === "Cumplido" ? "bg-green-100" : "bg-amber-100"
                                                            }`}>
                                                                <span className={`font-bold ${
                                                                    standard.status === "Cumplido" ? "text-green-600" : "text-amber-600"
                                                                }`}>
                                                                    {standard.status === "Cumplido" ? "✓" : "⏳"}
                                                                </span>
                                                            </div>
                                                            <div className="font-bold text-gray-900 text-lg mb-1">{standard.name}</div>
                                                            <div className="text-gray-600 text-sm mb-2">{standard.region}</div>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                standard.status === "Cumplido" 
                                                                ? "bg-green-100 text-green-700" 
                                                                : "bg-amber-100 text-amber-700"
                                                            }`}>
                                                                {standard.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Contact Information */}
                                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
                                            <div className="flex items-center gap-4 mb-6">
                                                <Mail className="w-8 h-8" />
                                                <div>
                                                    <h3 className="text-2xl font-bold">Oficina de Privacidad</h3>
                                                    <p className="text-blue-200">Contacto para consultas legales y de privacidad</p>
                                                </div>
                                            </div>
                                            
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <div className="font-semibold mb-1">Email Legal:</div>
                                                    <div className="text-blue-100">legal@saveworkia.com</div>
                                                </div>
                                                <div>
                                                    <div className="font-semibold mb-1">Email de Privacidad:</div>
                                                    <div className="text-blue-100">privacidad@saveworkia.com</div>
                                                </div>
                                                <div>
                                                    <div className="font-semibold mb-1">Horario de Atención:</div>
                                                    <div className="text-blue-100">Lunes a Viernes 9:00 - 18:00</div>
                                                </div>
                                                <div>
                                                    <div className="font-semibold mb-1">Tiempo de Respuesta:</div>
                                                    <div className="text-blue-100">Máximo 48 horas hábiles</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contact CTA Enhanced */}
                        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-3xl p-12 text-center shadow-xl">
                            <div className="max-w-2xl mx-auto">
                                <h3 className="text-4xl font-bold text-white mb-6">¿Tienes preguntas sobre privacidad?</h3>
                                <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                                    Nuestro equipo de privacidad está disponible para resolver cualquier duda sobre el manejo de tus datos y nuestras políticas de seguridad.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        size="lg"
                                        onClick={() => router.push("/contact")}
                                        className="bg-white text-blue-900 hover:bg-gray-100 font-bold text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 group"
                                    >
                                        Contactar al Equipo Legal
                                        <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                    
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        onClick={() => window.location.href = "mailto:privacidad@saveworkia.com"}
                                        className="border-2 border-white text-black hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300"
                                    >
                                        <Mail className="w-5 h-5 mr-2" />
                                        Email Directo
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Professional */}
            <footer className="border-t border-gray-200 bg-gray-50 py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
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
                                    Protegiendo trabajadores con IA avanzada desde 2023. Comprometidos con la seguridad y privacidad de datos.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4 text-lg">Enlaces Legales</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <a href="#" className="text-gray-600 hover:text-blue-700 transition-colors font-medium">
                                            Política de Privacidad
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-gray-600 hover:text-blue-700 transition-colors font-medium">
                                            Términos de Servicio
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-gray-600 hover:text-blue-700 transition-colors font-medium">
                                            Acuerdo de Procesamiento de Datos
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-gray-600 hover:text-blue-700 transition-colors font-medium">
                                            Política de Cookies
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4 text-lg">Información Legal</h3>
                                <ul className="space-y-3 text-gray-600 text-sm">
                                    <li>SaveWorkIA Inc.</li>
                                    <li>Registro Mercantil: 123456789</li>
                                    <li>Cuenca, Ecuador</li>
                                    <li>NIT: 9999999999</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
                            <p>&copy; 2026 SaveWorkIA. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

// Componente Link para evitar errores
function Link({ href, children, className, ...props }: any) {
    const router = useRouter()
    
    return (
        <button
            onClick={() => router.push(href)}
            className={className}
            {...props}
        >
            {children}
        </button>
    )
}