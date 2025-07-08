-- This adds a credibility score to user profiles, which is the foundation of our gamification system.

ALTER TABLE public.profiles
  ADD COLUMN credibility_score INT NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.profiles.credibility_score IS 'A score to represent the trustworthiness and contribution level of a user.';