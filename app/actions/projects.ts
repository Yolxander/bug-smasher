export type Project = {
  id: string;
  name: string;
  description: string;
};

export async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch('/data/projects.json');
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    const data = await response.json();
    return data.projects;
  } catch (error) {
    console.error('Error reading projects:', error);
    return [];
  }
} 