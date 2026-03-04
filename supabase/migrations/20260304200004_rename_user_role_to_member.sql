-- Rename 'user' role to 'member' for clarity
-- This migration updates all existing 'user' roles to 'member' and updates constraints

-- 1. First, drop the existing check constraints
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.approved_pma_members DROP CONSTRAINT IF EXISTS approved_pma_members_default_role_check;

-- 2. Update existing data
UPDATE public.profiles
SET role = 'member'
WHERE role = 'user';

UPDATE public.approved_pma_members
SET default_role = 'member'
WHERE default_role = 'user';

-- 3. Re-add check constraints with 'member' instead of 'user'
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check
CHECK (role IN ('super-admin', 'admin', 'member', 'guest'));

ALTER TABLE public.approved_pma_members
ADD CONSTRAINT approved_pma_members_default_role_check
CHECK (default_role IN ('member', 'admin'));

-- 4. Update the handle_new_user function to use 'member' instead of 'user'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  approved BOOLEAN;
  assigned_role TEXT;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.approved_pma_members
    WHERE email = NEW.email
      AND is_disabled = FALSE
  ) INTO approved;

  IF approved THEN
    SELECT COALESCE(default_role, 'member')
    INTO assigned_role
    FROM public.approved_pma_members
    WHERE email = NEW.email
      AND is_disabled = FALSE
    LIMIT 1;
  ELSE
    assigned_role := 'guest';
  END IF;

  INSERT INTO public.profiles (user_id, email, full_name, role, is_pma_member)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    assigned_role,
    approved
  );

  IF approved THEN
    UPDATE public.approved_pma_members
    SET used_at = NOW()
    WHERE email = NEW.email;
  END IF;

  RETURN NEW;
END;
$$;

-- 5. Add comment explaining the role hierarchy
COMMENT ON COLUMN public.profiles.role IS 'User role: super-admin > admin > member > guest. "member" replaced "user" for clarity.';
