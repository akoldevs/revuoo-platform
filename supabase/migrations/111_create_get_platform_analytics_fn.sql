-- This migration creates a single, powerful database function to calculate
-- all the high-level statistics needed for the main Platform Analytics page.
-- This is highly efficient as it gathers all stats in one database round-trip.

CREATE OR REPLACE FUNCTION public.get_platform_analytics_stats()
RETURNS TABLE (
    total_users bigint,
    total_businesses bigint,
    total_user_reviews bigint,
    total_expert_reviews bigint,
    average_platform_rating numeric
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT
        (SELECT count(*) FROM public.profiles) AS total_users,
        (SELECT count(*) FROM public.businesses) AS total_businesses,
        (SELECT count(*) FROM public.reviews WHERE status = 'approved') AS total_user_reviews,
        (SELECT count(*) FROM public.expert_reviews WHERE status = 'approved') AS total_expert_reviews,
        (SELECT avg(overall_rating) FROM public.reviews WHERE status = 'approved') AS average_platform_rating
$$;
