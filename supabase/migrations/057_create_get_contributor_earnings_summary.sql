-- 057_create_get_contributor_earnings_summary.sql

CREATE OR REPLACE FUNCTION get_contributor_earnings_summary()
RETURNS TABLE(
    current_balance INT,
    pending_balance INT,
    lifetime_earnings INT,
    next_payout_date TIMESTAMPTZ
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        -- Current Balance: Total of all 'paid' but not yet withdrawn (simplified for now)
        COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0)::INT as current_balance,
        
        -- Pending Balance: Total of all payments still in 'pending' status
        COALESCE(SUM(amount) FILTER (WHERE status = 'pending'), 0)::INT as pending_balance,

        -- Lifetime Earnings: Total of all 'paid' payments
        COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0)::INT as lifetime_earnings,

        -- Next Payout Date: Placeholder logic, e.g., the 1st of next month
        (date_trunc('month', now()) + interval '1 month')::TIMESTAMPTZ as next_payout_date
        
    FROM public.content_payments
    WHERE contributor_id = auth.uid();
END;
$$ LANGUAGE plpgsql;