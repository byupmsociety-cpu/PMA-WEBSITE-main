-- Allow authenticated users to view basic profile information of other users
-- This is needed for the connect/peer activity feature
CREATE POLICY "Users can view other users' basic profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);