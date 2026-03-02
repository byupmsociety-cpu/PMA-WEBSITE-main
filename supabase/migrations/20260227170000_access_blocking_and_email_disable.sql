-- Add blocking and soft-delete support for profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'is_blocked'
  ) THEN
    ALTER TABLE public.profiles
      ADD COLUMN is_blocked boolean NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE public.profiles
      ADD COLUMN deleted_at timestamptz;
  END IF;
END $$;

-- Track disabled pre-approved emails instead of only deleting rows
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'approved_pma_members'
      AND column_name = 'is_disabled'
  ) THEN
    ALTER TABLE public.approved_pma_members
      ADD COLUMN is_disabled boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Only treat enabled pre-approved emails as approved
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
      AND m.is_disabled IS NOT TRUE
  );
END;
$$;

