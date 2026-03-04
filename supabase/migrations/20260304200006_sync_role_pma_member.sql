-- Sync is_pma_member with role for existing data
-- guest role = is_pma_member false (free account)
-- member/admin/super-admin role = is_pma_member true (paid member)

-- Set is_pma_member = false for all guests
UPDATE public.profiles 
SET is_pma_member = false 
WHERE role = 'guest' AND (is_pma_member = true OR is_pma_member IS NULL);

-- Set is_pma_member = true for all members, admins, and super-admins
UPDATE public.profiles 
SET is_pma_member = true 
WHERE role IN ('member', 'admin', 'super-admin') AND (is_pma_member = false OR is_pma_member IS NULL);

-- Add comment explaining the relationship
COMMENT ON COLUMN public.profiles.is_pma_member IS 'Whether user is a paying PMA club member. Synced with role: guest=false, member/admin/super-admin=true.';
