-- migration: 071_add_demand_score_and_cat_to_assignments.sql

-- 1. Add demand_score to the assignments table
ALTER TABLE public.assignments
ADD COLUMN IF NOT EXISTS demand_score INTEGER NOT NULL DEFAULT 50 CHECK (demand_score >= 0 AND demand_score <= 100);

COMMENT ON COLUMN public.assignments.demand_score IS 'A score from 0-100 indicating market demand for this content. Powers the Opportunity Matrix.';


-- 2. Create a linking table for a many-to-many relationship between assignments and categories
CREATE TABLE IF NOT EXISTS public.assignment_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- CORRECTED LINE: Changed UUID to BIGINT to match assignments.id
    assignment_id BIGINT NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Ensure a category is not linked to the same assignment more than once
    CONSTRAINT unique_assignment_category UNIQUE (assignment_id, category_id)
);

COMMENT ON TABLE public.assignment_categories IS 'Links assignments to one or more content categories.';


-- 3. Enable Row-Level Security (RLS) on the new table
ALTER TABLE public.assignment_categories ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for the new table
-- Allow anyone to view the links.
DROP POLICY IF EXISTS "Allow public read access" ON public.assignment_categories;
CREATE POLICY "Allow public read access"
ON public.assignment_categories
FOR SELECT
USING (true);