-- 053_add_notification_preferences_to_profiles.sql

ALTER TABLE public.profiles
ADD COLUMN wants_review_replies_notifications BOOLEAN DEFAULT true,
ADD COLUMN wants_new_follower_notifications BOOLEAN DEFAULT true,
ADD COLUMN wants_weekly_digest_notifications BOOLEAN DEFAULT true;

COMMENT ON COLUMN public.profiles.wants_review_replies_notifications IS 'User wants to be notified of replies to their reviews.';