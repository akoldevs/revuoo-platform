-- This migration creates a powerful database function to calculate all the key
-- financial metrics needed for the main Revenue & Billing dashboard.
-- ✅ UPDATED: It now correctly handles both monthly and annual pricing.

-- Step 1: Add a billing interval to our subscriptions table to track M/Y plans.
-- We also add a custom type for this to ensure data consistency.
CREATE TYPE public.subscription_interval AS ENUM ('month', 'year');
ALTER TABLE public.subscriptions ADD COLUMN billing_interval public.subscription_interval NOT NULL DEFAULT 'month';


-- Step 2: Drop the old, simple pricing function.
DROP FUNCTION IF EXISTS get_plan_amount(text);

-- Step 3: Create a new, smarter pricing function that understands billing intervals.
-- ✅ FIXED: Renamed the 'interval' parameter to 'p_interval' to avoid using a reserved keyword.
CREATE OR REPLACE FUNCTION get_plan_monthly_amount(plan_name text, p_interval public.subscription_interval)
RETURNS numeric AS $$
BEGIN
    CASE
        WHEN plan_name = 'Pro' AND p_interval = 'month' THEN RETURN 49.00;
        WHEN plan_name = 'Pro' AND p_interval = 'year' THEN RETURN 39.00;
        WHEN plan_name = 'Advanced' AND p_interval = 'month' THEN RETURN 99.00;
        WHEN plan_name = 'Advanced' AND p_interval = 'year' THEN RETURN 79.00;
        -- Enterprise is custom, so we won't include it in simple MRR calculations
        ELSE RETURN 0.00;
    END CASE;
END;
$$ LANGUAGE plpgsql;


-- Step 4: Drop the old stats function.
DROP FUNCTION IF EXISTS public.get_admin_billing_dashboard_stats();

-- Step 5: Create the main function to get all billing stats, now using the new logic.
CREATE OR REPLACE FUNCTION public.get_admin_billing_dashboard_stats()
RETURNS TABLE (
    mrr numeric,
    active_subscriptions_count bigint,
    recent_activity jsonb
)
LANGUAGE sql
SECURITY DEFINER
AS $$
WITH monthly_stats AS (
    -- First, calculate the core metrics like MRR and Active Subscriptions
    SELECT
        -- ✅ UPDATED: The MRR calculation is now accurate.
        SUM(get_plan_monthly_amount(s.plan_name, s.billing_interval)) AS mrr,
        COUNT(*) FILTER (WHERE s.status = 'active' OR s.status = 'trialing') AS active_subscriptions_count
    FROM
        public.subscriptions s
    WHERE
        s.status = 'active' OR s.status = 'trialing'
),
recent_activity_list AS (
    -- Second, get the 5 most recent subscription events
    SELECT
        s.id,
        b.name as business_name,
        s.plan_name,
        s.billing_interval,
        s.status,
        -- We show the actual charge amount based on the interval for this list
        get_plan_monthly_amount(s.plan_name, s.billing_interval) as amount,
        s.created_at
    FROM
        public.subscriptions s
    JOIN
        public.businesses b ON s.business_id = b.id
    ORDER BY
        s.created_at DESC
    LIMIT 5
)
-- Finally, combine all the data into a single row to return to the application
SELECT
    ms.mrr,
    ms.active_subscriptions_count,
    (SELECT jsonb_agg(ral) FROM recent_activity_list ral) as recent_activity
FROM
    monthly_stats ms;
$$;
