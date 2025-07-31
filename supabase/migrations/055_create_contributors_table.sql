-- 055_create_contributors_table.sql

CREATE TABLE public.contributors (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    stripe_account_id TEXT,
    specialties TEXT[],
    portfolio_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add comments for clarity
COMMENT ON TABLE public.contributors IS 'Stores additional information for users who are approved contributors.';
COMMENT ON COLUMN public.contributors.id IS 'Links to the profiles table.';
COMMENT ON COLUMN public.contributors.stripe_account_id IS 'The connect account ID from Stripe for payouts.';
COMMENT ON COLUMN public.contributors.specialties IS 'An array of topics the contributor specializes in, e.g., {"SaaS", "Home Services"}.';

-- Enable Row Level Security
ALTER TABLE public.contributors ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Contributors can view their own data"
ON public.contributors FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Contributors can update their own data"
ON public.contributors FOR UPDATE TO authenticated USING (auth.uid() = id);

-- After creating the table, let's add the 'contributor' role to our existing user roles
-- This assumes you have a 'user_role' enum type. If not, we can adjust.
-- ALTER TYPE user_role ADD VALUE 'contributor'; -- This might be needed if your 'role' column is an enum