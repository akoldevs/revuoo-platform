-- 048_create_get_user_activity_stats.sql

CREATE OR REPLACE FUNCTION get_user_activity_stats()
RETURNS TABLE(
    reviews_written BIGINT,
    helpful_votes_received BIGINT,
    comments_made BIGINT,
    guides_bookmarked BIGINT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        -- Count all reviews written by the current user
        (SELECT COUNT(*) FROM public.reviews WHERE author_id = auth.uid()) as reviews_written,
        
        -- Sum all upvotes from all reviews written by the current user
        (SELECT COALESCE(SUM(upvote_count), 0) FROM public.reviews WHERE author_id = auth.uid()) as helpful_votes_received,

        -- Placeholder: We will implement comments later
        0::BIGINT as comments_made,

        -- Placeholder: We will implement guide bookmarks later
        0::BIGINT as guides_bookmarked;
END;
$$ LANGUAGE plpgsql;