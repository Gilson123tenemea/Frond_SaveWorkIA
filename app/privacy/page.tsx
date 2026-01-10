"use client"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft, FileText, Lock, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image";
import logo from "@/components/imagenes/logo_web.png";

export default function PrivacyPage() {
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
                        <Button
                            onClick={() => router.push("/")}
                            variant="outline"
                            className="border-[#0D47A1] text-[#0D47A1] hover:bg-blue-50"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver al Inicio
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-12 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="w-20 h-20 bg-[#0D47A1] rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Image
                                src={logo}
                                alt="Logo"
                                className="w-15 h-15 object-contain"
                                width={24}
                                height={24}
                            />
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">
                            Privacidad y <span className="text-[#0D47A1]">Términos</span>
                        </h1>
                        <p className="text-lg text-gray-600">Última actualización: Enero 2026</p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* Privacy Policy */}
                        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl border-2 border-gray-200 p-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl border-2 border-blue-200 flex items-center justify-center">
                                    <Eye className="w-7 h-7 text-[#0D47A1]" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">Política de Privacidad</h2>
                            </div>

                            <div className="space-y-6 text-gray-700">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">1. Recopilación de Información</h3>
                                    <p className="leading-relaxed">
                                        En SaveWorkIA, recopilamos información necesaria para proporcionar nuestros servicios de seguridad
                                        industrial. Esto incluye datos de empresas, usuarios, trabajadores, y registros de detección de IA
                                        para fines de seguridad laboral.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">2. Uso de la Información</h3>
                                    <p className="leading-relaxed">
                                        Utilizamos la información recopilada para: proporcionar servicios de monitoreo de seguridad,
                                        detectar incumplimientos de EPP mediante inteligencia artificial, generar reportes de seguridad,
                                        mejorar nuestros servicios, y cumplir con regulaciones de seguridad industrial.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">3. Protección de Datos</h3>
                                    <p className="leading-relaxed">
                                        Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos contra acceso no
                                        autorizado, alteración, divulgación o destrucción. Los datos se almacenan de forma segura y se
                                        accede solo por personal autorizado.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">4. Compartir Información</h3>
                                    <p className="leading-relaxed">
                                        No vendemos ni compartimos información personal con terceros, excepto cuando sea necesario para
                                        proporcionar nuestros servicios o cuando lo requiera la ley.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">5. Derechos del Usuario</h3>
                                    <p className="leading-relaxed">
                                        Los usuarios tienen derecho a acceder, rectificar, eliminar y limitar el procesamiento de sus datos
                                        personales. Para ejercer estos derechos, contactar a: privacidad@saveworkia.com
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Terms of Service */}
                        <div className="bg-white rounded-3xl border-2 border-gray-200 p-10 shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-green-50 rounded-2xl border-2 border-green-200 flex items-center justify-center">
                                    <FileText className="w-7 h-7 text-[#4CAF50]" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">Términos de Servicio</h2>
                            </div>

                            <div className="space-y-6 text-gray-700">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">1. Aceptación de Términos</h3>
                                    <p className="leading-relaxed">
                                        Al acceder y utilizar SaveWorkIA, usted acepta estar sujeto a estos términos y condiciones. Si no
                                        está de acuerdo, no utilice nuestros servicios.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">2. Uso del Servicio</h3>
                                    <p className="leading-relaxed">
                                        SaveWorkIA proporciona una plataforma de seguridad industrial con detección de IA. Los usuarios
                                        deben utilizar el servicio de manera responsable y conforme a las leyes aplicables. Está prohibido
                                        el uso malintencionado o que viole la privacidad de terceros.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">3. Cuentas de Usuario</h3>
                                    <p className="leading-relaxed">
                                        Los usuarios son responsables de mantener la confidencialidad de sus credenciales de acceso.
                                        Notificar inmediatamente cualquier uso no autorizado de su cuenta.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">4. Propiedad Intelectual</h3>
                                    <p className="leading-relaxed">
                                        Todos los derechos de propiedad intelectual de SaveWorkIA y su contenido pertenecen a SaveWorkIA. No
                                        se permite la reproducción, distribución o modificación sin autorización expresa.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">5. Limitación de Responsabilidad</h3>
                                    <p className="leading-relaxed">
                                        SaveWorkIA no se hace responsable de daños indirectos, incidentales o consecuentes derivados del uso
                                        o imposibilidad de uso del servicio. El servicio se proporciona "tal cual" sin garantías implícitas.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">6. Modificaciones</h3>
                                    <p className="leading-relaxed">
                                        Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en
                                        vigor inmediatamente después de su publicación en esta página.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">7. Contacto</h3>
                                    <p className="leading-relaxed">
                                        Para preguntas sobre estos términos, contáctenos en: legal@saveworkia.com
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact CTA */}
                        <div className="bg-gradient-to-br from-[#0D47A1] to-blue-600 rounded-3xl p-10 text-center">
                            <h3 className="text-3xl font-bold text-white mb-4">¿Tienes preguntas sobre privacidad?</h3>
                            <p className="text-blue-100 mb-6 text-lg">
                                Estamos aquí para ayudarte con cualquier inquietud sobre tus datos
                            </p>
                            <Button
                                size="lg"
                                onClick={() => router.push("/contact")}
                                className="bg-white text-[#0D47A1] hover:bg-gray-100 font-semibold text-lg px-8 shadow-xl"
                            >
                                Contáctanos
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-gray-50 py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-gray-600">
                        <p>&copy; 2026 SaveWorkIA. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
