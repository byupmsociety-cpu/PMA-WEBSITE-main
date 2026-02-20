-- PMA roles, approved members management, and admin content tables

-- 1. Add role column to profiles and backfill based on membership
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles
      ADD COLUMN role text NOT NULL DEFAULT 'guest'
      CHECK (role IN ('super-admin','admin','user','guest'));
  END IF;
END $$;

-- Backfill role values for existing rows using is_pma_member when available
UPDATE public.profiles
SET role = CASE
  WHEN is_pma_member IS TRUE THEN 'user'
  ELSE 'guest'
END
WHERE role IS NULL OR role = 'guest';

-- 2. Ensure approved_pma_members table exists and extend it for admin management
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'approved_pma_members'
  ) THEN
    CREATE TABLE public.approved_pma_members (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text UNIQUE NOT NULL,
      added_at timestamptz NOT NULL DEFAULT now()
    );
  END IF;
END $$;

-- Add management columns if they don't exist
ALTER TABLE public.approved_pma_members
  ADD COLUMN IF NOT EXISTS default_role text NOT NULL DEFAULT 'user'
    CHECK (default_role IN ('user','admin')),
  ADD COLUMN IF NOT EXISTS added_by uuid,
  ADD COLUMN IF NOT EXISTS used_at timestamptz;

-- Seed approved_pma_members with any emails hardcoded in the previous is_approved_pma_member function
INSERT INTO public.approved_pma_members (email)
VALUES
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
  ('woods8@byu.edu')
ON CONFLICT (email) DO NOTHING;

-- Enable RLS on approved_pma_members
ALTER TABLE public.approved_pma_members ENABLE ROW LEVEL SECURITY;

-- Allow only admins and super-admins to manage approved_pma_members
CREATE POLICY "Admins manage approved PMA members (select)"
ON public.approved_pma_members
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
);

CREATE POLICY "Admins manage approved PMA members (insert)"
ON public.approved_pma_members
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
);

CREATE POLICY "Admins manage approved PMA members (update)"
ON public.approved_pma_members
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
);

CREATE POLICY "Admins manage approved PMA members (delete)"
ON public.approved_pma_members
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
);

-- 3. Re-implement is_approved_pma_member to use the table instead of a hardcoded list
CREATE OR REPLACE FUNCTION public.is_approved_pma_member(email_address TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.approved_pma_members m
    WHERE LOWER(m.email) = LOWER(email_address)
  );
END;
$$;

-- 4. Update handle_new_user trigger function to set membership and role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  approved BOOLEAN;
  assigned_role text;
BEGIN
  approved := public.is_approved_pma_member(NEW.email);

  assigned_role := CASE
    WHEN approved THEN 'user'
    ELSE 'guest'
  END;

  INSERT INTO public.profiles (user_id, email, full_name, is_pma_member, membership_verified_at, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    approved,
    CASE WHEN approved THEN now() ELSE NULL END,
    assigned_role
  );

  RETURN NEW;
END;
$$;

-- 5. Additional RLS policies on profiles for admin access

-- Allow admins and super-admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
);

-- Allow admins and super-admins to update any profile (fine-grained role rules enforced in app)
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
);

-- 6. Content management tables for team members and events

-- Team members table replacing Airtable
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text,
  bio text,
  image_url text,
  priority integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Public read access to team member info
CREATE POLICY "Anyone can view team members"
ON public.team_members
FOR SELECT
USING (true);

-- Only admins and super-admins can modify team members
CREATE POLICY "Admins manage team members"
ON public.team_members
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
);

-- Events table replacing Airtable
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  location text,
  is_public boolean NOT NULL DEFAULT true,
  registration_link text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public can view public events
CREATE POLICY "Anyone can view public events"
ON public.events
FOR SELECT
USING (is_public = true);

-- Authenticated users (e.g., members) can view all events if desired
CREATE POLICY "Authenticated users can view all events"
ON public.events
FOR SELECT
TO authenticated
USING (true);

-- Only admins and super-admins can modify events
CREATE POLICY "Admins manage events"
ON public.events
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
);

