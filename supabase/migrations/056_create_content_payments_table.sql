-- 056_create_content_payments_table.sql

CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'paid', 'failed');

CREATE TABLE public.content_payments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    contributor_id UUID NOT NULL REFERENCES public.contributors(id),
    amount INT NOT NULL, -- Storing amount in cents to avoid floating point issues
    status payment_status NOT NULL DEFAULT 'pending',
    post_id TEXT, -- Can link to a Sanity post ID
    review_id BIGINT, -- Can link to a review ID
    payout_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT check_one_content_link CHECK (
        (post_id IS NOT NULL AND review_id IS NULL) OR (post_id IS NULL AND review_id IS NOT NULL)
    )
);

COMMENT ON TABLE public.content_payments IS 'Tracks earnings for specific pieces of content created by contributors.';
COMMENT ON COLUMN public.content_payments.amount IS 'The payment amount in the smallest currency unit (e.g., cents).';

-- Enable RLS
ALTER TABLE public.content_payments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Contributors can view their own payments"
ON public.content_payments FOR SELECT TO authenticated USING (auth.uid() = contributor_id);