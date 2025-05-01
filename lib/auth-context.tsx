"use client"

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
  signIn: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  logout: () => Promise<void>
  signOut: () => Promise<void>
  setUser: (user: User | null) => void
  setProfileId: (id: string | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profileId, setProfileId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      console.log('Checking auth status...')
      
      // First check localStorage for user data and token
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('token')
      
      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser)
        console.log('Found stored user data:', userData)
        setUser(userData)
      }

      // Then verify with the server
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${storedToken}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        console.log('Server user data received:', userData)
        
        // Update both state and localStorage
        const updatedUser = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          profile_id: userData.profile_id
        }
        
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))

        // Fetch profile data
        const profile = await getCurrentProfile()
        console.log('Profile data received:', profile)
        if (profile) {
          setProfileId(profile.id)
        }
      } else {
        console.log('No authenticated user found')
        setUser(null)
        setProfileId(null)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      setError(error instanceof Error ? error.message : 'Failed to check authentication')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      console.log('Attempting login...')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const responseData = await response.json()
      console.log('Login successful, response data:', responseData)
      
      // Extract user data from the response
      const userData = responseData.user
      const token = responseData.token
      
      // Set user data in state
      const user = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        profile_id: userData.profile?.id || null
      }
      
      console.log('Setting user data:', user)
      setUser(user)
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)

      // Set profile ID if profile exists
      if (userData.profile) {
        setProfileId(userData.profile.id)
      }

      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
      setError(error instanceof Error ? error.message : 'Login failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    try {
      setLoading(true)
      setError(null)
      console.log('Attempting registration...')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          password_confirmation: passwordConfirmation 
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registration failed')
      }

      const userData = await response.json()
      console.log('Registration successful, user data:', userData)
      
      // Set user data in state
      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        profile_id: userData.profile_id
      })

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        profile_id: userData.profile_id
      }))

      // Check auth status to ensure everything is set up
      await checkAuth()

      router.push('/onboarding')
    } catch (error) {
      console.error('Registration error:', error)
      setError(error instanceof Error ? error.message : 'Registration failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Attempting logout...')
      
      // Get the token from localStorage
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Logout failed')
      }

      console.log('Logout successful')
      // Clear user data and token from localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      setUser(null)
      setProfileId(null)
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
      setError(error instanceof Error ? error.message : 'Logout failed')
      // Even if the server request fails, we should still clear local data
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      setUser(null)
      setProfileId(null)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    profileId,
    loading,
    error,
    login,
    signIn: login,
    register,
    signUp: async (email: string, password: string, name?: string) => {
      await register(name || email.split('@')[0], email, password, password)
    },
    logout,
    signOut: logout,
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