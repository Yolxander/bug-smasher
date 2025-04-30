import { supabase } from './supabase'

export type Profile = {
  id: string
  email: string
  full_name: string | null
  role: 'developer' | 'qa' | 'product_manager' | 'designer' | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
  onboarding_completed: boolean
}

export async function createProfile(userId: string, email: string) {
  const { error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        onboarding_completed: false
      },
    ])

  if (error) throw error
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data as Profile
}

export async function updateProfile(userId: string, profileData: Partial<Profile>) {
  const { error } = await supabase
    .from('profiles')
    .update({
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) throw error
}

export async function completeOnboarding(userId: string, profileData: Partial<Profile>) {
  const { error } = await supabase
    .from('profiles')
    .update({
      ...profileData,
      onboarding_completed: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) throw error
} 