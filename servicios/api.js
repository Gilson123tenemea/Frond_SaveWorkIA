// src/servicios/api.js

// Lee desde variables de entorno (Next.js usa NEXT_PUBLIC_ prefix)
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Log para debug (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  console.log('🌐 API URL:', BASE_URL);
}