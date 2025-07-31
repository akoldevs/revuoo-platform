-- migration: 076_create_content_impact_score_function.sql

-- This function calculates a performance score for each of a contributor's approved reviews.
CREATE OR REPLACE FUNCTION public.get_my_content_performance()
-- It returns a table with the review details and the calculated score.
RETURNS TABLE(
    review_id UUID,
    review_title TEXT,
    view_count INT,
    helpful_votes INT,
    not_helpful_votes INT,
    impact_score NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH review_metrics AS (
        SELECT
            er.id,
            er.title,
            er.view_count,
            er.helpful_votes,
            er.not_helpful_votes
        FROM
            public.expert_reviews er
        WHERE
            er.contributor_id = auth.uid()
            AND er.status = 'approved' -- Only calculate for approved reviews
    )
    SELECT
        rm.id AS review_id,
        rm.title AS review_title,
        rm.view_count,
        rm.helpful_votes,
        rm.not_helpful_votes,
        -- This is our Impact Score formula. We can adjust the weights later.
        -- It rewards views and helpful votes, and penalizes not-helpful votes.
        -- The score is capped at 100 and floored at 0 for a clean 0-100 range.
        GREATEST(0, LEAST(100,
            (rm.view_count * 0.1) +       -- Each view is worth 0.1 points
            (rm.helpful_votes * 1.0) -     -- Each helpful vote is worth 1 full point
            (rm.not_helpful_votes * 0.5) -- Each not-helpful vote subtracts 0.5 points
        ))::NUMERIC(5, 2) AS impact_score
    FROM
        review_metrics rm
    ORDER BY
        impact_score DESC;
END;
$$;

-- Grant execution rights to authenticated users
GRANT EXECUTE ON FUNCTION public.get_my_content_performance() TO authenticated;
