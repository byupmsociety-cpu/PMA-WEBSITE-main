-- Job System Tables for PMA Member Job Alerts

-- 1. Job preferences table - stores member job search criteria
CREATE TABLE IF NOT EXISTS public.job_preferences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_types text[] DEFAULT '{}',
    industries text[] DEFAULT '{}',
    locations text[] DEFAULT '{}',
    company_sizes text[] DEFAULT '{}',
    min_salary integer,
    is_actively_looking boolean DEFAULT true,
    notify_email boolean DEFAULT true,
    notify_in_app boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT job_preferences_user_id_unique UNIQUE (user_id)
);

-- 2. Job postings table - admin-curated job listings
CREATE TABLE IF NOT EXISTS public.job_postings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    company text NOT NULL,
    description text,
    url text NOT NULL,
    job_type text CHECK (job_type IN ('internship', 'full-time', 'part-time', 'contract')),
    industry text,
    location text,
    company_size text CHECK (company_size IN ('startup', 'mid-size', 'enterprise')),
    salary_range text,
    deadline date,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    posted_by uuid REFERENCES auth.users(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Job notifications table - tracks which jobs users have been notified about
CREATE TABLE IF NOT EXISTS public.job_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id uuid NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
    notified_at timestamptz NOT NULL DEFAULT now(),
    viewed_at timestamptz,
    applied boolean DEFAULT false,
    saved boolean DEFAULT false,
    CONSTRAINT job_notifications_user_job_unique UNIQUE (user_id, job_id)
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_preferences_user_id ON public.job_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_is_active ON public.job_postings(is_active);
CREATE INDEX IF NOT EXISTS idx_job_postings_job_type ON public.job_postings(job_type);
CREATE INDEX IF NOT EXISTS idx_job_postings_deadline ON public.job_postings(deadline);
CREATE INDEX IF NOT EXISTS idx_job_postings_created_at ON public.job_postings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_notifications_user_id ON public.job_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_notifications_job_id ON public.job_notifications(job_id);

-- 5. Add updated_at triggers
CREATE TRIGGER update_job_preferences_updated_at
BEFORE UPDATE ON public.job_preferences
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_job_postings_updated_at
BEFORE UPDATE ON public.job_postings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 6. Enable RLS
ALTER TABLE public.job_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_notifications ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for job_preferences

-- Users can view their own preferences
CREATE POLICY "Users can view own job preferences"
ON public.job_preferences
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert own job preferences"
ON public.job_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own job preferences"
ON public.job_preferences
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own preferences
CREATE POLICY "Users can delete own job preferences"
ON public.job_preferences
FOR DELETE
USING (auth.uid() = user_id);

-- Admins can view all preferences (for matching)
CREATE POLICY "Admins can view all job preferences"
ON public.job_preferences
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid()
        AND p.role IN ('admin', 'super-admin')
    )
);

-- 8. RLS Policies for job_postings

-- PMA members can view active job postings
CREATE POLICY "PMA members can view active job postings"
ON public.job_postings
FOR SELECT
USING (
    is_active = true
    AND EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid()
        AND p.is_pma_member = true
    )
);

-- Admins can view all job postings
CREATE POLICY "Admins can view all job postings"
ON public.job_postings
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid()
        AND p.role IN ('admin', 'super-admin')
    )
);

-- Admins can insert job postings
CREATE POLICY "Admins can insert job postings"
ON public.job_postings
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid()
        AND p.role IN ('admin', 'super-admin')
    )
);

-- Admins can update job postings
CREATE POLICY "Admins can update job postings"
ON public.job_postings
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid()
        AND p.role IN ('admin', 'super-admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid()
        AND p.role IN ('admin', 'super-admin')
    )
);

-- Admins can delete job postings
CREATE POLICY "Admins can delete job postings"
ON public.job_postings
FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid()
        AND p.role IN ('admin', 'super-admin')
    )
);

-- 9. RLS Policies for job_notifications

-- Users can view their own notifications
CREATE POLICY "Users can view own job notifications"
ON public.job_notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own notifications (for marking as viewed/applied)
CREATE POLICY "Users can insert own job notifications"
ON public.job_notifications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own notifications
CREATE POLICY "Users can update own job notifications"
ON public.job_notifications
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can insert notifications (for sending alerts)
CREATE POLICY "Admins can insert job notifications"
ON public.job_notifications
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid()
        AND p.role IN ('admin', 'super-admin')
    )
);

-- 10. Function to get matching users for a job posting
CREATE OR REPLACE FUNCTION public.get_matching_users_for_job(job_posting_id uuid)
RETURNS TABLE (
    user_id uuid,
    email text,
    full_name text,
    match_score integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    job_record RECORD;
BEGIN
    SELECT * INTO job_record FROM public.job_postings WHERE id = job_posting_id;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;
    
    RETURN QUERY
    SELECT 
        jp.user_id,
        p.email,
        p.full_name,
        (
            CASE WHEN job_record.job_type = ANY(jp.job_types) THEN 25 ELSE 0 END +
            CASE WHEN job_record.industry = ANY(jp.industries) THEN 25 ELSE 0 END +
            CASE WHEN job_record.location = ANY(jp.locations) THEN 25 ELSE 0 END +
            CASE WHEN job_record.company_size = ANY(jp.company_sizes) THEN 25 ELSE 0 END
        )::integer as match_score
    FROM public.job_preferences jp
    JOIN public.profiles p ON p.user_id = jp.user_id
    WHERE jp.is_actively_looking = true
    AND p.is_pma_member = true
    AND (
        job_record.job_type = ANY(jp.job_types)
        OR job_record.industry = ANY(jp.industries)
        OR job_record.location = ANY(jp.locations)
        OR job_record.company_size = ANY(jp.company_sizes)
        OR (array_length(jp.job_types, 1) IS NULL AND array_length(jp.industries, 1) IS NULL 
            AND array_length(jp.locations, 1) IS NULL AND array_length(jp.company_sizes, 1) IS NULL)
    )
    ORDER BY match_score DESC;
END;
$$;
