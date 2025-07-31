-- 069_create_review_invitations_table.sql

CREATE TYPE invitation_status AS ENUM ('generated', 'sent', 'clicked', 'completed');

CREATE TABLE public.review_invitations (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    business_id BIGINT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    invitation_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    status invitation_status NOT NULL DEFAULT 'generated',
    customer_email TEXT, -- Optional, for if we send email directly later
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.review_invitations IS 'Stores unique, trackable links for businesses to invite customers to leave reviews.';

-- Enable RLS
ALTER TABLE public.review_invitations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Business owners can manage their own invitations"
ON public.review_invitations
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM businesses 
        WHERE id = review_invitations.business_id AND owner_id = auth.uid()
    )
);