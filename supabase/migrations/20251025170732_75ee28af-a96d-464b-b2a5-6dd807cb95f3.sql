-- Add membership fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_pma_member BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS membership_verified_at TIMESTAMP WITH TIME ZONE;

-- Create function to check if email is an approved PMA member
CREATE OR REPLACE FUNCTION public.is_approved_pma_member(email_address TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN LOWER(email_address) IN (
    'bubba16@byu.edu',
    'trumand1@byu.edu',
    'fieldcc@byu.edu',
    'jonfoote@byu.edu',
    'bhawes10@byu.edu',
    'hbj7272@byu.edu',
    'dmattern@byu.edu',
    'nmccaul@byu.edu',
    'meadow22@byu.edu',
    'coramo@byu.edu',
    'id214870@byu.edu',
    'zpogue@byu.edu',
    'jrsarge@byu.edu',
    'ps324@byu.edu',
    'top98@byu.edu',
    'ht023661@byu.edu',
    'wait2@byu.edu',
    'woods8@byu.edu'
  );
END;
$$;

-- Update existing profiles for approved members
UPDATE public.profiles
SET is_pma_member = true,
    membership_verified_at = now()
WHERE LOWER(email) IN (
  'bubba16@byu.edu',
  'trumand1@byu.edu',
  'fieldcc@byu.edu',
  'jonfoote@byu.edu',
  'bhawes10@byu.edu',
  'hbj7272@byu.edu',
  'dmattern@byu.edu',
  'nmccaul@byu.edu',
  'meadow22@byu.edu',
  'coramo@byu.edu',
  'id214870@byu.edu',
  'zpogue@byu.edu',
  'jrsarge@byu.edu',
  'ps324@byu.edu',
  'top98@byu.edu',
  'ht023661@byu.edu',
  'wait2@byu.edu',
  'woods8@byu.edu'
);

-- Modify the handle_new_user trigger function to set membership status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, is_pma_member, membership_verified_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    public.is_approved_pma_member(NEW.email),
    CASE 
      WHEN public.is_approved_pma_member(NEW.email) THEN now()
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$;