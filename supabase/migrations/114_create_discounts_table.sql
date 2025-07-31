-- This migration creates the foundational 'discounts' table, which is
-- essential for Revuoo's marketing and sales strategies.

-- Step 1: Create a custom type for the discount type for data consistency.
CREATE TYPE public.discount_type AS ENUM ('percent', 'fixed');

-- Step 2: Create a custom type for the discount status.
CREATE TYPE public.discount_status AS ENUM ('active', 'inactive', 'expired');

-- Step 3: Create the discounts table itself.
CREATE TABLE public.discounts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    code text NOT NULL,
    discount_type public.discount_type NOT NULL,
    value numeric(10, 2) NOT NULL,
    status public.discount_status NOT NULL DEFAULT 'active'::public.discount_status,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,

    CONSTRAINT discounts_pkey PRIMARY KEY (id),
    CONSTRAINT discounts_code_key UNIQUE (code)
);

-- Step 4: Create a trigger to automatically update the 'updated_at' timestamp.
CREATE TRIGGER handle_discount_update
BEFORE UPDATE ON public.discounts
FOR EACH ROW
EXECUTE FUNCTION extensions.moddatetime('updated_at');

-- Step 5: Add a security policy to allow administrators to fully manage discounts.
CREATE POLICY "Admins can fully manage discounts"
ON public.discounts
FOR ALL -- This applies to SELECT, INSERT, UPDATE, and DELETE
TO authenticated
USING (
  'admin' = ANY(get_user_roles())
)
WITH CHECK (
  'admin' = ANY(get_user_roles())
);
