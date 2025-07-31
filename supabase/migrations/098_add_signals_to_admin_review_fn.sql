-- This migration upgrades the function that fetches pending reviews for the admin.
-- It adds critical "context signals" like contributor stats and business verification status,
-- turning the moderation queue into a more intelligent tool.

-- Step 1: Drop the old function so we can recreate it with a new structure.
DROP FUNCTION IF EXISTS public.get_pending_reviews_for_admin();

-- Step 2: Create the new, more powerful version of the function.
CREATE OR REPLACE FUNCTION public.get_pending_reviews_for_admin()
RETURNS TABLE (
    id uuid,
    review_type text,
    title text,
    summary text,
    created_at timestamptz,
    business_name text,
    author_name text,
    -- ✅ NEW SIGNALS ADDED:
    business_is_verified boolean,
    contributor_id uuid,
    contributor_total_reviews bigint,
    contributor_approved_reviews bigint
)
LANGUAGE sql
SECURITY DEFINER
AS $$
WITH contributor_stats AS (
    -- First, we create a temporary calculation of stats for every contributor.
    SELECT
        er.contributor_id,
        count(*) AS total_reviews,
        count(*) FILTER (WHERE er.status = 'approved') AS approved_reviews
    FROM
        public.expert_reviews er
    GROUP BY
        er.contributor_id
)
-- Now, we join everything together.
SELECT
    er.id,
    'expert' AS review_type,
    er.title,
    er.summary,
    er.created_at,
    b.name AS business_name,
    p.full_name AS author_name,
    -- ✅ NEW SIGNALS SELECTED:
    b.is_verified AS business_is_verified,
    er.contributor_id,
    COALESCE(cs.total_reviews, 0) AS contributor_total_reviews,
    COALESCE(cs.approved_reviews, 0) AS contributor_approved_reviews
FROM
    public.expert_reviews AS er
JOIN
    public.assignments AS a ON er.assignment_id = a.id
JOIN
    public.businesses AS b ON a.business_id = b.id
JOIN
    public.profiles AS p ON er.contributor_id = p.id
LEFT JOIN -- We use a LEFT JOIN in case a contributor has no stats yet.
    contributor_stats AS cs ON er.contributor_id = cs.contributor_id
WHERE
    er.status = 'pending_approval';
$$;
