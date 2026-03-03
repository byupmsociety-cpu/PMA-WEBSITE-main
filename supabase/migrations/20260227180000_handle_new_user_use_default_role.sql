-- Use default_role from approved_pma_members when creating a new user profile.
-- Previously handle_new_user always set approved users to 'user'; now it uses
-- the role stored in approved_pma_members (user or admin).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  approved BOOLEAN;
  assigned_role text;
  user_persona text;
  user_school_year text;
BEGIN
  -- Look up approved row and get default_role; only consider non-disabled rows
  SELECT m.default_role INTO assigned_role
  FROM public.approved_pma_members m
  WHERE LOWER(m.email) = LOWER(NEW.email)
    AND (m.is_disabled IS NULL OR m.is_disabled IS NOT TRUE);

  approved := (assigned_role IS NOT NULL);

  -- If not approved, they are a guest
  IF NOT approved THEN
    assigned_role := 'guest';
  END IF;
  -- Else assigned_role is already 'user' or 'admin' from the table

  user_persona := COALESCE(NEW.raw_user_meta_data->>'persona', 'curious');
  user_school_year := COALESCE(NEW.raw_user_meta_data->>'school_year', '');

  INSERT INTO public.profiles (
    user_id,
    email,
    full_name,
    is_pma_member,
    membership_verified_at,
    role,
    school_year,
    persona,
    onboarding_completed,
    progress_percentage
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    approved,
    CASE WHEN approved THEN now() ELSE NULL END,
    assigned_role,
    user_school_year,
    user_persona::user_persona,
    false,
    0
  );

  RETURN NEW;
END;
$$;
