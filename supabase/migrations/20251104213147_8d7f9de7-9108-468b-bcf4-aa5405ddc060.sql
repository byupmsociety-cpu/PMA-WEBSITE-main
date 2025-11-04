-- Update the handle_new_user function to properly handle all user fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_persona text;
  user_school_year text;
BEGIN
  -- Extract persona from metadata, default to 'curious'
  user_persona := COALESCE(NEW.raw_user_meta_data->>'persona', 'curious');
  
  -- Extract school year from metadata, default to empty string
  user_school_year := COALESCE(NEW.raw_user_meta_data->>'school_year', '');
  
  -- Insert new profile with all necessary fields
  INSERT INTO public.profiles (
    user_id, 
    email, 
    full_name, 
    is_pma_member, 
    membership_verified_at, 
    school_year, 
    persona,
    onboarding_completed,
    progress_percentage
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    public.is_approved_pma_member(NEW.email),
    CASE 
      WHEN public.is_approved_pma_member(NEW.email) THEN now()
      ELSE NULL
    END,
    user_school_year,
    user_persona::user_persona,
    false,
    0
  );
  
  RETURN NEW;
END;
$$;