-- migration: 084_create_payouts_page_function.sql

-- This function gathers all data needed for the contributor's Payouts page in one call.
CREATE OR REPLACE FUNCTION public.get_my_payouts_page_data()
-- It returns a single JSON object for maximum efficiency.
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_stripe_account_id TEXT;
    v_pending_amount INT;
    v_paid_amount INT;
    v_payout_history JSON;
BEGIN
    -- Get the contributor's Stripe ID
    SELECT stripe_account_id INTO v_stripe_account_id
    FROM public.contributors
    WHERE id = v_user_id;

    -- ✅ FIX: Calculate pending amount using the 'pending' status.
    -- This is what's "Available for Payout".
    SELECT COALESCE(SUM(amount), 0) INTO v_pending_amount
    FROM public.content_payments
    WHERE contributor_id = v_user_id AND status = 'pending';

    -- Calculate the lifetime total of all 'paid' transactions.
    SELECT COALESCE(SUM(amount), 0) INTO v_paid_amount
    FROM public.content_payments
    WHERE contributor_id = v_user_id AND status = 'paid';

    -- Get the detailed history of all 'paid' transactions.
    SELECT COALESCE(json_agg(
        json_build_object(
            'id', cp.id,
            'amount', cp.amount,
            'payout_date', cp.payout_date,
            'created_at', cp.created_at,
            'description', 'Payout for approved content' -- A generic description
        ) ORDER BY cp.payout_date DESC
    ), '[]'::json) INTO v_payout_history
    FROM public.content_payments cp
    WHERE cp.contributor_id = v_user_id AND cp.status = 'paid';

    -- Combine all data into a single JSON response.
    RETURN json_build_object(
        'is_stripe_connected', v_stripe_account_id IS NOT NULL,
        'pending_amount', v_pending_amount,
        'lifetime_paid_amount', v_paid_amount,
        'payout_history', v_payout_history
    );
END;
$$;

-- Grant execution rights for the new function
GRANT EXECUTE ON FUNCTION public.get_my_payouts_page_data() TO authenticated;
