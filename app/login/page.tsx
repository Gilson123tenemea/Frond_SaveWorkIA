import { LoginForm } from "../../components/login-form"
import { Home, Users, Phone, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-success/5">
      {/* Header elegante */}
      <header className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Inicio a la izquierda */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold text-gray-900 hover:text-primary transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Home className="w-4 h-4 text-primary" />
                </div>
                <span className="hidden md:inline">Inicio</span>
              </Link>
            </div>

            {/* Navegación central */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary font-medium transition-colors"
              >
                Inicio
              </Link>
              <Link
                href="/sobre-nosotros"
                className="text-gray-700 hover:text-primary font-medium transition-colors"
              >
                Sobre Nosotros
              </Link>
              <Link
                href="/contacto"
                className="text-gray-700 hover:text-primary font-medium transition-colors"
              >
                Contacto
              </Link>
            </nav>

            {/* Versión móvil del menú */}
            <div className="flex items-center md:hidden space-x-4">
              <Link
                href="/sobre-nosotros"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Sobre Nosotros"
              >
                <Users className="w-5 h-5 text-gray-600" />
              </Link>
              <Link
                href="/contacto"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Contacto"
              >
                <Phone className="w-5 h-5 text-gray-600" />
              </Link>
            </div>

            {/* Botón Atrás */}
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Atrás</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <LoginForm />
          
          {/* Enlaces útiles */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex justify-center space-x-6">
              <Link 
                href="/sobre-nosotros" 
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                Sobre Nosotros
              </Link>
              <Link 
                href="/contacto" 
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                Contacto
              </Link>
              <Link 
                href="/demo" 
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                Demo
              </Link>
            </div>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Todos los derechos reservados
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}