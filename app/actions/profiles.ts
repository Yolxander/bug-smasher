import { toast } from '@/components/ui/use-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

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

export async function getProfileById(id: string): Promise<Profile | null> {
  try {
    const response = await fetch(`${API_URL}/api/profiles/${id}`, {
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch profile')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const response = await fetch(`${API_URL}/api/profiles`, {
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch profile')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export async function updateProfile(data: Partial<Profile>): Promise<Profile | null> {
  try {
    const response = await fetch(`${API_URL}/api/profiles`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to update profile')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating profile:', error)
    return null
  }
}

export async function completeOnboarding(data: Partial<Profile>): Promise<Profile | null> {
  console.log('completeOnboarding called with data:', data)
  
  try {
    console.log('Making request to:', `${API_URL}/api/profiles`)
    const response = await fetch(`${API_URL}/api/profiles`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include',
      body: JSON.stringify({
        ...data,
        onboarding_completed: true
      }),
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error(`Failed to complete onboarding: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    console.log('Response data:', result)
    return result
  } catch (error) {
    console.error('Error in completeOnboarding:', error)
    return null
  }
} 