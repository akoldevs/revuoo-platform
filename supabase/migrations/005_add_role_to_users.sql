-- Add a 'role' column to the users table for our application's permissions
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';