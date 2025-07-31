-- 061_upgrade_profiles_to_support_multiple_roles.sql

-- First, drop the old 'user_role' enum type if it exists from previous versions
-- DO $$ BEGIN
--  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
--      ALTER TABLE public.profiles ALTER COLUMN role TYPE TEXT;
--      DROP TYPE public.user_role;
--  END IF;
-- END $$;


-- 1. Change the 'role' column to be a text array (TEXT[])
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS role; -- Drop the old column if it exists

ALTER TABLE public.profiles
ADD COLUMN roles TEXT[] DEFAULT ARRAY['user']::TEXT[]; -- Add the new array column

-- 2. Update all existing users to have the default ['user'] role
UPDATE public.profiles
SET roles = ARRAY['user']::TEXT[]
WHERE roles IS NULL;

-- 3. Make sure the column cannot be null
ALTER TABLE public.profiles
ALTER COLUMN roles SET NOT NULL;

-- Add a comment for clarity
COMMENT ON COLUMN public.profiles.roles IS 'An array of roles for the user, e.g., {user, contributor, business}.';