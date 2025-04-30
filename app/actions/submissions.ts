export type Submission = {
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
  device: string;
  url: string;
  screenshot: string;
};

export async function getSubmissions(): Promise<Submission[]> {
  try {
    const response = await fetch('/data/submissions.json');
    if (!response.ok) {
      throw new Error('Failed to fetch submissions');
    }
    const data = await response.json();
    return data.submissions;
  } catch (error) {
    console.error('Error reading submissions:', error);
    return [];
  }
} 