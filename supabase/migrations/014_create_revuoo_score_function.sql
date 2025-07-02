-- This script creates a function to calculate the Revuoo Score for a given business

CREATE OR REPLACE FUNCTION public.calculate_revuoo_score(p_business_id BIGINT)
RETURNS NUMERIC AS $$
DECLARE
  v_score NUMERIC;
BEGIN
  SELECT
    -- We multiply the final result by 2 to scale our 1-5 rating system to a 0-10 score.
    AVG(
      (quality * 0.30) +
      (professionalism * 0.20) +
      (punctuality * 0.15) +
      (communication * 0.15) +
      (value * 0.20)
    ) * 2
  INTO v_score
  FROM public.reviews
  WHERE
    business_id = p_business_id AND status = 'approved';

  -- If there are no approved reviews, return NULL (no score)
  RETURN COALESCE(v_score, NULL);
END;
$$ LANGUAGE plpgsql;