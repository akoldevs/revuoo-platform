-- migration: 078_create_credibility_hub_functions.sql

-- Function 1: Get all badges a specific contributor has earned.
CREATE OR REPLACE FUNCTION public.get_my_earned_badges()
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    icon_svg TEXT,
    earned_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        b.id,
        b.name,
        b.description,
        b.icon_svg,
        cb.earned_at
    FROM
        public.contributor_badges cb
    JOIN
        public.badges b ON cb.badge_id = b.id
    WHERE
        cb.contributor_id = auth.uid()
    ORDER BY
        cb.earned_at DESC;
END;
$$;

-- Function 2: Get a contributor's key performance statistics.
CREATE OR REPLACE FUNCTION public.get_my_credibility_stats()
RETURNS TABLE (
    total_approved_reviews BIGINT,
    total_views BIGINT,
    reviews_per_category JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH approved_reviews AS (
        SELECT er.id, er.view_count, c.slug as category_slug
        FROM public.expert_reviews er
        LEFT JOIN public.assignment_categories ac ON er.assignment_id = ac.assignment_id
        LEFT JOIN public.categories c ON ac.category_id = c.id
        WHERE er.contributor_id = auth.uid() AND er.status = 'approved'
    )
    SELECT
        (SELECT COUNT(*) FROM approved_reviews) AS total_approved_reviews,
        (SELECT COALESCE(SUM(ar.view_count), 0) FROM approved_reviews ar) AS total_views,
        (
            SELECT jsonb_object_agg(category_slug, count)
            FROM (
                SELECT category_slug, COUNT(*) as count
                FROM approved_reviews
                WHERE category_slug IS NOT NULL
                GROUP BY category_slug
            ) as category_counts
        ) AS reviews_per_category;
END;
$$;


-- Grant execution rights to authenticated users for both functions
GRANT EXECUTE ON FUNCTION public.get_my_earned_badges() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_credibility_stats() TO authenticated;
