-- This migration creates a new 'plans' table to store SaaS subscription details,
-- making them manageable from the admin dashboard instead of being hardcoded.
-- It also seeds the table with the initial data from your pricing plan.

-- Step 1: Create the new 'plans' table
CREATE TABLE public.plans (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    price_monthly numeric(10, 2) NOT NULL DEFAULT 0,
    price_annually numeric(10, 2) NOT NULL DEFAULT 0,
    is_most_popular boolean NOT NULL DEFAULT false,
    features jsonb, -- Storing feature list as JSON is flexible
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,

    CONSTRAINT plans_pkey PRIMARY KEY (id),
    CONSTRAINT plans_slug_key UNIQUE (slug)
);

-- Step 2: Seed the table with your existing plan data
INSERT INTO public.plans
(name, slug, description, price_monthly, price_annually, is_most_popular)
VALUES
('Free', 'free', 'For businesses getting started and building a basic online presence.', 0, 0, false),
('Pro', 'pro', 'For growing businesses ready to actively manage their reputation.', 49, 39, true),
('Advanced', 'advanced', 'For established businesses that need deeper insights and more scale.', 99, 79, false),
('Enterprise', 'enterprise', 'Custom solutions for large organizations with unique needs.', 0, 0, false);
