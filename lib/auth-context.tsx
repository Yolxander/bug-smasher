import { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { toast } from '@/components/ui/use-toast'

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AuthProvider mounted')
    
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      console.log('Initializing auth...')
      try {
        console.log('Checking for existing session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('Session check result:', { session, error })
        
        if (error) {
          console.error('Error getting session:', error)
          throw error
        }

        setUser(session?.user ?? null)
        console.log('User state updated:', session?.user?.email ?? 'null')
      } catch (error) {
        console.error('Auth initialization error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', { event, session: session?.user?.email })
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      console.log('AuthProvider unmounting')
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email)
    try {
      console.log('Calling Supabase signInWithPassword...')
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      console.log('Sign in response:', { data, error })

      if (error) {
        console.error('Sign in error:', error)
        throw error
      }

      if (!data.user) {
        console.error('No user returned after sign in')
        throw new Error('No user returned after sign in')
      }

      console.log('Sign in successful for user:', data.user.email)
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      })
    } catch (error) {
      console.error('Sign in process error:', error)
      if (error instanceof AuthError) {
        switch (error.message) {
          case "Invalid login credentials":
            throw new Error("Invalid email or password")
          case "Email not confirmed":
            throw new Error("Please verify your email before signing in")
          default:
            throw error
        }
      }
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    console.log('Starting sign up process for:', email)
    try {
      console.log('Calling Supabase signUp...')
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            email: email
          }
        }
      })
      console.log('Sign up response:', { data, error })

      if (error) {
        console.error('Sign up error:', error)
        throw error
      }

      if (!data.user) {
        console.error('No user returned after sign up')
        throw new Error('No user returned after sign up')
      }

      console.log('User created successfully:', data.user.email)
      
      // Create a profile for the user
      console.log('Creating profile for user:', data.user.id)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])

      if (profileError) {
        console.error('Error creating profile:', profileError)
        throw profileError
      }

      console.log('Profile created successfully')
      
      toast({
        title: "Account created",
        description: "Please check your email to verify your account. After verification, you can sign in.",
      })
    } catch (error) {
      console.error('Sign up process error:', error)
      if (error instanceof AuthError) {
        switch (error.message) {
          case "User already registered":
            throw new Error("An account with this email already exists")
          default:
            throw error
        }
      }
      throw error
    }
  }

  const signOut = async () => {
    console.log('Attempting sign out')
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      console.log('Sign out successful')
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 