// src/services/login.js
import { BASE_URL } from "./api";

const ADMIN_URL = `${BASE_URL}/administradores`;
const SUPERVISOR_URL = `${BASE_URL}/supervisores`;
const INSPECTOR_URL = `${BASE_URL}/inspectores`;


// --- Helper general para evitar doble json() ---
async function handleLoginResponse(response, defaultMessage) {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || defaultMessage)
  }
  return data
}

// --- Login administrador ---
export async function loginAdministrador(correo, contrasena) {
  const response = await fetch(`${ADMIN_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contrasena }),
  })
  return handleLoginResponse(response, "Error al iniciar sesión")
}

// --- Login supervisor ---
export async function loginSupervisor(correo, contrasena) {
  const response = await fetch(`${SUPERVISOR_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contrasena }),
  })
  return handleLoginResponse(response, "Error al iniciar sesión del supervisor")
}

// --- Login inspector ---
export async function loginInspector(correo, contrasena) {
  const response = await fetch(`${INSPECTOR_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contrasena }),
  });
  return handleLoginResponse(response, "Error al iniciar sesión del inspector");
}
