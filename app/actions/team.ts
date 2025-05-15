import { toast } from '@/components/ui/use-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export type Team = {
  id: string;
  name: string;
  description: string;
  status: string;
  members: TeamMember[];
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  projects: {
    id: string;
    name: string;
  }[];
  bugsAssigned: number;
  bugsResolved: number;
};

export type CreateTeamData = {
  name: string;
  description: string;
};

export type UpdateTeamData = Partial<CreateTeamData>;

export type UpdateMemberRoleData = {
  role: string;
};

export type TeamWithMembers = {
  id: number;
  name: string;
  description: string;
  status: string;
  created_by: number;
  creator: {
    id: number;
    name: string;
    email: string;
  };
  members: Array<{
    id: number;
    user: {
      id: number;
      name: string;
      email: string;
    };
    role: string;
    status: string;
  }>;
};

export async function getTeams(): Promise<Team[]> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/teams`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch teams')
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching teams:', error)
    toast({
      title: "Error",
      description: "Failed to fetch teams",
      variant: "destructive",
    })
    return []
  }
}

export async function getTeamById(id: string): Promise<Team | null> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/teams/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch team')
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching team:', error)
    toast({
      title: "Error",
      description: "Failed to fetch team",
      variant: "destructive",
    })
    return null
  }
}

export async function createTeam(data: CreateTeamData): Promise<Team | null> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: {
          type: 'teams',
          attributes: data
        }
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create team')
    }

    const result = await response.json()
    toast({
      title: "Success",
      description: "Team created successfully",
    })
    return result.data
  } catch (error) {
    console.error('Error creating team:', error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to create team",
      variant: "destructive",
    })
    return null
  }
}

export async function updateTeam(id: string, data: UpdateTeamData): Promise<Team | null> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/teams/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: {
          type: 'teams',
          id,
          attributes: data
        }
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update team')
    }

    const result = await response.json()
    toast({
      title: "Success",
      description: "Team updated successfully",
    })
    return result.data
  } catch (error) {
    console.error('Error updating team:', error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to update team",
      variant: "destructive",
    })
    return null
  }
}

export async function deleteTeam(id: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/teams/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete team')
    }

    toast({
      title: "Success",
      description: "Team deleted successfully",
    })
    return true
  } catch (error) {
    console.error('Error deleting team:', error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to delete team",
      variant: "destructive",
    })
    return false
  }
}

export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/teams/${teamId}/members`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch team members')
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching team members:', error)
    toast({
      title: "Error",
      description: "Failed to fetch team members",
      variant: "destructive",
    })
    return []
  }
}

export async function addTeamMember(teamId: string, memberId: string): Promise<TeamMember | null> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/teams/${teamId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: {
          type: 'team_members',
          attributes: {
            member_id: memberId
          }
        }
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to add team member')
    }

    const result = await response.json()
    toast({
      title: "Success",
      description: "Team member added successfully",
    })
    return result.data
  } catch (error) {
    console.error('Error adding team member:', error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to add team member",
      variant: "destructive",
    })
    return null
  }
}

export async function removeTeamMember(teamId: string, memberId: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/teams/${teamId}/members/${memberId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to remove team member')
    }

    toast({
      title: "Success",
      description: "Team member removed successfully",
    })
    return true
  } catch (error) {
    console.error('Error removing team member:', error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to remove team member",
      variant: "destructive",
    })
    return false
  }
}

export async function updateTeamMemberRole(teamId: string, memberId: string, data: UpdateMemberRoleData): Promise<TeamMember | null> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/teams/${teamId}/members/${memberId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: {
          type: 'team_members',
          attributes: data
        }
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update team member role')
    }

    const result = await response.json()
    toast({
      title: "Success",
      description: "Team member role updated successfully",
    })
    return result.data
  } catch (error) {
    console.error('Error updating team member role:', error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to update team member role",
      variant: "destructive",
    })
    return null
  }
}

export async function getTeamsByMemberId(memberId: string): Promise<TeamWithMembers[]> {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/teams/member/${memberId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch teams by member')
    }

    const data = await response.json()
    const teams = Array.isArray(data) ? data : (data.data || []);
    return teams;
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to fetch teams by member",
      variant: "destructive",
    })
    return []
  }
} 