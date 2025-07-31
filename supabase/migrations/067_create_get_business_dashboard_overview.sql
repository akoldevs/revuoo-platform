-- 067_create_get_business_dashboard_overview.sql

CREATE OR REPLACE FUNCTION get_business_dashboard_overview(p_business_id BIGINT)
RETURNS TABLE(
    total_reviews BIGINT,
    average_rating NUMERIC,
    new_reviews_last_30_days BIGINT,
    profile_views_last_30_days BIGINT,
    current_revuoo_score NUMERIC
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM public.reviews WHERE business_id = p_business_id AND status = 'approved') as total_reviews,
        (SELECT AVG(overall_rating) FROM public.reviews WHERE business_id = p_business_id AND status = 'approved') as average_rating,
        (SELECT COUNT(*) FROM public.reviews WHERE business_id = p_business_id AND status = 'approved' AND created_at >= now() - interval '30 days') as new_reviews_last_30_days,
        (SELECT COALESCE(SUM(view_count), 0) FROM public.business_profile_views WHERE business_id = p_business_id AND view_date >= now() - interval '30 days') as profile_views_last_30_days,
        (SELECT revuoo_score FROM public.businesses WHERE id = p_business_id) as current_revuoo_score;
END;
$$ LANGUAGE plpgsql;