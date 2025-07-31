-- 059_create_assignments_table.sql

CREATE TYPE assignment_status AS ENUM ('open', 'claimed', 'submitted', 'approved', 'paid');

CREATE TABLE public.assignments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    description TEXT,
    payout_amount INT NOT NULL, -- Storing amount in cents
    status assignment_status NOT NULL DEFAULT 'open',
    contributor_id UUID REFERENCES public.contributors(id) ON DELETE SET NULL, -- Who claimed it
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.assignments IS 'Stores available and claimed writing assignments for contributors.';
COMMENT ON COLUMN public.assignments.payout_amount IS 'The payment for completing the assignment, in cents.';

-- Enable RLS
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Policies
-- Anyone who is a contributor can see 'open' assignments.
CREATE POLICY "Contributors can see open assignments"
ON public.assignments FOR SELECT TO authenticated USING (
    status = 'open' AND EXISTS (SELECT 1 FROM contributors WHERE id = auth.uid())
);

-- A contributor can see an assignment they have claimed.
CREATE POLICY "Contributors can see their own claimed assignments"
ON public.assignments FOR SELECT TO authenticated USING (auth.uid() = contributor_id);