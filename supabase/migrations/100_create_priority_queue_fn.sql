-- This migration creates a new, highly intelligent database function that
-- calculates a "priority_score" for every pending review, unifying both
-- expert and user reviews into a single, pre-sorted feed for the admin dashboard.

-- Step 1: Drop the old function so we can replace it.
DROP FUNCTION IF EXISTS public.get_pending_reviews_for_admin();

-- Step 2: Create the new, powerful version of the function.
CREATE OR REPLACE FUNCTION public.get_pending_reviews_for_admin()
RETURNS TABLE (
    id text, -- Using text to accommodate both uuid and bigint
    review_type text,
    title text,
    summary text,
    created_at timestamptz,
    business_name text,
    author_name text,
    business_is_verified boolean,
    contributor_total_reviews bigint,
    contributor_approved_reviews bigint,
    priority_score numeric -- ✅ NEW: The calculated priority score
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
        -- Priority Score Calculation for Experts:
        10 + -- Base score
        (CASE WHEN (SELECT count(*) FROM public.expert_reviews WHERE contributor_id = er.contributor_id AND status = 'approved') = 0 THEN 100 ELSE 0 END) + -- New contributor bonus
        (CASE WHEN b.is_verified = false THEN 10 ELSE 0 END) -- Unverified business bonus
        AS priority_score
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
        0 AS contributor_total_reviews, -- N/A for users
        0 AS contributor_approved_reviews, -- N/A for users
        -- Priority Score Calculation for Users:
        10 + -- Base score
        (CASE WHEN ai.safety_rating = 'FLAGGED' THEN 1000 ELSE 0 END) + -- AI FLAGGED bonus
        (CASE WHEN b.is_verified = false THEN 10 ELSE 0 END) -- Unverified business bonus
        AS priority_score
    FROM
        public.reviews r
    JOIN public.businesses b ON r.business_id = b.id
    -- ✅ FINAL FIX: The correct column name is author_id
    LEFT JOIN public.profiles p ON r.author_id = p.id
    LEFT JOIN public.review_ai_analysis ai ON r.id = ai.review_id
    WHERE r.status = 'pending'
)
-- Finally, combine both sets of reviews into one list
SELECT * FROM expert_reviews_pending
UNION ALL
SELECT * FROM user_reviews_pending;
$$;
