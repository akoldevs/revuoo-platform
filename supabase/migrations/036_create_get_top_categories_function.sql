-- 036_create_get_top_categories_function.sql

CREATE OR REPLACE FUNCTION get_top_categories(limit_count INT)
RETURNS TABLE(
    id UUID,
    name TEXT,
    slug TEXT,
    icon_svg TEXT,
    business_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.name,
        c.slug,
        c.icon_svg,
        COUNT(b.id) as business_count
    FROM
        categories c
    LEFT JOIN
        businesses b ON c.id = b.category_id
    WHERE
        c.parent_id IS NULL
    GROUP BY
        c.id
    ORDER BY
        business_count DESC, c.name ASC
    LIMIT
        limit_count;
END;
$$ LANGUAGE plpgsql;