-- This migration upgrades our Business 360° View function to be much more
-- powerful, including subscription data and a list of expert reviews.

-- First, drop the old function so we can replace it.
DROP FUNCTION IF EXISTS public.get_business_360_view(bigint);

-- Create the new, enhanced version.
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
    -- ✅ NEW FIELDS FOR A+++ ENHANCEMENT
    subscription_plan text,
    subscription_status public.subscription_status,
    expert_reviews jsonb
)
LANGUAGE sql
SECURITY DEFINER
AS $$
WITH review_stats AS (
    -- This part remains the same
    SELECT
        business_id,
        COUNT(*) AS total_reviews,
        AVG(overall_rating) AS average_rating
    FROM public.reviews
    WHERE business_id = p_business_id
    GROUP BY business_id
),
latest_user_reviews AS (
    -- This part remains the same
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
-- ✅ NEW: A subquery to get the 5 most recent expert reviews
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
    -- ✅ NEW: Select the subscription info and expert reviews
    s.plan_name as subscription_plan,
    s.status as subscription_status,
    (SELECT jsonb_agg(ler) FROM latest_expert_reviews ler) as expert_reviews
FROM
    public.businesses b
LEFT JOIN review_stats rs ON b.id = rs.business_id
LEFT JOIN public.subscriptions s ON b.id = s.business_id -- Join with the new subscriptions table
WHERE
    b.id = p_business_id;
$$;
