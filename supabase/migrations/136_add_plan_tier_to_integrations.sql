-- This migration adds plan-gating capabilities to the Integrations module.

-- Step 1: Add the new 'minimum_plan_tier' column to the integrations table.
-- This column will store the lowest plan (e.g., 'pro') required to access an integration.
ALTER TABLE public.integrations
ADD COLUMN IF NOT EXISTS minimum_plan_tier public.plan_tier NOT NULL DEFAULT 'pro';

-- Step 2: Add a comment for clarity.
COMMENT ON COLUMN public.integrations.minimum_plan_tier IS 'The minimum subscription plan tier required to use this integration.';

-- Step 3: Set initial values for your existing integrations.
-- By default, we'll set Zapier to require 'pro' and Shopify to require 'advanced'.
UPDATE public.integrations
SET minimum_plan_tier = 'pro'
WHERE name = 'Zapier';

UPDATE public.integrations
SET minimum_plan_tier = 'advanced'
WHERE name = 'Shopify';