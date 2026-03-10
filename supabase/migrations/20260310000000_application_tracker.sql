-- This table is for the integrated Application Tracker feature.
-- It maps an authenticated user to a given job_posting they are tracking.
-- Users can also create custom manual applications without linking to an existing job posting.

CREATE TABLE public.job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    job_posting_id UUID REFERENCES public.job_postings(id) ON DELETE SET NULL, -- optional
    company_name TEXT, -- Primarily used when job_posting_id is null, but can be copied over for convenience
    job_title TEXT,    -- Primarily used when job_posting_id is null
    status TEXT NOT NULL CHECK (status IN ('wishlist', 'applied', 'interviewing', 'offer', 'rejected')),
    notes TEXT,
    applied_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Allow users to manage only their own applications
CREATE POLICY "Users can insert their own applications" 
ON public.job_applications FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications" 
ON public.job_applications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" 
ON public.job_applications FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications" 
ON public.job_applications FOR DELETE 
USING (auth.uid() = user_id);

-- Optional: Add indexes for faster querying
CREATE INDEX idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX idx_job_applications_status ON public.job_applications(status);

-- Create trigger to automatically update the `updated_at` column
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
