export type Assignee = {
  name: string;
  avatar: string;
};

export async function getAssignees(): Promise<Assignee[]> {
  try {
    const response = await fetch('/data/assignees.json');
    if (!response.ok) {
      throw new Error('Failed to fetch assignees');
    }
    const data = await response.json();
    return data.assignees;
  } catch (error) {
    console.error('Error reading assignees:', error);
    return [];
  }
} 