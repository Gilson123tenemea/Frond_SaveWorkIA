// src/servicios/api.js

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

if (process.env.NODE_ENV === 'development') {
  console.log('🌐 API URL:', BASE_URL);
}