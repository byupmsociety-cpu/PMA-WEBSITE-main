-- Update the handle_new_user function to include school_year and persona
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, is_pma_member, membership_verified_at, school_year, persona)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    public.is_approved_pma_member(NEW.email),
    CASE 
      WHEN public.is_approved_pma_member(NEW.email) THEN now()
      ELSE NULL
    END,
    COALESCE(NEW.raw_user_meta_data->>'school_year', ''),
    COALESCE(NEW.raw_user_meta_data->>'persona', 'curious')
  );
  RETURN NEW;
END;
$function$;