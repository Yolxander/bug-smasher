import { toast } from '@/components/ui/use-toast'
import { createBug, updateBug, deleteBug } from './bugs'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export type Submission = {
  id: string;
  title: string;
  description: string;
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  device: string;
  browser: string;
  os: string;
  status: string;
  priority: string;
  assignee_id: string;
  project: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  url: string;
  screenshot: string;
  assignee: {
    id: string;
    name: string;
    avatar: string;
  };
};

export async function getSubmissions(): Promise<Submission[]> {
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
      throw new Error('Failed to fetch submissions')
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching submissions:', error)
    toast({
      title: "Error",
      description: "Failed to fetch submissions",
      variant: "destructive",
    })
    return []
  }
}

export async function getSubmissionById(id: string): Promise<Submission | null> {
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
      throw new Error('Failed to fetch submission')
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching submission:', error)
    toast({
      title: "Error",
      description: "Failed to fetch submission",
      variant: "destructive",
    })
    return null
  }
}

export async function createSubmission(data: {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee_id?: string;
  project_id?: string;
}): Promise<Submission | null> {
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
      throw new Error(errorData.message || 'Failed to create submission')
    }

    const result = await response.json()
    toast({
      title: "Success",
      description: "Submission created successfully",
    })
    return result.data
  } catch (error) {
    console.error('Error creating submission:', error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to create submission",
      variant: "destructive",
    })
    return null
  }
}

export async function convertToBug(submissionId: string): Promise<boolean> {
  try {
    const submission = await getSubmissionById(submissionId)
    if (!submission) {
      throw new Error('Submission not found')
    }

    const bug = await createBug({
      title: submission.title,
      description: submission.description,
      status: submission.status,
      priority: submission.priority,
      assignee_id: submission.assignee?.id,
      project_id: submission.project?.id
    })

    if (!bug) {
      throw new Error('Failed to create bug from submission')
    }

    // Delete the submission after successful conversion
    await deleteSubmission(submissionId)

    toast({
      title: "Success",
      description: "Submission converted to bug successfully",
    })
    return true
  } catch (error) {
    console.error('Error converting submission to bug:', error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to convert submission to bug",
      variant: "destructive",
    })
    return false
  }
}

export async function deleteSubmission(id: string): Promise<boolean> {
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
      throw new Error(errorData.message || 'Failed to delete submission')
    }

    toast({
      title: "Success",
      description: "Submission deleted successfully",
    })
    return true
  } catch (error) {
    console.error('Error deleting submission:', error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to delete submission",
      variant: "destructive",
    })
    return false
  }
} 