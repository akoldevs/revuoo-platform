-- migration: 077_create_badges_system.sql

-- Table to define all available badges on the platform
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon_svg TEXT, -- To store a small SVG for the badge's icon
    
    -- Criteria for earning the badge. This allows for a flexible rule system.
    -- e.g., 'CATEGORY_COUNT', 'TOTAL_VIEWS', 'IMPACT_SCORE_AVG'
    criteria_type TEXT NOT NULL, 
    
    -- The specific values for the criteria.
    -- e.g., {"category_slug": "saas", "count": 5} or {"views": 10000}
    criteria_value JSONB NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.badges IS 'Definitions for all achievable badges and their criteria.';

-- Junction table to link contributors to the badges they have earned
CREATE TABLE IF NOT EXISTS public.contributor_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contributor_id UUID NOT NULL REFERENCES public.contributors(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- A contributor can only earn each specific badge once
    CONSTRAINT unique_contributor_badge UNIQUE (contributor_id, badge_id)
);

COMMENT ON TABLE public.contributor_badges IS 'Records which contributor has earned which badge.';

-- Enable Row-Level Security on the new tables
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributor_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for 'badges'
-- Anyone can see what badges are available.
CREATE POLICY "Allow public read access to all badges"
ON public.badges FOR SELECT
USING (true);

-- Only admins can create, update, or delete badge definitions.
CREATE POLICY "Allow admin full access to badges"
ON public.badges FOR ALL
USING (public.check_user_role('admin'))
WITH CHECK (public.check_user_role('admin'));

-- RLS Policies for 'contributor_badges'
-- Anyone can see which badges a contributor has earned (for public profiles).
CREATE POLICY "Allow public read access to earned badges"
ON public.contributor_badges FOR SELECT
USING (true);

-- Only admins can award badges (for now).
-- In the future, we can create a trigger or function to award them automatically.
CREATE POLICY "Allow admin to manage earned badges"
ON public.contributor_badges FOR ALL
USING (public.check_user_role('admin'))
WITH CHECK (public.check_user_role('admin'));


-- Let's insert a few example badges to get started
INSERT INTO public.badges (name, description, icon_svg, criteria_type, criteria_value)
VALUES
    ('SaaS Specialist', 'Awarded for publishing 5 approved reviews in the SaaS category.', '<svg>...</svg>', 'CATEGORY_COUNT', '{"category_slug": "saas", "count": 5}'),
    ('First Review', 'Awarded for publishing your first approved review.', '<svg>...</svg>', 'TOTAL_REVIEWS', '{"count": 1}'),
    ('View Master', 'Awarded for reaching a total of 10,000 views across all reviews.', '<svg>...</svg>', 'TOTAL_VIEWS', '{"views": 10000}')
ON CONFLICT (name) DO NOTHING; -- Prevents errors if you run the migration multiple times
