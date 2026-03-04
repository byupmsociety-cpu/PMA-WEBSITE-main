-- Add is_premium column to resources table for PMA member-only content
-- This is separate from is_paid which indicates partner/affiliate resources

ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS is_premium boolean NOT NULL DEFAULT false;

-- Create index for filtering premium resources
CREATE INDEX IF NOT EXISTS idx_resources_is_premium ON public.resources(is_premium);

-- Add comment explaining the difference between is_paid and is_premium
COMMENT ON COLUMN public.resources.is_premium IS 'Premium resources are only accessible to verified PMA members. Different from is_paid which indicates partner/affiliate resources.';
