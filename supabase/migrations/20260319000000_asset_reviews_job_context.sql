-- Add job context fields to asset_reviews
ALTER TABLE public.asset_reviews
ADD COLUMN is_tailored BOOLEAN DEFAULT false,
ADD COLUMN job_title TEXT,
ADD COLUMN job_url TEXT,
ADD COLUMN job_description TEXT;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
