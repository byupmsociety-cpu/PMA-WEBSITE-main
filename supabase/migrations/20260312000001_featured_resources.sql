-- Add a featured flag to resources so admins can control the top carousel
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

-- Auto-seed the original 6 featured resources
UPDATE public.resources
SET is_featured = true
WHERE title IN ('Lovable.dev', 'Cursor', 'Jobright', 'PMF Labs', 'Leland+', 'APM Season');
