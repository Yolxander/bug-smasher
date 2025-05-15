import { toast } from '@/components/ui/use-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export type Assignee = {
  id: string;
  name: string;
  avatar: string;
  team_id: string;
  email: string;
  role: string;
};

export async function getAssignees(): Promise<Assignee[]> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/users`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch assignees: ${response.status} ${errorText}`)
    }

    const responseData = await response.json()
    const assignees = Array.isArray(responseData) ? responseData : responseData.data;
    
    if (!assignees || !Array.isArray(assignees)) {
      return [];
    }

    return assignees;
  } catch (error) {
    console.error('Error fetching assignees:', error);
    toast({
      title: "Error",
      description: "Failed to fetch assignees",
      variant: "destructive",
    })
    return []
  }
} 