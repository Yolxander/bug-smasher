import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/toaster"
import { ChatbotWrapper } from "@/components/ChatbotWrapper"
import { AuthProvider } from './contexts/AuthContext'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bug Report",
  description: "Submit bug reports for our products",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Providers>
            {children}
            <ChatbotWrapper />
          </Providers>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
