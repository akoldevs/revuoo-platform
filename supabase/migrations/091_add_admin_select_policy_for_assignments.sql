-- This migration adds a new security policy to allow administrators
-- to view all records in the 'assignments' table. This is crucial
-- for the admin moderation queue to function correctly.

-- First, we create a helper function to get the roles of the current user.
-- This function is necessary for our RLS policy to check for the 'admin' role.
create or replace function public.get_user_roles()
returns text[]
language sql
security definer
set search_path = public
as $$
  select roles
  from public.profiles
  where id = auth.uid();
$$;

-- Now, create the policy using the helper function.
CREATE POLICY "Admins can view all assignments"
ON public.assignments
FOR SELECT
TO authenticated
USING (
  'admin' = ANY(get_user_roles())
);
