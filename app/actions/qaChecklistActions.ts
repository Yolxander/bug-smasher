const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface QaChecklistItem {
  id: number;
  text: string;
  type: string;
  is_required: boolean;
  order_number: number;
  created_at: string;
  updated_at: string;
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

// Get all QA checklists
export const getQaChecklists = async (): Promise<QaChecklist[]> => {
  const response = await fetch(`${API_URL}/qa-checklists`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch QA checklists');
  return response.json();
};

// Get a single QA checklist
export const getQaChecklist = async (id: number): Promise<QaChecklist> => {
  const response = await fetch(`${API_URL}/qa-checklists/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch QA checklist');
  return response.json();
};

// Create a new QA checklist
export const createQaChecklist = async (data: Partial<QaChecklist>): Promise<QaChecklist> => {
  const response = await fetch(`${API_URL}/qa-checklists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create QA checklist');
  return response.json();
};

// Update a QA checklist
export const updateQaChecklist = async (id: number, data: Partial<QaChecklist>): Promise<QaChecklist> => {
  const response = await fetch(`${API_URL}/qa-checklists/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update QA checklist');
  return response.json();
};

// Delete a QA checklist
export const deleteQaChecklist = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/qa-checklists/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete QA checklist');
};

// Get active items for a checklist
export const getActiveItems = async (checklistId: number): Promise<QaChecklistItem[]> => {
  const response = await fetch(`${API_URL}/qa-checklists/${checklistId}/active-items`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch active items');
  return response.json();
};

// Get completed items for a checklist
export const getCompletedItems = async (checklistId: number): Promise<QaChecklistItem[]> => {
  const response = await fetch(`${API_URL}/qa-checklists/${checklistId}/completed-items`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch completed items');
  return response.json();
};

// Add a new item to a checklist
export const addChecklistItem = async (
  checklistId: number,
  data: Partial<QaChecklistItem>
): Promise<QaChecklistItem> => {
  const response = await fetch(`${API_URL}/qa-checklists/${checklistId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add checklist item');
  return response.json();
};

// Update a checklist item
export const updateChecklistItem = async (
  checklistId: number,
  itemId: number,
  data: Partial<QaChecklistItem>
): Promise<QaChecklistItem> => {
  const response = await fetch(`${API_URL}/qa-checklists/${checklistId}/items/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update checklist item');
  return response.json();
};

// Delete a checklist item
export const deleteChecklistItem = async (checklistId: number, itemId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/qa-checklists/${checklistId}/items/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete checklist item');
};

// Submit a response for a checklist
export const submitChecklistResponse = async (
  checklistId: number,
  data: Partial<QaChecklistResponse>
): Promise<QaChecklistResponse> => {
  const response = await fetch(`${API_URL}/qa-checklists/${checklistId}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to submit checklist response');
  return response.json();
};

// Get responses for a checklist
export const getChecklistResponses = async (checklistId: number): Promise<QaChecklistResponse[]> => {
  const response = await fetch(`${API_URL}/qa-checklists/${checklistId}/responses`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch checklist responses');
  return response.json();
}; 