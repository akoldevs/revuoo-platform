-- This migration updates the function that fetches a contributor's submitted work.
-- It first DROPS the old version of the function and then CREATES the new one
-- with the 'moderator_notes' column added to the return data.

-- Step 1: Drop the old function. It's safe to run this.
DROP FUNCTION IF EXISTS public.get_my_submitted_content();

-- Step 2: Create the new, updated version of the function.
CREATE OR REPLACE FUNCTION public.get_my_submitted_content()
RETURNS TABLE (
    id uuid,
    review_title text,
    submitted_at timestamptz,
    status text,
    assignment_title text,
    moderator_notes text -- ✅ ADDED: The new field for feedback.
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT
        er.id,
        er.title AS review_title,
        er.created_at AS submitted_at,
        er.status,
        a.title AS assignment_title,
        er.moderator_notes -- ✅ ADDED: Selecting the moderator_notes column.
    FROM
        public.expert_reviews AS er
    JOIN
        public.assignments AS a ON er.assignment_id = a.id
    WHERE
        er.contributor_id = auth.uid()
    ORDER BY
        er.created_at DESC;
$$;
