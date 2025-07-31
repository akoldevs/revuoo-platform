-- This migration fixes a critical bug that allowed multiple subscriptions
-- for a single business. It cleans up any existing duplicate data and then
-- adds a unique constraint to prevent it from ever happening again.

-- Step 1: Clean up any existing duplicate subscriptions.
-- This code identifies businesses with more than one subscription and keeps
-- only the most recently created one, deleting all others.
DELETE FROM public.subscriptions s1
USING public.subscriptions s2
WHERE
    s1.id < s2.id
    AND s1.business_id = s2.business_id;

-- Step 2: Add the unique constraint to the business_id column.
-- This enforces the rule that one business can only have one subscription row.
-- The error message in our server action will now work as intended.
ALTER TABLE public.subscriptions
ADD CONSTRAINT subscriptions_business_id_unique UNIQUE (business_id);
