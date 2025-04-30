import { supabase } from './supabase'

export type Profile = {
  id: string
  email: string
  created_at: string
  updated_at: string
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