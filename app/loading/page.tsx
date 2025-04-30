"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getProfile } from "@/lib/profiles"
import { toast } from "@/components/ui/use-toast"

export default function LoadingPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        router.push("/auth/login")
        return
      }

      try {
        const profile = await getProfile(user.id)
        console.log("Profile status:", profile.onboarding_completed ? "Onboarding completed" : "Onboarding required")
        
        if (!profile.onboarding_completed) {
          router.push("/onboarding")
        } else {
          router.push("/")
        }
      } catch (error) {
        console.error("Profile check failed:", error)
        toast({
          title: "Error",
          description: "There was an error loading your profile",
          variant: "destructive",
        })
        router.push("/auth/login")
      }
    }

    // Only check profile if we're not already on the login or onboarding page
    if (!window.location.pathname.includes('/auth/login') && 
        !window.location.pathname.includes('/onboarding')) {
      checkProfile()
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-400 mx-auto"></div>
        <p className="mt-4 text-amber-400 text-lg">Loading your profile...</p>
      </div>
    </div>
  )
} 