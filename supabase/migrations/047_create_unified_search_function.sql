-- 047_create_unified_search_function.sql

CREATE OR REPLACE FUNCTION search_revuoo(search_term TEXT)
RETURNS JSONB AS $$
DECLARE
    business_results JSONB;
    category_results JSONB;
    post_results JSONB;
BEGIN
    -- Search Businesses
    SELECT jsonb_agg(t) INTO business_results FROM (
        SELECT id, name, slug, 'business' as type
        FROM businesses
        WHERE name ILIKE '%' || search_term || '%'
        LIMIT 3
    ) t;

    -- Search Categories
    SELECT jsonb_agg(t) INTO category_results FROM (
        SELECT id, name, slug, 'category' as type
        FROM categories
        WHERE name ILIKE '%' || search_term || '%'
        LIMIT 2
    ) t;

    -- Search Posts (Blog Guides)
    -- Note: This part requires connecting to your Sanity data or having it synced.
    -- For now, we will create a placeholder. The logic would be more complex in production.
    -- We will simulate it here. A real implementation would query Sanity via an API call.
    -- This placeholder will be empty for now.
    post_results := '[]'::jsonb;
    
    RETURN jsonb_build_object(
        'businesses', COALESCE(business_results, '[]'::jsonb),
        'categories', COALESCE(category_results, '[]'::jsonb),
        'posts', post_results
    );
END;
$$ LANGUAGE plpgsql;