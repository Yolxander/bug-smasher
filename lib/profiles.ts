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
  try {
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include',
      body: JSON.stringify({
        id: userId,
        email,
        onboarding_completed: false
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create profile')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating profile:', error)
    throw error
  }
}

export async function getProfile(userId: string) {
  try {
    const response = await fetch('/api/profile', {
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch profile')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching profile:', error)
    throw error
  }
}

export async function updateProfile(userId: string, data: any) {
  try {
    const response = await fetch('/api/profile', {
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
    throw error
  }
}

export async function completeOnboarding(userId: string, data: any) {
  try {
    const response = await fetch('/api/profile', {
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

    if (!response.ok) {
      throw new Error('Failed to complete onboarding')
    }

    return await response.json()
  } catch (error) {
    console.error('Error completing onboarding:', error)
    throw error
  }
} 