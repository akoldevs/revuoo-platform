-- 070_create_get_business_from_invitation_token.sql

CREATE OR REPLACE FUNCTION get_business_from_invitation_token(p_token UUID)
RETURNS TABLE (
    id BIGINT,
    name TEXT,
    slug TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        b.id,
        b.name,
        b.slug
    FROM public.businesses b
    JOIN public.review_invitations ri ON b.id = ri.business_id
    WHERE ri.invitation_token = p_token
    AND ri.status = 'generated'; -- We only want to allow reviews from fresh, unused links
END;
$$ LANGUAGE plpgsql;