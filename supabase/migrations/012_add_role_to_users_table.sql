-- Add a 'role' column to the users table for our application's permissions
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

COMMENT ON COLUMN public.users.role IS 'User role for permissions (e.g., user, contributor, admin).';