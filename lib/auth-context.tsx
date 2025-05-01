import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

interface User {
  id: number
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
  profile: any | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any | null>(null)
  const router = useRouter()

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user`, {
        credentials: 'include',
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setProfile(userData)
      } else {
        setUser(null)
        setProfile(null)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      // First get CSRF cookie
      const csrfResponse = await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        credentials: 'include',
      })

      if (!csrfResponse.ok) {
        throw new Error('Failed to get CSRF token')
      }

      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }

      await fetchUser()
      router.push('/')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Invalid email or password',
        variant: 'destructive',
      })
      throw error
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      // First get CSRF cookie
      const csrfResponse = await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        credentials: 'include',
      })

      if (!csrfResponse.ok) {
        throw new Error('Failed to get CSRF token')
      }

      // Use provided name or generate from email
      const userName = name || email.split('@')[0]

      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email, 
          password,
          name: userName,
          password_confirmation: password
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        // Format validation errors into a readable message
        const errorMessage = errorData.message || 
          (errorData.errors ? Object.values(errorData.errors).flat().join(', ') : 'Registration failed')
        throw new Error(errorMessage)
      }

      toast({
        title: 'Success',
        description: 'Please check your email to verify your account',
      })
      router.push('/auth/login')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'There was an error creating your account',
        variant: 'destructive',
      })
      throw error
    }
  }

  const signOut = async () => {
    try {
      const response = await fetch(`${API_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      setUser(null)
      setProfile(null)
      router.push('/auth/login')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error signing out',
        variant: 'destructive',
      })
      throw error
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    profile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 