-- 040_create_get_all_categories_hierarchical.sql

CREATE OR REPLACE FUNCTION get_all_categories_hierarchical()
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_agg(parent)
    INTO result
    FROM (
        SELECT
            p.id,
            p.name,
            p.slug,
            (
                SELECT json_agg(child)
                FROM (
                    SELECT
                        c.id,
                        c.name,
                        c.slug
                    FROM public.categories c
                    WHERE c.parent_id = p.id
                    ORDER BY c.name
                ) child
            ) as children
        FROM public.categories p
        WHERE p.parent_id IS NULL
        ORDER BY p.name
    ) parent;

    RETURN result;
END;
$$ LANGUAGE plpgsql;