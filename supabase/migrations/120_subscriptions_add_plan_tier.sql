-- This migration makes our subscriptions "plan-aware" by adding a machine-readable tier.

-- Step 1: Create a new custom type for the plan tiers for data consistency.
CREATE TYPE public.plan_tier AS ENUM (
    'free',
    'pro',
    'advanced',
    'enterprise'
);

-- Step 2: Add the new 'plan_tier' column to the subscriptions table.
ALTER TABLE public.subscriptions
ADD COLUMN plan_tier public.plan_tier;

-- Step 3: Automatically populate the new 'plan_tier' for existing subscriptions
-- based on their current plan_name. This ensures no data is lost.
UPDATE public.subscriptions
SET plan_tier =
    CASE
        WHEN lower(plan_name) = 'free' THEN 'free'::public.plan_tier
        WHEN lower(plan_name) = 'pro' THEN 'pro'::public.plan_tier
        WHEN lower(plan_name) = 'advanced' THEN 'advanced'::public.plan_tier
        WHEN lower(plan_name) = 'enterprise' THEN 'enterprise'::public.plan_tier
        ELSE NULL
    END;

-- Step 4: Make the new column required for all future subscriptions.
ALTER TABLE public.subscriptions
ALTER COLUMN plan_tier SET NOT NULL;


-- Step 5: Create a helper function to easily check a business's subscription tier.
-- This makes our application code much cleaner and more secure.
CREATE OR REPLACE FUNCTION public.get_business_plan_tier(p_business_id bigint)
RETURNS public.plan_tier
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT s.plan_tier
    FROM public.subscriptions s
    WHERE s.business_id = p_business_id
    AND s.status IN ('active', 'trialing');
$$;