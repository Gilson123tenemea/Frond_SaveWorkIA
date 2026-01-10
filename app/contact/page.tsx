"use client"
import { useState } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Mail, Phone, MapPin, Send, Facebook, Instagram, Linkedin, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image";
import logo from "@/components/imagenes/logo_web.png";

export default function ContactPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Mensaje enviado exitosamente. Nos contactaremos pronto.")
    setFormData({ name: "", email: "", company: "", message: "" })
  }

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
              <Link href="/about" className="text-gray-600 hover:text-[#0D47A1] transition-colors">
                Sobre Nosotros
              </Link>
              <Link href="/contact" className="text-gray-900 font-semibold hover:text-[#0D47A1] transition-colors">
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
              Hablemos de tu <span className="text-[#0D47A1]">Proyecto</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Estamos listos para transformar la seguridad de tu empresa
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl border-2 border-gray-200 p-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Envíanos un Mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                  <Input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Juan Pérez"
                    className="w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="juan@empresa.com"
                    className="w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
                  <Input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Nombre de tu empresa"
                    className="w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Cuéntanos sobre tu proyecto..."
                    rows={5}
                    className="w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#0D47A1] text-white hover:bg-[#0D47A1]/90 font-semibold shadow-xl"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Enviar Mensaje
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Contact Details */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl border-2 border-gray-200 p-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Información de Contacto</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl border-2 border-blue-200 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-[#0D47A1]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Email</p>
                      <p className="text-gray-600">contacto@saveworkia.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-green-50 rounded-2xl border-2 border-green-200 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-[#4CAF50]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Teléfono</p>
                      <p className="text-gray-600">+51 999 888 777</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl border-2 border-blue-200 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#0D47A1]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Ubicación</p>
                      <p className="text-gray-600">Lima, Perú</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-3xl border-2 border-gray-200 p-10 shadow-md">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Síguenos</h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-14 h-14 bg-[#1877F2] hover:bg-[#1877F2]/90 rounded-2xl flex items-center justify-center transition-all shadow-md"
                  >
                    <Facebook className="w-6 h-6 text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-14 h-14 bg-gradient-to-br from-[#E4405F] via-[#C13584] to-[#833AB4] hover:opacity-90 rounded-2xl flex items-center justify-center transition-all shadow-md"
                  >
                    <Instagram className="w-6 h-6 text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-14 h-14 bg-[#0A66C2] hover:bg-[#0A66C2]/90 rounded-2xl flex items-center justify-center transition-all shadow-md"
                  >
                    <Linkedin className="w-6 h-6 text-white" />
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-gradient-to-br from-[#0D47A1] to-blue-600 rounded-3xl border-2 border-blue-700 p-10 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Horario de Atención</h3>
                </div>
                <div className="space-y-3 text-blue-50">
                  <p>
                    <strong className="text-white">Lunes - Viernes:</strong> 9:00 AM - 6:00 PM
                  </p>
                  <p>
                    <strong className="text-white">Sábado:</strong> 9:00 AM - 1:00 PM
                  </p>
                  <p>
                    <strong className="text-white">Domingo:</strong> Cerrado
                  </p>
                </div>
              </div>
            </div>
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
