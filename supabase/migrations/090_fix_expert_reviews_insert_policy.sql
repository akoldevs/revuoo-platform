-- This migration fixes the security policy for inserting new expert reviews.
-- It ensures that a contributor can only submit a review for themselves.

-- Step 1: Drop the old, insecure INSERT policy if it exists.
-- It's safe to run this even if the policy doesn't exist.
DROP POLICY IF EXISTS "Contributors can insert their own reviews" ON public.expert_reviews;

-- Step 2: Create the new, correct INSERT policy.
-- This policy allows a user to insert a new expert review only if:
-- 1. They are authenticated.
-- 2. The contributor_id of the new review matches their own user ID.
CREATE POLICY "Contributors can insert their own reviews"
ON public.expert_reviews
FOR INSERT
TO authenticated
WITH CHECK (
  contributor_id = auth.uid()
);
