-- This script adds the necessary column to track discount usage.
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS applied_discount_id uuid
CONSTRAINT subscriptions_applied_discount_id_fkey REFERENCES public.discounts(id) ON DELETE SET NULL;

-- This script retrieves all discounts along with their redemption counts.
-- This function gets all discounts and counts their current redemptions.
CREATE OR REPLACE FUNCTION public.get_all_discounts_with_redemption_counts()
RETURNS TABLE (
    id uuid,
    code text,
    discount_type public.discount_type,
    value numeric,
    is_active boolean,
    expires_at timestamptz,
    max_redemptions integer,
    plan_ids uuid[],
    created_at timestamptz,
    redemption_count bigint
)
LANGUAGE sql
AS $$
    SELECT
        d.id,
        d.code,
        d.discount_type,
        d.value,
        d.is_active,
        d.expires_at,
        d.max_redemptions,
        d.plan_ids,
        d.created_at,
        -- Count the number of subscriptions that have used this discount code
        (SELECT COUNT(*) FROM public.subscriptions s WHERE s.applied_discount_id = d.id) as redemption_count
    FROM
        public.discounts d
    ORDER BY
        d.created_at DESC;
$$;