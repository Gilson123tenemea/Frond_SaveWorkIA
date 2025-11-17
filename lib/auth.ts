"use client"

export type UserRole = "admin" | "supervisor" | "inspector"

//
// 🔹 Interfaz User compatible con todos los logins
//
export interface User {
  id: number | null

  // ADMIN
  id_administrador?: number | null

  // SUPERVISOR
  id_supervisor?: number | null
  id_empresa_supervisor?: number | null

  // INSPECTOR
  id_inspector?: number | null
  id_supervisor_trabajador?: number | null

  // DATOS GENERALES
  correo: string
  nombre: string
  role: UserRole

  // Compatibilidad con código antiguo
  email?: string
  name?: string
}

//
// 🔹 Guardar usuario después del login
//
export function saveUser(data: any) {
  const user: User = {
    id: null,

    // Puede venir de admin, supervisor o inspector
    id_administrador: data.id_administrador ?? null,
    id_supervisor: data.id_supervisor ?? null,
    id_empresa_supervisor: data.id_empresa_supervisor ?? null,
    id_inspector: data.id_inspector ?? null,
    id_supervisor_trabajador: data.id_supervisor_trabajador ?? null,

    correo: data.correo,
    nombre: data.nombre,
    role: data.rol,

    // Compatibilidad
    email: data.correo,
    name: data.nombre
  }

  localStorage.setItem("user", JSON.stringify(user))
}

//
// 🔹 Obtener usuario actual
//
export function getUser(): User | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem("user")
  if (!stored) return null

  try {
    return JSON.parse(stored) as User
  } catch {
    return null
  }
}

//
// 🔹 Cerrar sesión
//
export function logout() {
  localStorage.removeItem("user")
  window.location.href = "/"
}

//
// 🔹 Validar permisos (si la página requiere roles específicos)
//
export function requireAuth(allowedRoles?: UserRole[]) {
  const user = getUser()

  if (!user) {
    window.location.href = "/"
    return null
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    window.location.href = "/"
    return null
  }

  return user
}
