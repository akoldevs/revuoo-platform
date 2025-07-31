-- migration: 121_create_review_invitations.sql
-- This script creates the 'review_invitations' table if it doesn't exist
-- and a function to calculate platform-wide analytics.

-- Step 1: Create a status type for invitations
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invitation_status') THEN
        CREATE TYPE public.invitation_status AS ENUM ('pending', 'sent', 'clicked', 'converted');
    END IF;
END$$;

-- Step 2: Create the table to store all review invitations
CREATE TABLE IF NOT EXISTS public.review_invitations (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    business_id bigint NOT NULL,
    customer_email text NOT NULL,
    status public.invitation_status NOT NULL DEFAULT 'pending',
    created_at timestamptz NOT NULL DEFAULT now(),
    sent_at timestamptz,
    opened_at timestamptz,
    clicked_at timestamptz,
    converted_at timestamptz,
    CONSTRAINT review_invitations_pkey PRIMARY KEY (id),
    CONSTRAINT review_invitations_business_id_fkey FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Step 3: Create the analytics function
CREATE OR REPLACE FUNCTION public.get_invitation_analytics_for_admin()
RETURNS TABLE (
    total_sent bigint,
    open_rate numeric,
    click_rate numeric,
    conversion_rate numeric
)
LANGUAGE sql
AS $$
    SELECT
        COUNT(sent_at) AS total_sent,
        -- Calculate Open Rate: (opened / sent) * 100
        (COUNT(opened_at)::numeric / NULLIF(COUNT(sent_at), 0) * 100) AS open_rate,
        -- Calculate Click Rate: (clicked / opened) * 100
        (COUNT(clicked_at)::numeric / NULLIF(COUNT(opened_at), 0) * 100) AS click_rate,
        -- Calculate Conversion Rate: (converted / clicked) * 100
        (COUNT(converted_at)::numeric / NULLIF(COUNT(clicked_at), 0) * 100) AS conversion_rate
    FROM public.review_invitations;
$$;