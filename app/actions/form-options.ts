export type FormOptions = {
  priorities: string[];
  statuses: string[];
  defaultValues: {
    priority: string;
    status: string;
  };
};

export async function getFormOptions(): Promise<FormOptions> {
  try {
    const response = await fetch('/data/form-options.json');
    if (!response.ok) {
      throw new Error('Failed to fetch form options');
    }
    return await response.json();
  } catch (error) {
    console.error('Error reading form options:', error);
    return {
      priorities: ['Low', 'Medium', 'High'],
      statuses: ['Open', 'In Progress', 'Resolved', 'Closed'],
      defaultValues: {
        priority: 'Medium',
        status: 'Open'
      }
    };
  }
} 