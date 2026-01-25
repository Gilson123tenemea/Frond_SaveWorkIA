"use client"

import { useState } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Mail, Phone, MapPin, Send, Facebook, Instagram, Linkedin, Clock, MessageSquare, CheckCircle, Calendar, Headphones, Building, User, Zap, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import logo from "@/components/imagenes/logo_web.png"

export default function ContactPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
    contactType: "demo" // demo, support, partnership, other
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulación de envío (reemplazar con API real)
    setTimeout(() => {
      console.log("Form data:", formData)
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({ name: "", email: "", company: "", phone: "", message: "", contactType: "demo" })
      }, 3000)
    }, 1500)
  }

  const contactTypes = [
    { id: "demo", label: "Solicitar Demo", icon: Calendar, description: "Demo personalizada del producto" },
    { id: "support", label: "Soporte Técnico", icon: Headphones, description: "Asistencia y consultas técnicas" },
    { id: "partnership", label: "Alianza Comercial", icon: Building, description: "Oportunidades de negocio" },
    { id: "other", label: "Otro", icon: MessageSquare, description: "Otra consulta" }
  ]

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Corporativo",
      details: ["contacto@saveworkia.com", "ventas@saveworkia.com"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Phone,
      title: "Teléfonos",
      details: ["+593 99 888 7777", "+593 98 777 6666"],
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: MapPin,
      title: "Oficinas",
      details: ["Cuenca, Ecuador - Sede Principal", "Quito, Ecuador - Sucursal"],
      color: "from-purple-500 to-purple-600"
    }
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
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
              >
                Sobre Nosotros
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link 
                href="/contact" 
                className="text-blue-600 font-semibold relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
              >
                Contacto
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
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200">
              <MessageSquare className="w-4 h-4" />
              <span>Estamos aquí para ayudarte</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
              Hablemos de tu
              <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Proyecto
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Transforma la seguridad de tu empresa con nuestra tecnología de IA. Agenda una demo personalizada o consulta con nuestros expertos.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Type Selection */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Cómo podemos ayudarte?</h2>
              <p className="text-gray-600">Selecciona el tipo de consulta para brindarte mejor atención</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {contactTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFormData({...formData, contactType: type.id})}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    formData.contactType === type.id 
                    ? "border-blue-600 bg-blue-50 shadow-md" 
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      formData.contactType === type.id 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-600"
                    }`}>
                      <type.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-500 mt-1">{type.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Contact Form - Enhanced */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl border-2 border-gray-200 p-10 shadow-lg">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Envíanos tu Consulta</h2>
                    <p className="text-gray-600">Te responderemos en menos de 24 horas</p>
                  </div>
                </div>
                
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">¡Mensaje Enviado!</h3>
                    <p className="text-gray-600 mb-6">
                      Gracias por contactarnos. Uno de nuestros especialistas se comunicará contigo pronto.
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                      <Zap className="w-4 h-4" />
                      <span>Respuesta en 24 horas máximo</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <User className="w-4 h-4 inline mr-2" />
                          Nombre Completo
                        </label>
                        <Input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Juan Pérez"
                          className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Correo Electrónico
                        </label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="juan@empresa.com"
                          className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Building className="w-4 h-4 inline mr-2" />
                          Empresa
                        </label>
                        <Input
                          type="text"
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Nombre de tu empresa"
                          className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Teléfono
                        </label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+593 99 888 7777"
                          className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MessageSquare className="w-4 h-4 inline mr-2" />
                        Mensaje
                      </label>
                      <Textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={`Describe tu proyecto o consulta relacionada con ${
                          contactTypes.find(t => t.id === formData.contactType)?.label.toLowerCase() || "tu proyecto"
                        }...`}
                        rows={6}
                        className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 py-6 text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Enviar Mensaje
                        </>
                      )}
                    </Button>
                    
                    <p className="text-sm text-gray-500 text-center">
                      Al enviar este formulario, aceptas nuestra{' '}
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        Política de Privacidad
                      </Link>
                    </p>
                  </form>
                )}
              </div>
              
              {/* Quick Contact Info */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-6 h-6" />
                  <h3 className="text-xl font-bold">¿Necesitas respuesta inmediata?</h3>
                </div>
                <p className="text-blue-100 mb-4">
                  Llama a nuestro equipo de ventas para una consulta rápida
                </p>
                <div className="text-2xl font-bold">+593 99 888 7777</div>
                <p className="text-blue-200 text-sm mt-1">Disponible de Lunes a Viernes 9AM - 6PM</p>
              </div>
            </div>

            {/* Contact Info - Enhanced */}
            <div className="space-y-8">
              {/* Contact Details Cards */}
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <info.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
                        <div className="space-y-2">
                          {info.details.map((detail, i) => (
                            <p key={i} className="text-gray-700">{detail}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media - Enhanced */}
              <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Conéctate con Nosotros</h3>
                <p className="text-gray-600 mb-6">
                  Síguenos en redes sociales para estar al día con las últimas novedades en seguridad industrial con IA.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <a
                    href="#"
                    className="group bg-[#1877F2] hover:bg-[#1877F2]/90 rounded-2xl p-6 flex flex-col items-center justify-center text-white transition-all duration-300 hover:-translate-y-1"
                  >
                    <Facebook className="w-8 h-8 mb-3" />
                    <span className="font-medium">Facebook</span>
                    <span className="text-sm opacity-80">@SaveWorkIA</span>
                  </a>
                  <a
                    href="#"
                    className="group bg-gradient-to-br from-[#E4405F] via-[#C13584] to-[#833AB4] hover:opacity-90 rounded-2xl p-6 flex flex-col items-center justify-center text-white transition-all duration-300 hover:-translate-y-1"
                  >
                    <Instagram className="w-8 h-8 mb-3" />
                    <span className="font-medium">Instagram</span>
                    <span className="text-sm opacity-80">@SaveWorkIA</span>
                  </a>
                  <a
                    href="#"
                    className="group bg-[#0A66C2] hover:bg-[#0A66C2]/90 rounded-2xl p-6 flex flex-col items-center justify-center text-white transition-all duration-300 hover:-translate-y-1"
                  >
                    <Linkedin className="w-8 h-8 mb-3" />
                    <span className="font-medium">LinkedIn</span>
                    <span className="text-sm opacity-80">SaveWorkIA</span>
                  </a>
                </div>
              </div>

              {/* Hours - Enhanced */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Clock className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Horario de Atención</h3>
                    <p className="text-indigo-200">Estamos disponibles para ayudarte</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-white/20">
                    <span className="font-medium">Lunes - Viernes</span>
                    <span className="font-bold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/20">
                    <span className="font-medium">Sábado</span>
                    <span className="font-bold">9:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Domingo</span>
                    <span className="font-bold text-red-200">Cerrado</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Soporte de emergencia 24/7 para clientes activos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section - Updated for Cuenca, Ecuador */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Ubicación</h2>
              <p className="text-gray-600">Visítanos en nuestras oficinas principales en Cuenca, Ecuador</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl border-2 border-gray-200 p-8">
              <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Cuenca, Ecuador</h3>
                  <p className="text-gray-600 text-lg mb-4">Centro Empresarial Ciudadela</p>
                  <p className="text-gray-500 mb-6">Av. Fray Vicente Solano, Edificio Torre Azul, Piso 8</p>
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6"
                    onClick={() => window.open("https://maps.google.com/?q=Cuenca+Ecuador+SaveWorkIA", "_blank")}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Ver en Google Maps
                  </Button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center bg-white p-4 rounded-xl border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">5min</div>
                  <div className="text-gray-600">Del centro histórico</div>
                </div>
                <div className="text-center bg-white p-4 rounded-xl border border-gray-200">
                  <div className="text-xl font-bold text-blue-600">Estacionamiento</div>
                  <div className="text-gray-600">Gratuito para visitas</div>
                </div>
                <div className="text-center bg-white p-4 rounded-xl border border-gray-200">
                  <div className="text-xl font-bold text-blue-600">Acceso</div>
                  <div className="text-gray-600">Transporte público cercano</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
              <p className="text-xl text-gray-600">Respuestas rápidas a tus dudas más comunes</p>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  question: "¿Cuánto tiempo toma implementar SaveWorkIA?",
                  answer: "La implementación básica toma entre 1-2 semanas, dependiendo del tamaño de tu empresa. Ofrecemos planes de implementación acelerada para casos urgentes."
                },
                {
                  question: "¿Necesito hardware especial para usar la plataforma?",
                  answer: "No, SaveWorkIA funciona con cámaras IP estándar. Solo necesitas cámaras con conexión a internet y nuestros sistemas se encargan del resto."
                },
                {
                  question: "¿Ofrecen capacitación para mi equipo?",
                  answer: "Sí, incluimos capacitación completa para todos los usuarios y soporte continuo para asegurar una adopción exitosa."
                },
                {
                  question: "¿Puedo probar la plataforma antes de comprar?",
                  answer: "¡Absolutamente! Ofrecemos una demo personalizada gratuita donde mostramos el funcionamiento completo adaptado a tus necesidades."
                },
                {
                  question: "¿Tienen oficinas en otras ciudades de Ecuador?",
                  answer: "Sí, además de nuestra sede principal en Cuenca, contamos con sucursal en Quito para atender a clientes en la región norte del país."
                },
                {
                  question: "¿Ofrecen soporte técnico en español?",
                  answer: "Sí, todo nuestro equipo de soporte habla español nativo y está disponible para asistencia técnica en tu idioma."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-300 transition-all duration-300">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/privacy")}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Ver más preguntas frecuentes
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Professional - Updated for Ecuador */}
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
                Protegiendo trabajadores con IA avanzada desde 2023. Soluciones empresariales de seguridad industrial en Ecuador.
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
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Contacto Rápido</h3>
              <ul className="space-y-3">
                <li className="text-gray-600">📧 contacto@saveworkia.com</li>
                <li className="text-gray-600">📱 +593 99 888 7777</li>
                <li className="text-gray-600">📍 Cuenca, Ecuador</li>
                <li>
                  <Button
                    size="sm"
                    onClick={() => router.push("/contact")}
                    className="mt-2 bg-blue-600 hover:bg-blue-700"
                  >
                    Enviar Mensaje
                  </Button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2026 SaveWorkIA. Todos los derechos reservados. Cuenca, Ecuador</p>
          </div>
        </div>
      </footer>
    </div>
  )
}