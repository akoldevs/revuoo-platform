-- This script creates a trigger to automatically update the Revuoo Score
-- whenever a review is inserted, updated, or deleted.

-- 1. Create the trigger function
CREATE OR REPLACE FUNCTION public.update_business_revuoo_score()
RETURNS TRIGGER AS $$
DECLARE
  v_business_id BIGINT;
BEGIN
  -- Determine the business_id from the changed row
  IF (TG_OP = 'DELETE') THEN
    v_business_id := OLD.business_id;
  ELSE
    v_business_id := NEW.business_id;
  END IF;

  -- If a business_id exists, update its score
  IF v_business_id IS NOT NULL THEN
    UPDATE public.businesses
    SET revuoo_score = (SELECT public.calculate_revuoo_score(v_business_id))
    WHERE id = v_business_id;
  END IF;

  -- Return the appropriate record
  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger that calls the function
DROP TRIGGER IF EXISTS on_review_change_update_score ON public.reviews; -- Drop if it exists to be safe
CREATE TRIGGER on_review_change_update_score
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE PROCEDURE public.update_business_revuoo_score();