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
    // First try to get the profile from localStorage
    const storedProfile = localStorage.getItem('profile')
    if (storedProfile) {
      return JSON.parse(storedProfile)
    }

    // If not in localStorage, try to get it from the API
    const response = await fetch(`${API_URL}/api/profiles`, {
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch profile')
    }

    const profile = await response.json()
    
    // Store the profile in localStorage for future use
    if (profile) {
      localStorage.setItem('profile', JSON.stringify(profile))
    }

    return profile
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
          user_id: data.user_id,
          onboarding_completed: true
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

    return result
  } catch (error) {
    console.error('Error in completeOnboarding:', error)
    throw error
  }
}

export interface UserProfile {
  id: number;
  full_name: string;
  role: string;
  avatar_url: string;
  bio: string;
  onboarding_completed: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  profile: UserProfile;
}

export async function getUsers(): Promise<User[]> {
  try {
    // First try to get the users from localStorage
    const storedUsers = localStorage.getItem('users')
    if (storedUsers) {
      return JSON.parse(storedUsers)
    }

    // Get the token from localStorage
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    // If not in localStorage, try to get it from the API
    const response = await fetch(`${API_URL}/api/users`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Server response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorData
      })

      if (response.status === 401) {
        // Clear invalid token
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        throw new Error('Session expired. Please log in again.')
      }

      throw new Error(`Failed to fetch users: ${response.statusText}`)
    }

    const data = await response.json()
    
    // Handle different response structures
    let users: User[] = []
    if (data && typeof data === 'object') {
      // If data is wrapped in a data property
      if (data.data && Array.isArray(data.data)) {
        users = data.data
      }
      // If data is an array directly
      else if (Array.isArray(data)) {
        users = data
      }
    }
    
    // Store the users in localStorage for future use
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users))
    }

    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
} 