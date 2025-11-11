import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Toaster } from "react-hot-toast"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'SAVEWORK IA',
  description: 'Creado por Gilson y Freddy',
  generator: 'Gilson y Freddy',
 // icons: {
 //   icon: [
 //     {
 //       url: '/icon-light-32x32.png',
 //       media: '(prefers-color-scheme: light)',
 //     },
 //     {
 //       url: '/icon-dark-32x32.png',
 //       media: '(prefers-color-scheme: dark)',
 //     },
 //     {
 //       url: '/icon.svg',
 //       type: 'image/svg+xml',
 //     },
 //   ],
 //   apple: '/apple-icon.png',
 // },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased bg-gray-50">
        {children}
        {/* ✅ Componente global de notificaciones */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
              fontWeight: 500,
              borderRadius: "10px",
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}


