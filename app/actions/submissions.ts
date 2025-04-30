import { supabase } from '@/lib/supabase'

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
    console.log('Fetching submissions from Supabase...');
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Fetched submissions:', data);
    return data || [];
  } catch (error) {
    console.error('Error reading submissions:', error);
    return [];
  }
}

export async function getSubmissionById(id: string): Promise<Submission | null> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error reading submission:', error);
    return null;
  }
}

export async function createSubmission(submission: Omit<Submission, 'id' | 'createdAt' | 'updatedAt'>): Promise<Submission | null> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .insert([{
        ...submission,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating submission:', error);
    return null;
  }
}

export async function updateSubmission(id: string, submission: Partial<Submission>): Promise<Submission | null> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .update({
        ...submission,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating submission:', error);
    return null;
  }
}

export async function deleteSubmission(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting submission:', error);
    return false;
  }
} 