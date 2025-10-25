-- Create approved PMA members table
CREATE TABLE public.approved_pma_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  added_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.approved_pma_members ENABLE ROW LEVEL SECURITY;

-- Anyone can read (needed for the verification function)
CREATE POLICY "Anyone can view approved members"
ON public.approved_pma_members
FOR SELECT
USING (true);

-- Only authenticated users can insert/update/delete (you can make this admin-only later)
CREATE POLICY "Authenticated users can manage approved members"
ON public.approved_pma_members
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Insert existing approved members
INSERT INTO public.approved_pma_members (email) VALUES
  ('bubba16@byu.edu'),
  ('trumand1@byu.edu'),
  ('fieldcc@byu.edu'),
  ('jonfoote@byu.edu'),
  ('bhawes10@byu.edu'),
  ('hbj7272@byu.edu'),
  ('dmattern@byu.edu'),
  ('nmccaul@byu.edu'),
  ('meadow22@byu.edu'),
  ('coramo@byu.edu'),
  ('id214870@byu.edu'),
  ('zpogue@byu.edu'),
  ('jrsarge@byu.edu'),
  ('ps324@byu.edu'),
  ('top98@byu.edu'),
  ('ht023661@byu.edu'),
  ('wait2@byu.edu'),
  ('woods8@byu.edu');

-- Update the is_approved_pma_member function to query the table
CREATE OR REPLACE FUNCTION public.is_approved_pma_member(email_address text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.approved_pma_members 
    WHERE LOWER(email) = LOWER(email_address)
  );
END;
$function$;