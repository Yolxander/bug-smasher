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

export async function getBugs(): Promise<Bug[]> {
  try {
    const response = await fetch('/data/bugs.json');
    if (!response.ok) {
      throw new Error('Failed to fetch bugs');
    }
    const data = await response.json();
    return data.bugs;
  } catch (error) {
    console.error('Error reading bugs:', error);
    return [];
  }
} 