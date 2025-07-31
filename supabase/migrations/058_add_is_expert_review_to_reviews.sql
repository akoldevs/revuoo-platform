-- 058_add_is_expert_review_to_reviews.sql

ALTER TABLE public.reviews
ADD COLUMN is_expert_review BOOLEAN DEFAULT false NOT NULL;

COMMENT ON COLUMN public.reviews.is_expert_review IS 'If true, this review was written by a paid expert contributor.';