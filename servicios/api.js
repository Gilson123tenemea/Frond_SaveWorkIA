// ✅ VERSIÓN CON PROXY
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Ahora todas las llamadas usan /api y Azure las redirige a tu backend HTTP