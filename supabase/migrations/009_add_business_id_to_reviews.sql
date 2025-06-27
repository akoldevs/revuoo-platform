-- This script adds a column to the 'reviews' table to link it to a business.
ALTER TABLE public.reviews
ADD COLUMN business_id BIGINT REFERENCES public.businesses(id) ON DELETE SET NULL;

-- Add a comment for clarity
COMMENT ON COLUMN public.reviews.business_id IS 'Links the review to a specific business profile.';