-- Add a 'status' column to the reviews table for moderation
ALTER TABLE public.reviews
ADD COLUMN
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add a comment for clarity
COMMENT ON COLUMN public.reviews.status IS 'The moderation status of the review.';