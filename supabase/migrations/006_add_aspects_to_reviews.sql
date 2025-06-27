-- Rename the existing 'rating' column to be more specific
ALTER TABLE public.reviews
RENAME COLUMN rating TO overall_rating;

-- Add the new columns for aspect-based ratings (from 1 to 5)
ALTER TABLE public.reviews
ADD COLUMN quality SMALLINT CHECK (quality >= 1 AND quality <= 5),
ADD COLUMN professionalism SMALLINT CHECK (professionalism >= 1 AND professionalism <= 5),
ADD COLUMN punctuality SMALLINT CHECK (punctuality >= 1 AND punctuality <= 5),
ADD COLUMN communication SMALLINT CHECK (communication >= 1 AND communication <= 5),
ADD COLUMN value SMALLINT CHECK (value >= 1 AND value <= 5);

-- Add a column for the date the service was performed
ALTER TABLE public.reviews
ADD COLUMN service_date DATE;

-- Add comments for clarity on the new columns
COMMENT ON COLUMN public.reviews.overall_rating IS 'User''s single overall rating (e.g., 4.5)';
COMMENT ON COLUMN public.reviews.quality IS 'Aspect rating for quality of service';
COMMENT ON COLUMN public.reviews.professionalism IS 'Aspect rating for staff professionalism';
COMMENT ON COLUMN public.reviews.punctuality IS 'Aspect rating for punctuality and reliability';
COMMENT ON COLUMN public.reviews.communication IS 'Aspect rating for booking and communication';
COMMENT ON COLUMN public.reviews.value IS 'Aspect rating for value for money';
COMMENT ON COLUMN public.reviews.service_date IS 'The date the service was provided to the user';