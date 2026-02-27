-- Update handle_new_user to include school_year, persona, onboarding_completed, progress_percentage
-- while preserving role logic from pma_roles_and_admin (approved -> user, else guest)
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
  approved := public.is_approved_pma_member(NEW.email);
  assigned_role := CASE WHEN approved THEN 'user' ELSE 'guest' END;
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
