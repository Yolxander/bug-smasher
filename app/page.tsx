"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import BugReportForm from "@/bug-report-form"
import Image from "next/image"
import Link from "next/link"
import { Search, Bell, ChevronDown, ArrowRight } from "lucide-react"
import { DashboardSidebar } from "@/components/DashboardSidebar"

export default function HomePage() {
  const { user, loading, isRegistered } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !isRegistered)) {
      router.push("/auth/login")
    }
  }, [user, loading, isRegistered, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user || !isRegistered) {
    return null
  }

  return <BugReportForm />
}
