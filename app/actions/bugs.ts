import { toast } from '@/components/ui/use-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export type Bug = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: {
    name: string;
    avatar: string;
  };
  project: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type CreateBugData = {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee_id?: string;
  project_id?: string;
};

export type UpdateBugData = Partial<CreateBugData>;

export async function getBugs(): Promise<Bug[]> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/bugs`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch bugs')
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching bugs:', error)
    toast({
      title: "Error",
      description: "Failed to fetch bugs",
      variant: "destructive",
    })
    return []
  }
}

export async function getBugById(id: string): Promise<Bug | null> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/bugs/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch bug')
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching bug:', error)
    toast({
      title: "Error",
      description: "Failed to fetch bug",
      variant: "destructive",
    })
    return null
  }
}

export async function createBug(data: CreateBugData): Promise<Bug | null> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/bugs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: {
          type: 'bugs',
          attributes: data
        }
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create bug')
    }

    const result = await response.json()
    toast({
      title: "Success",
      description: "Bug created successfully",
    })
    return result.data
  } catch (error) {
    console.error('Error creating bug:', error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to create bug",
      variant: "destructive",
    })
    return null
  }
}

export async function updateBug(id: string, data: UpdateBugData): Promise<Bug | null> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/bugs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: {
          type: 'bugs',
          id,
          attributes: data
        }
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update bug')
    }

    const result = await response.json()
    toast({
      title: "Success",
      description: "Bug updated successfully",
    })
    return result.data
  } catch (error) {
    console.error('Error updating bug:', error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to update bug",
      variant: "destructive",
    })
    return null
  }
}

export async function deleteBug(id: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/bugs/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete bug')
    }

    toast({
      title: "Success",
      description: "Bug deleted successfully",
    })
    return true
  } catch (error) {
    console.error('Error deleting bug:', error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to delete bug",
      variant: "destructive",
    })
    return false
  }
} 