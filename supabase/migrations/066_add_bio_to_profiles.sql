-- 066_add_bio_to_profiles.sql

ALTER TABLE public.profiles
ADD COLUMN bio TEXT;

COMMENT ON COLUMN public.profiles.bio IS 'A short biography for the user or contributor.';