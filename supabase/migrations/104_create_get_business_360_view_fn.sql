-- This migration creates a powerful database function that acts as the
-- data engine for our "Business 360° View". It takes a business ID
-- and returns a single row containing all the key stats and recent
-- reviews needed for the intelligence briefing page.

CREATE OR REPLACE FUNCTION public.get_business_360_view(p_business_id bigint)
RETURNS TABLE (
    id bigint,
    name text,
    website_url text,
    is_verified boolean,
    created_at timestamptz,
    total_reviews bigint,
    average_rating numeric,
    recent_reviews jsonb -- We will package recent reviews into a JSON array
)
LANGUAGE sql
SECURITY DEFINER
AS $$
WITH review_stats AS (
    -- First, calculate the core statistics for the given business
    SELECT
        business_id,
        COUNT(*) AS total_reviews,
        AVG(overall_rating) AS average_rating
    FROM public.reviews
    WHERE business_id = p_business_id
    GROUP BY business_id
),
latest_reviews AS (
    -- Second, get the 5 most recent user reviews for this business
    SELECT
        r.id,
        r.title,
        r.summary,
        r.overall_rating,
        r.created_at,
        p.full_name AS author_name,
        'user' as review_type
    FROM public.reviews r
    LEFT JOIN public.profiles p ON r.author_id = p.id
    WHERE r.business_id = p_business_id AND r.status = 'approved'
    ORDER BY r.created_at DESC
    LIMIT 5
)
-- Finally, join the business info with the calculated stats and recent reviews
SELECT
    b.id,
    b.name,
    b.website_url,
    b.is_verified,
    b.created_at,
    COALESCE(rs.total_reviews, 0) as total_reviews,
    COALESCE(rs.average_rating, 0) as average_rating,
    -- This command aggregates all rows from latest_reviews into a single JSON array
    (SELECT jsonb_agg(lr) FROM latest_reviews lr) as recent_reviews
FROM
    public.businesses b
LEFT JOIN
    review_stats rs ON b.id = rs.business_id
WHERE
    b.id = p_business_id;
$$;
