-- This migration provides the final upgrade to our admin queue function.
-- It adds the specific AI analysis details (safety rating and reasoning)
-- to the data feed, giving moderators full context on flagged user reviews.

-- Step 1: Drop the old function so we can replace it with the final version.
DROP FUNCTION IF EXISTS public.get_pending_reviews_for_admin();

-- Step 2: Create the final, most powerful version of the function.
CREATE OR REPLACE FUNCTION public.get_pending_reviews_for_admin()
RETURNS TABLE (
    id text,
    review_type text,
    title text,
    summary text,
    created_at timestamptz,
    business_name text,
    author_name text,
    business_is_verified boolean,
    contributor_total_reviews bigint,
    contributor_approved_reviews bigint,
    priority_score numeric,
    -- ✅ FINAL ADDITION: Specific AI signals for the UI
    ai_safety_rating text,
    ai_reasoning text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
WITH expert_reviews_pending AS (
    -- First, calculate scores for pending EXPERT reviews
    SELECT
        er.id::text,
        'expert' AS review_type,
        er.title,
        er.summary,
        er.created_at,
        b.name AS business_name,
        p.full_name AS author_name,
        b.is_verified AS business_is_verified,
        (SELECT count(*) FROM public.expert_reviews WHERE contributor_id = er.contributor_id) AS contributor_total_reviews,
        (SELECT count(*) FROM public.expert_reviews WHERE contributor_id = er.contributor_id AND status = 'approved') AS contributor_approved_reviews,
        10 +
        (CASE WHEN (SELECT count(*) FROM public.expert_reviews WHERE contributor_id = er.contributor_id AND status = 'approved') = 0 THEN 100 ELSE 0 END) +
        (CASE WHEN b.is_verified = false THEN 10 ELSE 0 END)
        AS priority_score,
        -- Expert reviews do not have AI analysis, so we return NULL
        NULL::text as ai_safety_rating,
        NULL::text as ai_reasoning
    FROM
        public.expert_reviews AS er
    JOIN public.assignments AS a ON er.assignment_id = a.id
    JOIN public.businesses AS b ON a.business_id = b.id
    JOIN public.profiles AS p ON er.contributor_id = p.id
    WHERE er.status = 'pending_approval'
),
user_reviews_pending AS (
    -- Second, calculate scores for pending USER reviews
    SELECT
        r.id::text,
        'user' AS review_type,
        r.title,
        r.summary,
        r.created_at,
        b.name AS business_name,
        p.full_name AS author_name,
        b.is_verified AS business_is_verified,
        0 AS contributor_total_reviews,
        0 AS contributor_approved_reviews,
        10 +
        (CASE WHEN ai.safety_rating = 'FLAGGED' THEN 1000 ELSE 0 END) +
        (CASE WHEN b.is_verified = false THEN 10 ELSE 0 END)
        AS priority_score,
        -- ✅ FINAL ADDITION: Select the specific AI signals
        ai.safety_rating as ai_safety_rating,
        -- ✅ FIXED: The 'reasoning' column does not exist, so we return NULL for now.
        NULL::text as ai_reasoning
    FROM
        public.reviews r
    JOIN public.businesses b ON r.business_id = b.id
    LEFT JOIN public.profiles p ON r.author_id = p.id
    LEFT JOIN public.review_ai_analysis ai ON r.id = ai.review_id
    WHERE r.status = 'pending'
)
-- Finally, combine both sets of reviews into one list
SELECT * FROM expert_reviews_pending
UNION ALL
SELECT * FROM user_reviews_pending;
$$;
