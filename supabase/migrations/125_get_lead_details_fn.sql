-- This script corrects the column name in our lead details function.
CREATE OR REPLACE FUNCTION public.get_lead_details(p_lead_id bigint)
RETURNS TABLE (
    lead_id bigint,
    profile_id uuid,
    full_name text,
    email text,
    status public.lead_status,
    source text,
    notes text,
    created_at timestamptz,
    profile_created_at timestamptz
)
LANGUAGE sql
AS $$
    SELECT
        l.id as lead_id,
        l.profile_id,
        p.full_name,
        public.get_user_email_by_id(l.profile_id) as email,
        l.status,
        l.source,
        l.notes,
        l.created_at,
        -- ✅ FIX: Fetching the creation date from the correct 'auth.users' table
        u.created_at as profile_created_at
    FROM
        public.leads l
    JOIN
        public.profiles p ON l.profile_id = p.id
    JOIN
        auth.users u ON l.profile_id = u.id
    WHERE
        l.id = p_lead_id;
$$;