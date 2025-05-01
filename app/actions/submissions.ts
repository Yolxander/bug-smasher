import { supabase } from '@/lib/supabase'
import { getProfile } from '@/lib/profiles'

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

export async function getSubmissions(): Promise<Submission[]> {
  try {
    console.log('Fetching submissions from Supabase...');
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        assignee:profiles!submissions_assignee_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    // Map database fields to TypeScript type
    const mappedData = data?.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      stepsToReproduce: item.steps_to_reproduce,
      expectedBehavior: item.expected_behavior,
      actualBehavior: item.actual_behavior,
      device: item.device,
      browser: item.browser,
      os: item.os,
      status: item.status,
      priority: item.priority,
      assignee_id: item.assignee_id,
      project: item.project,
      url: item.url,
      screenshot: item.screenshot,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    })) || [];

    console.log('Fetched submissions:', mappedData);
    return mappedData;
  } catch (error) {
    console.error('Error reading submissions:', error);
    return [];
  }
}

export async function getSubmissionById(id: string): Promise<Submission | null> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        assignee:profiles!submissions_assignee_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    // Map database fields to TypeScript type
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      stepsToReproduce: data.steps_to_reproduce,
      expectedBehavior: data.expected_behavior,
      actualBehavior: data.actual_behavior,
      device: data.device,
      browser: data.browser,
      os: data.os,
      status: data.status,
      priority: data.priority,
      assignee_id: data.assignee_id,
      project: data.project,
      url: data.url,
      screenshot: data.screenshot,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error reading submission:', error);
    return null;
  }
}

export async function createSubmission(submission: Omit<Submission, 'id' | 'createdAt' | 'updatedAt'>): Promise<Submission | null> {
  try {
    // Get the current user's profile
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      return null;
    }

    const profile = await getProfile(user.id);
    if (!profile) {
      console.error('No profile found for user');
      return null;
    }

    const submissionData = {
      title: submission.title,
      description: submission.description,
      steps_to_reproduce: submission.stepsToReproduce,
      expected_behavior: submission.expectedBehavior,
      actual_behavior: submission.actualBehavior,
      device: submission.device,
      browser: submission.browser,
      os: submission.os,
      status: submission.status,
      priority: submission.priority,
      assignee_id: profile.id,
      project: submission.project,
      url: submission.url,
      screenshot: submission.screenshot,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Submitting data to Supabase:', submissionData);

    const { data, error } = await supabase
      .from('submissions')
      .insert([submissionData])
      .select(`
        *,
        assignee:profiles!submissions_assignee_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      console.error('No data returned from Supabase');
      return null;
    }

    console.log('Received data from Supabase:', data);

    // Map database fields to TypeScript type
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      stepsToReproduce: data.steps_to_reproduce,
      expectedBehavior: data.expected_behavior,
      actualBehavior: data.actual_behavior,
      device: data.device,
      browser: data.browser,
      os: data.os,
      status: data.status,
      priority: data.priority,
      assignee_id: data.assignee_id,
      project: data.project,
      url: data.url,
      screenshot: data.screenshot,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
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
        title: submission.title,
        description: submission.description,
        steps_to_reproduce: submission.stepsToReproduce,
        expected_behavior: submission.expectedBehavior,
        actual_behavior: submission.actualBehavior,
        device: submission.device,
        browser: submission.browser,
        os: submission.os,
        status: submission.status,
        priority: submission.priority,
        assignee_id: submission.assignee_id,
        project: submission.project,
        url: submission.url,
        screenshot: submission.screenshot,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return null;

    // Map database fields to TypeScript type
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      stepsToReproduce: data.steps_to_reproduce,
      expectedBehavior: data.expected_behavior,
      actualBehavior: data.actual_behavior,
      device: data.device,
      browser: data.browser,
      os: data.os,
      status: data.status,
      priority: data.priority,
      assignee_id: data.assignee_id,
      project: data.project,
      url: data.url,
      screenshot: data.screenshot,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
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