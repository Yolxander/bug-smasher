import { useAuth } from "@/lib/auth-context"

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
};

export async function getSubmissions() {
  try {
    const response = await fetch(`${API_URL}/bugs`, {
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch submissions')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching submissions:', error)
    throw error
  }
}

export async function getSubmissionById(id: string): Promise<Submission | null> {
  try {
    const response = await fetch(`${API_URL}/bugs/${id}`, {
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch submission')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching submission:', error)
    return null
  }
}

export async function createSubmission(submissionData: any) {
  try {
    const response = await fetch(`${API_URL}/bugs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include',
      body: JSON.stringify(submissionData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create submission')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating submission:', error)
    throw error
  }
}

export async function updateSubmission(submissionId: string, data: any) {
  try {
    const response = await fetch(`${API_URL}/bugs/${submissionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update submission')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating submission:', error)
    throw error
  }
}

export async function deleteSubmission(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/bugs/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to delete submission')
    }

    return true
  } catch (error) {
    console.error('Error deleting submission:', error)
    return false
  }
} 