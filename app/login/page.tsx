import { LoginForm } from "../../components/login-form"
import { Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import logo from "@/components/imagenes/logo_web.png"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation Professional - Igual al Home */}
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
                className="text-gray-700 hover:text-blue-700 transition-colors font-medium relative group"
              >
                Inicio
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 rounded-full" />
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

            <Link
              href="/"
              className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2 rounded-xl flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Volver al Inicio</span>
              <span className="sm:hidden">Inicio</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 pt-32">
        <div className="w-full max-w-md">
          <LoginForm />
          
          {/* Enlaces útiles */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex justify-center space-x-6">
              <Link 
                href="/about" 
                className="text-sm text-gray-600 hover:text-blue-700 transition-colors font-medium"
              >
                Sobre Nosotros
              </Link>
              <Link 
                href="/contact" 
                className="text-sm text-gray-600 hover:text-blue-700 transition-colors font-medium"
              >
                Contacto
              </Link>
              <Link 
                href="/" 
                className="text-sm text-gray-600 hover:text-blue-700 transition-colors font-medium"
              >
                Inicio
              </Link>
            </div>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} SaveWorkIA. Todos los derechos reservados
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}