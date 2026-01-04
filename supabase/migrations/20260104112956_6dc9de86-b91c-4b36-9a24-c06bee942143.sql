-- Allow authenticated users to view basic profile info (for messaging)
CREATE POLICY "Authenticated users can view profiles for messaging"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Note: This overlaps with existing "Users can view their own profile" but Postgres 
-- evaluates OR between policies, so this allows users to see all profiles