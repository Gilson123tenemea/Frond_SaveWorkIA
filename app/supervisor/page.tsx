"use client"

import { useEffect } from "react"
import { requireAuth } from "@/lib/auth"
import { SupervisorDashboard } from "@/components/supervisor/supervisor-dashboard"

export default function SupervisorPage() {
  useEffect(() => {
    requireAuth(["supervisor"])
  }, [])

  return <SupervisorDashboard />
}
