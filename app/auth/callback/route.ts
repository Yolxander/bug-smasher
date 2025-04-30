import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  console.log('Callback route hit')
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  console.log('Verification code:', code ? 'present' : 'missing')

  if (code) {
    console.log('Creating Supabase client for callback')
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      console.log('Exchanging code for session...')
      // Exchange the code for a session
      const { data: { session }, error: authError } = await supabase.auth.exchangeCodeForSession(code)
      console.log('Session exchange result:', { session: session?.user?.email, error: authError })
      
      if (authError) {
        console.error('Error exchanging code for session:', authError)
        throw authError
      }

      if (session?.user) {
        console.log('Creating/updating profile for user:', session.user.email)
        // Create or update the user's profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: session.user.id,
            email: session.user.email,
            updated_at: new Date().toISOString(),
          })

        if (profileError) {
          console.error('Error creating/updating profile:', profileError)
          throw profileError
        }
        console.log('Profile created/updated successfully')
      }
    } catch (error) {
      console.error('Error in callback route:', error)
      // Redirect to error page or show error message
      return NextResponse.redirect(new URL('/auth/error', requestUrl.origin))
    }
  }

  console.log('Redirecting to:', requestUrl.origin)
  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
} 