-- 054_add_privacy_settings_to_profiles.sql

ALTER TABLE public.profiles
ADD COLUMN is_profile_public BOOLEAN DEFAULT true,
ADD COLUMN prefers_anonymous_reviews BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.profiles.is_profile_public IS 'If true, the user''s profile is visible to the public.';
COMMENT ON COLUMN public.profiles.prefers_anonymous_reviews IS 'If true, new reviews by this user will be posted as "Anonymous".';