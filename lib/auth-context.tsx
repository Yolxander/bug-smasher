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
      setProfile(null)
      return
    }

    try {
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        if (profileError.code === 'PGRST116') {
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
          
          if (createError) throw createError
          router.push('/onboarding')
          return
        }
        throw profileError
      }

      if (existingProfile) {
        setProfile(existingProfile)
        if (!existingProfile.onboarding_completed) {
          router.push('/onboarding')
          return
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error loading your profile',
        variant: 'destructive',
      })
      router.push('/auth/login')
    }
  }

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        handleProfileCheck(session.user)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await handleProfileCheck(session.user)
      } else {
        setProfile(null)
        if (!window.location.pathname.includes('/auth/login')) {
          router.push('/auth/login')
        }
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [router])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      // The auth state change handler will handle the redirect
    } catch (error) {
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
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
      toast({
        title: 'Success',
        description: 'Please check your email to verify your account',
      })
    } catch (error) {
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
      const { error } = await supabase.auth.signOut()
      if (error) throw error
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