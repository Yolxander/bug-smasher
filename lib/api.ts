import { toast } from '@/components/ui/use-toast'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

// Utility function to get CSRF token from cookies
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
  return null
}

// Function to ensure CSRF token is set
export const ensureCsrfToken = async () => {
  try {
    console.log('Attempting to fetch CSRF token from:', `${apiUrl}/sanctum/csrf-cookie`)
    
    const response = await fetch(`${apiUrl}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    })

    console.log('CSRF Response status:', response.status)
    console.log('CSRF Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      console.error('CSRF Response status:', response.status)
      throw new Error(`Failed to get CSRF token: ${response.status} ${response.statusText}`)
    }

    // Get the CSRF token from the cookie
    const xsrfToken = getCookie('XSRF-TOKEN')
    console.log('All cookies:', document.cookie)
    console.log('XSRF Token:', xsrfToken)

    if (!xsrfToken) {
      console.error('No XSRF-TOKEN cookie found. Response headers:', Object.fromEntries(response.headers.entries()))
      
      // Try alternative cookie name that Laravel might use
      const alternativeToken = getCookie('laravel_session')
      console.log('Alternative token (laravel_session):', alternativeToken)
      
      if (alternativeToken) {
        console.log('Using alternative token')
        return alternativeToken
      }
      
      throw new Error('No CSRF token found in cookies')
    }

    return decodeURIComponent(xsrfToken)
  } catch (error) {
    console.error('Error in ensureCsrfToken:', error)
    throw error
  }
}

// Generic API request function
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  try {
    // Ensure CSRF token is set for non-GET requests
    if (options.method && options.method !== 'GET') {
      try {
        const xsrfToken = await ensureCsrfToken()
        options.headers = {
          ...options.headers,
          'X-XSRF-TOKEN': xsrfToken,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      } catch (error) {
        console.warn('Failed to get CSRF token, proceeding without it:', error)
        // Continue without CSRF token as a fallback
        options.headers = {
          ...options.headers,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
    }

    console.log('Making API request to:', `${apiUrl}${endpoint}`)
    console.log('Request options:', {
      ...options,
      headers: options.headers,
    })

    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      credentials: 'include',
      mode: 'cors',
      headers: {
        ...options.headers,
      },
    })

    console.log('API Response status:', response.status)
    console.log('API Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const error = await response.json()
      console.error('API Error response:', error)
      throw new Error(error.message || 'Request failed')
    }

    return response
  } catch (error) {
    console.error('API request error:', error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Request failed",
      variant: "destructive",
    })
    throw error
  }
}
