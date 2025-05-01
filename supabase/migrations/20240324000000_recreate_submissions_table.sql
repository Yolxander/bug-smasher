-- Drop existing table if it exists
DROP TABLE IF EXISTS submissions;

-- Create submissions table with proper structure
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  steps_to_reproduce TEXT NOT NULL,
  expected_behavior TEXT NOT NULL,
  actual_behavior TEXT NOT NULL,
  device TEXT NOT NULL,
  browser TEXT NOT NULL,
  os TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open',
  priority TEXT NOT NULL DEFAULT 'Medium',
  assignee_id UUID REFERENCES profiles(id),
  project JSONB NOT NULL DEFAULT '{"id": "1", "name": "Clever Project"}'::jsonb,
  url TEXT,
  screenshot TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add index for better performance
CREATE INDEX idx_submissions_assignee_id ON submissions(assignee_id);

-- Add RLS policies for submissions table
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all submissions
CREATE POLICY "Allow authenticated users to read submissions"
ON submissions FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to create submissions
CREATE POLICY "Allow authenticated users to create submissions"
ON submissions FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to update their own submissions
CREATE POLICY "Allow users to update their own submissions"
ON submissions FOR UPDATE
TO authenticated
USING (assignee_id = auth.uid())
WITH CHECK (assignee_id = auth.uid());

-- Allow users to delete their own submissions
CREATE POLICY "Allow users to delete their own submissions"
ON submissions FOR DELETE
TO authenticated
USING (assignee_id = auth.uid()); 