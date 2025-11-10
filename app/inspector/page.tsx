"use client"

import { useEffect } from "react"
import { requireAuth } from "@/lib/auth"
import { InspectorDashboard } from "@/components/inspector/inspector-dashboard"

export default function InspectorPage() {
  useEffect(() => {
    requireAuth(["inspector"])
  }, [])

  return <InspectorDashboard />
}
