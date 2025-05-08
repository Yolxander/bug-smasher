export async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    // Server-side - return null as we can't access cookies directly
    return null;
  }
  // Client-side
  return localStorage.getItem('token');
}

export async function setAuthToken(token: string): Promise<void> {
  if (typeof window === 'undefined') {
    // Server-side - no-op as we can't set cookies directly
    return;
  }
  // Client-side
  localStorage.setItem('token', token);
}

export async function removeAuthToken(): Promise<void> {
  if (typeof window === 'undefined') {
    // Server-side - no-op as we can't remove cookies directly
    return;
  }
  // Client-side
  localStorage.removeItem('token');
} 