-- This script safely adds the 'converted' value to your existing status list
-- and then creates the leaderboard function.

-- Step 1: Add 'converted' to the invitation_status enum if it doesn't already exist.
-- This script safely adds the 'converted' value to your existing status list.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'invitation_status'::regtype AND enumlabel = 'converted') THEN
        ALTER TYPE public.invitation_status ADD VALUE 'converted';
    END IF;
END$$;

-- Step 2: Create the leaderboard function.
-- This script creates the leaderboard function, which can now safely use the 'converted' status.
CREATE OR REPLACE FUNCTION public.get_invitation_leaderboard()
RETURNS TABLE (
    business_id bigint,
    business_name text,
    converted_reviews_count bigint
)
LANGUAGE sql
AS $$
    SELECT
        inv.business_id,
        b.name as business_name,
        COUNT(*) AS converted_reviews_count
    FROM
        public.review_invitations inv
    JOIN
        public.businesses b ON inv.business_id = b.id
    WHERE
        inv.status = 'converted'
    GROUP BY
        inv.business_id, b.name
    ORDER BY
        converted_reviews_count DESC
    LIMIT 10;
$$;