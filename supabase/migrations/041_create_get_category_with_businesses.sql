-- 041_create_get_category_with_businesses.sql

CREATE OR REPLACE FUNCTION get_category_with_businesses(category_slug TEXT)
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'id', cat.id,
        'name', cat.name,
        'description', cat.description,
        'businesses', (
            SELECT json_agg(biz)
            FROM (
                SELECT
                    b.id,
                    b.name,
                    b.slug,
                    b.description,
                    b.revuoo_score
                FROM public.businesses b
                WHERE b.category_id = cat.id
                ORDER BY b.revuoo_score DESC NULLS LAST
            ) biz
        )
    )
    INTO result
    FROM public.categories cat
    WHERE cat.slug = category_slug;

    RETURN result;
END;
$$ LANGUAGE plpgsql;