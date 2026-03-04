-- Add member directory fields to profiles table

-- 1. Add recruiting stage field
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS recruiting_stage text 
CHECK (recruiting_stage IN ('exploring', 'applying', 'interviewing', 'offer', 'not_looking'));

-- 2. Add target roles field (array of roles they're interested in)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS target_roles text[] DEFAULT '{}';

-- 3. Add LinkedIn URL
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS linkedin_url text;

-- 4. Add visibility toggle for directory
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_visible_in_directory boolean DEFAULT true;

-- 5. Add bio/about field
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio text;

-- 6. Create indexes for directory queries
CREATE INDEX IF NOT EXISTS idx_profiles_recruiting_stage ON public.profiles(recruiting_stage);
CREATE INDEX IF NOT EXISTS idx_profiles_is_visible_in_directory ON public.profiles(is_visible_in_directory);
CREATE INDEX IF NOT EXISTS idx_profiles_is_pma_member ON public.profiles(is_pma_member);

-- 7. Create a view for the member directory (only shows visible PMA members)
CREATE OR REPLACE VIEW public.member_directory AS
SELECT 
    p.id,
    p.user_id,
    p.full_name,
    p.avatar_url,
    p.school_year,
    p.recruiting_stage,
    p.target_roles,
    p.linkedin_url,
    p.bio,
    p.created_at
FROM public.profiles p
WHERE p.is_pma_member = true
AND p.is_visible_in_directory = true
AND p.is_blocked = false
AND p.deleted_at IS NULL;

-- 8. Grant access to the view
GRANT SELECT ON public.member_directory TO authenticated;
