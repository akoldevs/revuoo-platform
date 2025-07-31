-- 069_create_claim_business_function.sql

CREATE OR REPLACE FUNCTION claim_business_for_user(p_business_id BIGINT)
RETURNS void AS $$
DECLARE
    v_user_id UUID := auth.uid();
BEGIN
    -- Step 1: Update the businesses table to set the owner
    -- The WHERE clause ensures it only works if the business is unclaimed.
    UPDATE public.businesses
    SET owner_id = v_user_id
    WHERE id = p_business_id AND owner_id IS NULL;

    -- If no row was updated (meaning it was already claimed), raise an error.
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Business already claimed or does not exist.';
    END IF;

    -- Step 2: Add the 'business' role to the user's profile
    -- This calls the other helper function we already created.
    PERFORM add_role_to_user(v_user_id, 'business');

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;