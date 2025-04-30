-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN full_name text,
ADD COLUMN role text CHECK (role IN ('developer', 'qa', 'product_manager', 'designer')),
ADD COLUMN avatar_url text,
ADD COLUMN bio text,
ADD COLUMN onboarding_completed boolean DEFAULT false;

-- Update existing profiles to have onboarding_completed as true
UPDATE profiles
SET onboarding_completed = true
WHERE onboarding_completed IS NULL; 