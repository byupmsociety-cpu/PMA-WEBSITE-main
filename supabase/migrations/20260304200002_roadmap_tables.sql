-- Roadmap System Tables for personalized PM journey tracking

-- 1. Roadmap profiles table - stores quiz responses and generated roadmap
CREATE TABLE IF NOT EXISTS public.roadmap_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    school_year text,
    major text,
    coding_experience text CHECK (coding_experience IN ('none', 'beginner', 'intermediate', 'advanced')),
    design_experience text CHECK (design_experience IN ('none', 'beginner', 'intermediate', 'advanced')),
    business_experience text CHECK (business_experience IN ('none', 'beginner', 'intermediate', 'advanced')),
    pm_experience text CHECK (pm_experience IN ('none', 'beginner', 'intermediate', 'advanced')),
    has_internship boolean DEFAULT false,
    interest_areas text[] DEFAULT '{}',
    skill_focus text[] DEFAULT '{}',
    generated_roadmap jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT roadmap_profiles_user_id_unique UNIQUE (user_id)
);

-- 2. Roadmap progress table - tracks completion of roadmap items
CREATE TABLE IF NOT EXISTS public.roadmap_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    roadmap_section text NOT NULL,
    item_id text NOT NULL,
    item_title text NOT NULL,
    completed_at timestamptz NOT NULL DEFAULT now(),
    notes text,
    CONSTRAINT roadmap_progress_user_item_unique UNIQUE (user_id, roadmap_section, item_id)
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_roadmap_profiles_user_id ON public.roadmap_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_progress_user_id ON public.roadmap_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_progress_section ON public.roadmap_progress(roadmap_section);

-- 4. Add updated_at trigger
CREATE TRIGGER update_roadmap_profiles_updated_at
BEFORE UPDATE ON public.roadmap_profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 5. Enable RLS
ALTER TABLE public.roadmap_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_progress ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for roadmap_profiles

-- Users can view their own roadmap profile
CREATE POLICY "Users can view own roadmap profile"
ON public.roadmap_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own roadmap profile
CREATE POLICY "Users can insert own roadmap profile"
ON public.roadmap_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own roadmap profile
CREATE POLICY "Users can update own roadmap profile"
ON public.roadmap_profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own roadmap profile
CREATE POLICY "Users can delete own roadmap profile"
ON public.roadmap_profiles
FOR DELETE
USING (auth.uid() = user_id);

-- 7. RLS Policies for roadmap_progress

-- Users can view their own progress
CREATE POLICY "Users can view own roadmap progress"
ON public.roadmap_progress
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own roadmap progress"
ON public.roadmap_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own roadmap progress"
ON public.roadmap_progress
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own progress
CREATE POLICY "Users can delete own roadmap progress"
ON public.roadmap_progress
FOR DELETE
USING (auth.uid() = user_id);

-- 8. Function to calculate roadmap completion percentage
CREATE OR REPLACE FUNCTION public.calculate_roadmap_completion(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_items integer;
    completed_items integer;
    roadmap_data jsonb;
BEGIN
    SELECT generated_roadmap INTO roadmap_data
    FROM public.roadmap_profiles
    WHERE user_id = p_user_id;
    
    IF roadmap_data IS NULL THEN
        RETURN 0;
    END IF;
    
    total_items := (
        COALESCE(jsonb_array_length(roadmap_data->'academics'), 0) +
        COALESCE(jsonb_array_length(roadmap_data->'clubs'), 0) +
        COALESCE(jsonb_array_length(roadmap_data->'projects'), 0) +
        COALESCE(jsonb_array_length(roadmap_data->'internships'), 0) +
        COALESCE(jsonb_array_length(roadmap_data->'skills'), 0) +
        COALESCE(jsonb_array_length(roadmap_data->'tools'), 0)
    );
    
    IF total_items = 0 THEN
        RETURN 0;
    END IF;
    
    SELECT COUNT(*) INTO completed_items
    FROM public.roadmap_progress
    WHERE user_id = p_user_id;
    
    RETURN LEAST(100, (completed_items * 100 / total_items));
END;
$$;
