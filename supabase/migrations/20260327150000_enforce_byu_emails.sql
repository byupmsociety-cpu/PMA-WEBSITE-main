-- Strict BYU Email Enforcement Migration

-- 1. Create a trigger function to logically enforce @byu.edu domains dynamically on Supabase Auth insertion
CREATE OR REPLACE FUNCTION public.check_byu_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Strict domain check (ignoring superadmin email)
  IF NOT (LOWER(NEW.email) LIKE '%@byu.edu' OR LOWER(NEW.email) = 'byupmsociety@gmail.com') THEN
    RAISE EXCEPTION 'Only @byu.edu email addresses are allowed to sign up for PMA.';
  END IF;
  RETURN NEW;
END;
$$;

-- 2. Bind the trigger hook to the `auth.users` table so it prevents API bypass
DROP TRIGGER IF EXISTS ensure_byu_email ON auth.users;

CREATE TRIGGER ensure_byu_email
BEFORE INSERT OR UPDATE OF email
ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.check_byu_email();

-- 3. Clean up the database: Permanently delete `jmaximum72@gmail.com`
-- Deleting from auth.users triggers the underlying foreign key cascades (e.g. public.profiles) 
DELETE FROM auth.users WHERE LOWER(email) = 'jmaximum72@gmail.com';
