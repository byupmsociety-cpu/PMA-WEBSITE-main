-- Add email and linkedin_url to team_members for contact info on card flip
ALTER TABLE public.team_members
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS linkedin_url text;
