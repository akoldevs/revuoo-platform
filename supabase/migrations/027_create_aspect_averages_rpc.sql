-- This function calculates the average for each of the 5 aspect ratings for a given business.

CREATE OR REPLACE FUNCTION public.get_business_aspect_averages(p_business_id BIGINT)
RETURNS JSONB AS $$
DECLARE
  v_aspects JSONB;
BEGIN
  SELECT
    jsonb_build_object(
      'quality', AVG(quality),
      'professionalism', AVG(professionalism),
      'punctuality', AVG(punctuality),
      'communication', AVG(communication),
      'value', AVG(value)
    )
  INTO v_aspects
  FROM public.reviews
  WHERE
    business_id = p_business_id AND status = 'approved';

  RETURN v_aspects;
END;
$$ LANGUAGE plpgsql;