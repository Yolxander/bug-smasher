const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
import { getAuthToken } from '../../lib/auth-utils'

export interface QaChecklistItem {
  id: number;
  text: string;
  type: string;
  is_required: boolean;
  order_number: number;
  created_at: string;
  updated_at: string;
  status?: 'passed' | 'failed' | 'pending' | 'in_progress' | 'done';
  notes?: string;
  answer?: string;
  failure_reason?: string;
}

export interface QaChecklistResponse {
  id: number;
  checklist_id: number;
  item_id: number;
  response: string;
  responded_by: number;
  responded_at: string;
  status: string;
}

export interface QaChecklist {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
}

export interface QaStats {
  activeProjects: {
    count: number;
    change: number;
    period: string;
  };
  completedItems: {
    count: number;
    change: number;
    period: string;
  };
  activeReviewers: {
    count: number;
    change: number;
    period: string;
  };
}

// Get all QA checklists
export const getQaChecklists = async (): Promise<QaChecklist[]> => {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/qa-checklists`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Server response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorData
      });
      
      if (response.status === 401) {
        // Clear invalid token
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        throw new Error('Session expired. Please log in again.')
      }
      
      throw new Error(`Failed to fetch QA checklists: ${response.statusText}`)
    }
    
    const data = await response.json();
    console.log('Raw API response:', data);
    
    // Handle different response structures
    if (data && typeof data === 'object') {
      // If data is wrapped in a data property
      if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
      // If data is an array directly
      if (Array.isArray(data)) {
        return data;
      }
      // If data is a single object, wrap it in an array
      if (data.id) {
        return [data];
      }
    }
    
    console.error('Unexpected response format:', data);
    return [];
  } catch (error) {
    console.error('Error in getQaChecklists:', error);
    // Return empty array on error to prevent filter errors
    return [];
  }
};

// Get a single QA checklist
export const getQaChecklist = async (id: number): Promise<QaChecklist> => {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/qa-checklists/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch QA checklist');
    return response.json();
  } catch (error) {
    console.error('Error in getQaChecklist:', error);
    throw error;
  }
};

// Create a new QA checklist
export const createQaChecklist = async (data: Partial<QaChecklist>): Promise<QaChecklist> => {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/qa-checklists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create QA checklist');
    return response.json();
  } catch (error) {
    console.error('Error in createQaChecklist:', error);
    throw error;
  }
};

// Update a QA checklist
export const updateQaChecklist = async (id: number, data: Partial<QaChecklist>): Promise<QaChecklist> => {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/qa-checklists/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update QA checklist');
    return response.json();
  } catch (error) {
    console.error('Error in updateQaChecklist:', error);
    throw error;
  }
};

// Delete a QA checklist
export const deleteQaChecklist = async (id: number): Promise<void> => {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/qa-checklists/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete QA checklist');
  } catch (error) {
    console.error('Error in deleteQaChecklist:', error);
    throw error;
  }
};

// Get active items for a checklist
export const getActiveItems = async (checklistId: number): Promise<QaChecklistItem[]> => {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/qa-checklists/${checklistId}/active-items`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch active items');
    return response.json();
  } catch (error) {
    console.error('Error in getActiveItems:', error);
    throw error;
  }
};

// Get completed items for a checklist
export const getCompletedItems = async (checklistId: number): Promise<QaChecklistItem[]> => {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/qa-checklists/${checklistId}/completed-items`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch completed items');
    return response.json();
  } catch (error) {
    console.error('Error in getCompletedItems:', error);
    throw error;
  }
};

// Add a new item to a checklist
export const addChecklistItem = async (
  checklistId: number,
  data: Partial<QaChecklistItem>
): Promise<QaChecklistItem> => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/qa-checklists/${checklistId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add checklist item');
    return response.json();
  } catch (error) {
    console.error('Error in addChecklistItem:', error);
    throw error;
  }
};

// Update a checklist item
export const updateChecklistItem = async (
  checklistId: number,
  itemId: number,
  data: Partial<QaChecklistItem>
): Promise<QaChecklistItem> => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/qa-checklists/${checklistId}/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update checklist item');
    return response.json();
  } catch (error) {
    console.error('Error in updateChecklistItem:', error);
    throw error;
  }
};

// Delete a checklist item
export const deleteChecklistItem = async (checklistId: number, itemId: number): Promise<void> => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/qa-checklists/${checklistId}/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete checklist item');
  } catch (error) {
    console.error('Error in deleteChecklistItem:', error);
    throw error;
  }
};

// Submit a response for a checklist
export const submitChecklistResponse = async (
  checklistId: number,
  data: Partial<QaChecklistResponse>
): Promise<QaChecklistResponse> => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/qa-checklists/${checklistId}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit checklist response');
    return response.json();
  } catch (error) {
    console.error('Error in submitChecklistResponse:', error);
    throw error;
  }
};

// Get responses for a checklist
export const getChecklistResponses = async (checklistId: number): Promise<QaChecklistResponse[]> => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/api/qa-checklists/${checklistId}/responses`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch checklist responses');
    return response.json();
  } catch (error) {
    console.error('Error in getChecklistResponses:', error);
    throw error;
  }
};

// Get QA statistics for the dashboard widget
export const getQaStats = async (): Promise<QaStats> => {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    console.log('Fetching QA stats from:', `${API_URL}/api/qa/stats`)
    const response = await fetch(`${API_URL}/api/qa/stats`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('QA stats API error:', {
        status: response.status,
        statusText: response.statusText
      })
      throw new Error('Failed to fetch QA statistics')
    }

    const data = await response.json()
    console.log('QA stats API response:', data)
    // Return the data directly since it's already in the correct format
    return data
  } catch (error) {
    console.error('Error in getQaStats:', error)
    // Return default values if the API call fails
    return {
      activeProjects: {
        count: 0,
        change: 0,
        period: 'this week'
      },
      completedItems: {
        count: 0,
        change: 0,
        period: 'this week'
      },
      activeReviewers: {
        count: 0,
        change: 0,
        period: 'this week'
      }
    }
  }
}; 