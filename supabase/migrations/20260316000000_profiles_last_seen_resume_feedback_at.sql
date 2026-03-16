-- Add last_seen_resume_feedback_at to profiles for resume review tracking
-- This column stores when a user last viewed their latest resume feedback.

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_seen_resume_feedback_at timestamptz;

-- Ask PostgREST to reload the schema so the new column
-- is immediately available to the API layer.
NOTIFY pgrst, 'reload schema';

