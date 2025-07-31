-- migration: 074_create_expert_reviews_table.sql

-- First, create the helper function to check a user's role.
-- This function securely checks the 'roles' array in the profiles table for the currently logged-in user.
CREATE OR REPLACE FUNCTION public.check_user_role(p_role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid() AND p_role = ANY(roles)
  );
END;
$$;


-- Now, create the expert_reviews table.
CREATE TABLE IF NOT EXISTS public.expert_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id BIGINT UNIQUE NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    contributor_id UUID NOT NULL REFERENCES public.contributors(id) ON DELETE CASCADE,
    
    -- Core Content Fields
    title TEXT NOT NULL,
    body_content JSONB NOT NULL,
    summary TEXT,
    
    -- Review-specific structured data
    rating_overall NUMERIC(2, 1) NOT NULL CHECK (rating_overall >= 1.0 AND rating_overall <= 5.0),
    rating_pros TEXT[],
    rating_cons TEXT[],

    -- Status and Moderation
    status TEXT NOT NULL DEFAULT 'pending_approval', -- e.g., pending_approval, approved, rejected
    moderator_notes TEXT,
    published_at TIMESTAMPTZ,

    -- Metrics for the Content Impact Score
    view_count INT NOT NULL DEFAULT 0,
    helpful_votes INT NOT NULL DEFAULT 0,
    not_helpful_votes INT NOT NULL DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,

    CONSTRAINT fk_assignment
        FOREIGN KEY(assignment_id) 
        REFERENCES assignments(id),
    
    CONSTRAINT fk_contributor
        FOREIGN KEY(contributor_id) 
        REFERENCES contributors(id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_expert_reviews_contributor_id ON public.expert_reviews(contributor_id);
CREATE INDEX IF NOT EXISTS idx_expert_reviews_assignment_id ON public.expert_reviews(assignment_id);
CREATE INDEX IF NOT EXISTS idx_expert_reviews_status ON public.expert_reviews(status);

-- Enable Row-Level Security
ALTER TABLE public.expert_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow contributors to see their own submitted reviews
CREATE POLICY "Contributors can view their own reviews"
ON public.expert_reviews FOR SELECT
USING (auth.uid() = contributor_id);

-- Allow contributors to insert reviews for their claimed assignments
CREATE POLICY "Contributors can insert their own reviews"
ON public.expert_reviews FOR INSERT
WITH CHECK (
    auth.uid() = contributor_id AND
    EXISTS (
        SELECT 1 FROM assignments a
        WHERE a.id = expert_reviews.assignment_id
        AND a.contributor_id = auth.uid()
        AND a.status = 'claimed'
    )
);

-- CORRECTED: Use our new helper function to grant full access to admins.
-- This assumes you have a user with 'admin' in their roles array.
CREATE POLICY "Enable full access for admins"
ON public.expert_reviews FOR ALL
USING (public.check_user_role('admin'))
WITH CHECK (public.check_user_role('admin'));