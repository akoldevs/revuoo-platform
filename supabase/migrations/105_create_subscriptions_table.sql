-- This migration creates the foundational 'subscriptions' table, which is
-- essential for all of Revuoo's B2B SaaS monetization strategies.

-- First, create a custom type for the subscription status for data consistency.
CREATE TYPE public.subscription_status AS ENUM (
    'active',
    'trialing',
    'past_due',
    'canceled',
    'unpaid'
);

-- Now, create the subscriptions table itself.
CREATE TABLE public.subscriptions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    business_id bigint NOT NULL,
    plan_name text NOT NULL, -- e.g., 'Free', 'Pro', 'Advanced', 'Enterprise'
    status public.subscription_status NOT NULL DEFAULT 'active'::public.subscription_status,
    created_at timestamptz NOT NULL DEFAULT now(),
    current_period_end timestamptz NOT NULL,

    CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
    CONSTRAINT subscriptions_business_id_fkey FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Add an index for faster lookups by business_id
CREATE INDEX idx_subscriptions_business_id ON public.subscriptions(business_id);
