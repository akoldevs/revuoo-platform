-- This migration creates the table to store page view analytics for Sanity content.

CREATE TABLE public.content_analytics (
    id text NOT NULL, -- This will store the Sanity document ID (_id)
    view_count bigint NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT content_analytics_pkey PRIMARY KEY (id)
);

-- Add a comment to explain the purpose of the 'id' column.
COMMENT ON COLUMN public.content_analytics.id IS 'Stores the Sanity document ID (_id) for a post, faq, or page.';