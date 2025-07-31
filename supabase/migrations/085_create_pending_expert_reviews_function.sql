-- migration: 085_create_pending_expert_reviews_function.sql

-- This function fetches all expert reviews with a 'pending_approval' status
-- and formats them to be easily displayed in the admin moderation queue.
CREATE OR REPLACE FUNCTION public.get_pending_expert_reviews()
RETURNS TABLE (
    id UUID,
    title TEXT,
    summary TEXT,
    created_at TIMESTAMPTZ,
    status TEXT,
    -- We'll return the business and profile info as nested JSON objects
    -- to match the structure of the existing admin page query.
    businesses JSON,
    profiles JSON
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        er.id,
        er.title,
        er.summary,
        er.created_at,
        er.status,
        -- Create a JSON object for the business name
        json_build_object('name', b.name) AS businesses,
        -- Create a JSON object for the contributor's full name
        json_build_object('full_name', p.full_name) AS profiles
    FROM
        public.expert_reviews er
    -- Join to get the contributor's profile information
    JOIN
        public.profiles p ON er.contributor_id = p.id
    -- Join through assignments to get the business information
    JOIN
        public.assignments a ON er.assignment_id = a.id
    -- This JOIN will now work correctly
    JOIN
        public.businesses b ON a.business_id = b.id
    WHERE
        er.status = 'pending_approval'
    ORDER BY
        er.created_at ASC;
END;
$$;


-- Grant execution rights for the new function to authenticated users
GRANT EXECUTE ON FUNCTION public.get_pending_expert_reviews() TO authenticated;
