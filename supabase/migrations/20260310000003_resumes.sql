-- Create asset_reviews table
CREATE TABLE public.asset_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    feedback TEXT,
    reviewer_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.asset_reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own reviews"
    ON public.asset_reviews FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reviews"
    ON public.asset_reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pending reviews"
    ON public.asset_reviews FOR DELETE
    USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all reviews"
    ON public.asset_reviews FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.user_id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can update reviews"
    ON public.asset_reviews FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.user_id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Set up trigger for updated_at
CREATE TRIGGER set_asset_reviews_updated_at
    BEFORE UPDATE ON public.asset_reviews
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- Note: Creating storage buckets via SQL requires superuser privileges in Supabase.
-- It is recommended to create the 'resumes' storage bucket manually via the Supabase Dashboard UI.
-- 1. Go to Storage -> Create a new bucket named 'resumes'
-- 2. Make it a public bucket
-- 3. Set up Storage Policies to allow authenticated users to upload, and anyone/authenticated to read.

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
