-- Fix infinite recursion in profiles RLS policies.
-- "Admins can view all profiles" and "Admins can update any profile" query profiles
-- to check admin status, which triggers the same policies -> infinite recursion.
-- Solution: Use a SECURITY DEFINER function that bypasses RLS to check admin role.

-- 1. Create helper that bypasses RLS (runs as definer)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
      AND role IN ('admin','super-admin')
  );
$$;

-- 2. Drop the recursive policies on profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- 3. Recreate using the helper (no recursion)
-- "Users can view other users' basic profiles" (TO authenticated USING true) already allows
-- authenticated users to view all profiles, so we don't need a separate admin SELECT policy.
-- For UPDATE: admins can update any profile; users can already update own via "Users can update their own profile"
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());
