"use client"

import { useEffect } from "react"
import { requireAuth } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function AdminPage() {
  useEffect(() => {
    requireAuth(["admin"])
  }, [])

  return <AdminDashboard />
}
