-- 039_create_get_platform_stats_function.sql

CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS TABLE(
    approved_reviews_count BIGINT,
    businesses_count BIGINT,
    categories_count BIGINT,
    total_users_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM public.reviews WHERE status = 'approved') as approved_reviews_count,
        (SELECT COUNT(*) FROM public.businesses) as businesses_count,
        (SELECT COUNT(*) FROM public.categories) as categories_count,
        (SELECT COUNT(*) FROM public.users) as total_users_count;
END;
$$ LANGUAGE plpgsql;