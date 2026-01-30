/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ EXPORTAR COMO SITIO ESTÁTICO (requerido para Azure Static Web Apps)
  output: 'export',
  
  // Ignorar errores de TypeScript durante el build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Optimizaciones de imágenes para sitio estático
  images: {
    unoptimized: true,
  },
  
  // Variables de entorno disponibles en el navegador
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

export default nextConfig