-- This migration upgrades the 'profiles' table to support the new RBAC system.
-- It replaces the old text-based 'roles' array with a direct link to the 'roles' table.

-- Step 1: Add the new 'role_id' column to the profiles table.
-- This will store the link to a role in the 'roles' table.
ALTER TABLE public.profiles
  ADD COLUMN role_id uuid;

-- Step 2: Add a foreign key constraint to ensure data integrity.
-- If a role is deleted, the user's role_id will be set to NULL, not deleted.
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE SET NULL;

-- Step 3: Migrate existing admin users to the new system.
-- This is a critical step to ensure no admins lose access.
DO $$
DECLARE
    admin_role_id uuid;
BEGIN
    -- Find the ID of the 'Administrator' role we created earlier.
    SELECT id INTO admin_role_id FROM public.roles WHERE name = 'Administrator';

    -- If the role exists, find all users who had 'admin' in their old
    -- 'roles' array and assign them the new 'Administrator' role_id.
    IF admin_role_id IS NOT NULL THEN
        UPDATE public.profiles
        SET role_id = admin_role_id
        WHERE 'admin' = ANY(roles);
    END IF;
END $$;

-- Step 4: Remove the old 'roles' text array column.
-- This column is now obsolete.
ALTER TABLE public.profiles
  DROP COLUMN roles;

-- Step 5: Upgrade the get_user_roles() function.
-- This function is used by all our security policies. We must update it
-- to read from the new 'role_id' instead of the old text array.
-- This ensures all existing RLS policies continue to work seamlessly.
CREATE OR REPLACE FUNCTION public.get_user_roles()
RETURNS text[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_roles text[];
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN ARRAY[]::text[];
    END IF;

    SELECT
        -- Create an array containing the single role name for the user
        ARRAY[r.name]
    INTO
        user_roles
    FROM
        public.profiles p
    JOIN
        public.roles r ON p.role_id = r.id
    WHERE
        p.id = auth.uid();

    -- If the user has no role, return an empty array instead of NULL
    RETURN COALESCE(user_roles, ARRAY[]::text[]);
END;
$$;