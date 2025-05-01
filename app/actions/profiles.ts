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

export async function completeOnboarding(data: {
  full_name: string
  role: string
  bio: string
  email: string
  user_id: number
}) {
  try {
    console.log('Starting completeOnboarding with data:', data)
    
    // Get the token from localStorage
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    // Format the data according to the API's expected structure
    const formattedData = {
      data: {
        type: 'profiles',
        attributes: {
          full_name: data.full_name,
          role: data.role,
          bio: data.bio,
          email: data.email,
          user_id: data.user_id
        }
      }
    }

    console.log('Sending formatted data:', formattedData)
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formattedData),
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)

    if (!response.ok) {
      const errorData = await response.json()
      console.log('Error response:', errorData)
      throw new Error(`Failed to complete onboarding: ${response.status} ${JSON.stringify(errorData)}`)
    }

    const result = await response.json()
    console.log('completeOnboarding result:', result)

    // Store the profile ID in localStorage
    if (result.data && result.data.id) {
      localStorage.setItem('profileId', result.data.id)
    }

    // Redirect to home page
    window.location.href = '/'

    return result
  } catch (error) {
    console.error('Error in completeOnboarding:', error)
    throw error
  }
} 