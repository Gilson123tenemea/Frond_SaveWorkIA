import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import "leaflet/dist/leaflet.css" // ⬅️ obligatorio para Leaflet
import { Toaster } from "react-hot-toast"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SAVEWORK IA",
  description: "Creado por Gilson y Freddy",
  generator: "Gilson y Freddy",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased bg-gray-50">

        {/* CONTENIDO DE LA APP */}
        {children}

        {/* 🔥 ÚNICO TOASTER GLOBAL */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
              fontWeight: 500,
              borderRadius: "10px",
              maxWidth: "420px",
            },
          }}
        />

        <Analytics />
      </body>
    </html>
  )
}
