export type UserRole = "admin" | "supervisor" | "inspector"

export interface User {
  email: string
  name: string
  role: UserRole
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem("user")
  window.location.href = "/"
}

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
