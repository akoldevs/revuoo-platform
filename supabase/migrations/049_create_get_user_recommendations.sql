-- 049_create_get_user_recommendations.sql

CREATE OR REPLACE FUNCTION get_user_recommendations(p_user_id UUID)
RETURNS jsonb AS $$
DECLARE
    -- Find the top 2 categories the user has reviewed most frequently
    top_categories UUID[];
BEGIN
    SELECT ARRAY(
        SELECT category_id
        FROM reviews
        WHERE author_id = p_user_id AND category_id IS NOT NULL
        GROUP BY category_id
        ORDER BY COUNT(*) DESC
        LIMIT 2
    ) INTO top_categories;

    -- Return a JSON object containing recommended businesses from those categories
    RETURN (
        SELECT jsonb_build_object(
            'businesses', (
                SELECT jsonb_agg(b)
                FROM (
                    SELECT
                        id, name, slug, description, revuoo_score
                    FROM businesses
                    WHERE category_id = ANY(top_categories)
                    AND id NOT IN (SELECT business_id FROM reviews WHERE author_id = p_user_id) -- Exclude already reviewed businesses
                    ORDER BY revuoo_score DESC NULLS LAST
                    LIMIT 4
                ) b
            )
        )
    );
END;
$$ LANGUAGE plpgsql;