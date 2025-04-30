import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { useRouter } from 'next/navigation'
import { getProfile, createProfile } from './profiles'
import { toast } from '@/components/ui/use-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  profile: any | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any | null>(null)
  const router = useRouter()

  const handleProfileCheck = async (user: User | null) => {
    if (!user) {
      console.log('No user found, setting profile to null')
      setProfile(null)
      return
    }

    try {
      console.log('Starting profile check for user:', user.id)
      console.log('User email:', user.email)
      
      // Check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      // PGRST116 is "no rows returned" which is expected when no profile exists
      if (profileError) {
        if (profileError.code === 'PGRST116') {
          console.log('No profile found, creating new profile')
          // Create new profile
          const { error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                email: user.email,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                onboarding_completed: false
              },
            ])
          
          if (createError) {
            console.error('Error creating profile:', createError)
            throw createError
          }

          // Redirect to onboarding
          console.log('Redirecting to onboarding page')
          router.push('/onboarding')
          return
        } else {
          console.error('Error checking profile:', profileError)
          throw profileError
        }
      }

      // If we have a profile, check onboarding status
      if (existingProfile) {
        console.log('Existing profile found:', existingProfile)
        setProfile(existingProfile)
        
        if (!existingProfile.onboarding_completed) {
          console.log('Profile exists but onboarding not completed, redirecting to onboarding')
          router.push('/onboarding')
          return
        }

        console.log('Profile exists and onboarding completed, redirecting to home')
        router.push('/')
      }
    } catch (error) {
      console.error('Error in handleProfileCheck:', error)
      toast({
        title: 'Error',
        description: 'There was an error loading your profile',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    console.log('AuthProvider mounted, checking session')
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session check result:', session ? 'Session found' : 'No session')
      setUser(session?.user ?? null)
      if (session?.user) {
        console.log('User found in session, checking profile')
        handleProfileCheck(session.user)
      }
      setLoading(false)
    })

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session ? 'Session found' : 'No session')
      setUser(session?.user ?? null)
      if (session?.user) {
        console.log('User found in auth state change, checking profile')
        await handleProfileCheck(session.user)
      } else {
        console.log('No user in auth state change, redirecting to login')
        setProfile(null)
        router.push('/auth/login')
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [router])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      console.log('Sign in successful')
    } catch (error) {
      console.error('Error signing in:', error)
      toast({
        title: 'Error',
        description: 'Invalid email or password',
        variant: 'destructive',
      })
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Attempting sign up for:', email)
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
      console.log('Sign up successful')
      toast({
        title: 'Success',
        description: 'Please check your email to verify your account',
      })
    } catch (error) {
      console.error('Error signing up:', error)
      toast({
        title: 'Error',
        description: 'There was an error creating your account',
        variant: 'destructive',
      })
      throw error
    }
  }

  const signOut = async () => {
    try {
      console.log('Attempting sign out')
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      console.log('Sign out successful')
      router.push('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
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