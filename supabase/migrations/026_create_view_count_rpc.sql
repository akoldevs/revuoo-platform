-- This function handles incrementing the view count for a given business on the current day.
-- It will create a new row for the day if one doesn't exist,
-- or it will increment the count on the existing row if it does.

CREATE OR REPLACE FUNCTION public.increment_business_view_count(p_business_id BIGINT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.business_profile_views (business_id, view_date, view_count)
  VALUES (p_business_id, CURRENT_DATE, 1)
  ON CONFLICT (business_id, view_date)
  DO UPDATE SET view_count = business_profile_views.view_count + 1;
END;
$$ LANGUAGE plpgsql;