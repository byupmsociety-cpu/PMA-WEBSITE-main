-- Fix infinite recursion in events RLS policies
-- The "Admins manage events" policy was using FOR ALL which includes SELECT,
-- causing recursion when anonymous users query events. We need to separate
-- SELECT policies from INSERT/UPDATE/DELETE policies.

-- Drop the existing "Admins manage events" policy that uses FOR ALL
DROP POLICY IF EXISTS "Admins manage events" ON public.events;

-- Create separate policies for INSERT, UPDATE, and DELETE (not SELECT)
-- This prevents the recursion issue while still allowing admins to manage events
CREATE POLICY "Admins can insert events"
ON public.events
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
);

CREATE POLICY "Admins can update events"
ON public.events
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

CREATE POLICY "Admins can delete events"
ON public.events
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
);

-- The SELECT policies remain unchanged:
-- - "Anyone can view public events" (for anonymous users)
-- - "Authenticated users can view all events" (for logged-in users)
