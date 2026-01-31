// ./api.js o donde definas BASE_URL
export const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://saveworkia-backend-api-a6cpdfeuexgecka3.canadacentral-01.azurewebsites.net"
);

// Asegurar que siempre sea HTTPS
export const getSecureBaseUrl = () => {
  const url = BASE_URL;
  return url.startsWith('http:') ? url.replace('http:', 'https:') : url;
};