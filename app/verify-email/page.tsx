'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { resendVerificationEmail } = useAuth()

  const handleResendEmail = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      await resendVerificationEmail()
      setMessage('Verification email sent! Please check your inbox.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to send verification email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification email to your inbox. Please check your email and click the verification link to complete your registration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <div className={`text-sm ${message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </div>
          )}
          <Button 
            onClick={handleResendEmail} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 