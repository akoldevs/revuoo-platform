-- This migration fixes a bug in our Business 360° View function.
-- The previous version could return multiple rows if a business had more than
-- one subscription record. This version ensures it only ever returns one row
-- by selecting only the most recent subscription.

-- First, we drop the old function.
DROP FUNCTION IF EXISTS public.get_business_360_view(bigint);

-- Create the new, corrected version.
CREATE OR REPLACE FUNCTION public.get_business_360_view(p_business_id bigint)
RETURNS TABLE (
    id bigint,
    name text,
    website_url text,
    is_verified boolean,
    created_at timestamptz,
    total_reviews bigint,
    average_rating numeric,
    recent_user_reviews jsonb,
    subscription_plan text,
    subscription_status public.subscription_status,
    expert_reviews jsonb
)
LANGUAGE sql
SECURITY DEFINER
AS $$
WITH review_stats AS (
    SELECT
        business_id,
        COUNT(*) AS total_reviews,
        AVG(overall_rating) AS average_rating
    FROM public.reviews
    WHERE business_id = p_business_id
    GROUP BY business_id
),
latest_user_reviews AS (
    SELECT
        r.id,
        r.title,
        r.summary,
        r.overall_rating,
        r.created_at,
        p.full_name AS author_name
    FROM public.reviews r
    LEFT JOIN public.profiles p ON r.author_id = p.id
    WHERE r.business_id = p_business_id AND r.status = 'approved'
    ORDER BY r.created_at DESC
    LIMIT 5
),
latest_expert_reviews AS (
    SELECT
        er.id,
        er.title,
        er.summary,
        er.rating_overall,
        er.published_at as created_at,
        p.full_name as author_name
    FROM public.expert_reviews er
    JOIN public.assignments a ON er.assignment_id = a.id
    JOIN public.profiles p ON er.contributor_id = p.id
    WHERE a.business_id = p_business_id AND er.status = 'approved'
    ORDER BY er.published_at DESC
    LIMIT 5
),
-- ✅ NEW: A subquery to get ONLY the most recent subscription.
latest_subscription AS (
    SELECT
        s.plan_name,
        s.status
    FROM public.subscriptions s
    WHERE s.business_id = p_business_id
    ORDER BY s.created_at DESC
    LIMIT 1
)
-- Finally, join all the information together
SELECT
    b.id,
    b.name,
    b.website_url,
    b.is_verified,
    b.created_at,
    COALESCE(rs.total_reviews, 0) as total_reviews,
    COALESCE(rs.average_rating, 0) as average_rating,
    (SELECT jsonb_agg(lur) FROM latest_user_reviews lur) as recent_user_reviews,
    -- ✅ FIXED: Select from our new subquery to guarantee a single result.
    ls.plan_name as subscription_plan,
    ls.status as subscription_status,
    (SELECT jsonb_agg(ler) FROM latest_expert_reviews ler) as expert_reviews
FROM
    public.businesses b
LEFT JOIN review_stats rs ON b.id = rs.business_id
LEFT JOIN latest_subscription ls ON true -- This join is safe as latest_subscription returns 0 or 1 row
WHERE
    b.id = p_business_id;
$$;
