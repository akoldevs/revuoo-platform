-- migration: 075_create_get_contributor_content_function.sql

-- Drop the old function if it exists, to ensure a clean slate.
DROP FUNCTION IF EXISTS public.get_my_submitted_content();

-- Re-create the function using RETURNS TABLE for a more robust definition.
CREATE OR REPLACE FUNCTION public.get_my_submitted_content()
-- This defines the output columns directly, avoiding the need for a separate custom type.
RETURNS TABLE(
    id UUID,
    review_title TEXT,
    submitted_at TIMESTAMPTZ,
    status TEXT,
    assignment_title TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        er.id,
        er.title AS review_title,
        er.created_at AS submitted_at,
        er.status,
        a.title AS assignment_title
    FROM
        public.expert_reviews er
    JOIN
        public.assignments a ON er.assignment_id = a.id
    WHERE
        er.contributor_id = auth.uid()
    ORDER BY
        er.created_at DESC;
END;
$$;

-- Grant execution rights to authenticated users
GRANT EXECUTE ON FUNCTION public.get_my_submitted_content() TO authenticated;