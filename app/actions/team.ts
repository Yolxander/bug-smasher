export type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  status: string;
  projects: {
    id: string;
    name: string;
  }[];
  bugsAssigned: number;
  bugsResolved: number;
};

export async function getTeam(): Promise<TeamMember[]> {
  try {
    const response = await fetch('/data/team.json');
    if (!response.ok) {
      throw new Error('Failed to fetch team data');
    }
    const data = await response.json();
    return data.team;
  } catch (error) {
    console.error('Error reading team data:', error);
    return [];
  }
} 