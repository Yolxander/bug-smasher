"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Chatbot from "@/components/Chatbot"

export function ChatbotWrapper() {
  const pathname = usePathname()
  const [showChatbot, setShowChatbot] = useState(false)

  useEffect(() => {
    const isAuthPage = pathname?.startsWith("/auth/") || pathname === "/login" || pathname === "/signup"
    setShowChatbot(!isAuthPage)
  }, [pathname])

  if (!showChatbot) return null

  return <Chatbot />
} 