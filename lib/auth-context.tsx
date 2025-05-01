import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { getCurrentProfile } from '../app/actions/profiles'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

interface User {
  id: string
  email: string
  name: string
  profile_id?: string
}

interface AuthContextType {
  user: User | null
  profileId: string | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  setProfileId: (id: string | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profileId, setProfileId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
          credentials: 'include',
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          
          // Fetch and set profile ID
          const profile = await getCurrentProfile()
          if (profile) {
            setProfileId(profile.id)
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const userData = await response.json()
      setUser(userData)

      // Fetch and set profile ID after login
      const profile = await getCurrentProfile()
      if (profile) {
        setProfileId(profile.id)
      }

      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
      setError(error instanceof Error ? error.message : 'Login failed')
      throw error
    }
  }

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    try {
      setError(null)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, password_confirmation }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registration failed')
      }

      const userData = await response.json()
      setUser(userData)

      // Fetch and set profile ID after registration
      const profile = await getCurrentProfile()
      if (profile) {
        setProfileId(profile.id)
      }

      router.push('/')
    } catch (error) {
      console.error('Registration error:', error)
      setError(error instanceof Error ? error.message : 'Registration failed')
      throw error
    }
  }

  const logout = async () => {
    try {
      setError(null)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      setUser(null)
      setProfileId(null)
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
      setError(error instanceof Error ? error.message : 'Logout failed')
      throw error
    }
  }

  const value = {
    user,
    profileId,
    loading,
    error,
    login,
    register,
    logout,
    setUser,
    setProfileId,
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