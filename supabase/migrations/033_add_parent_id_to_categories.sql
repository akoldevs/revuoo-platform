-- 033_create_categories_table.sql

CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon_svg TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
);

COMMENT ON TABLE public.categories IS 'Stores product and service categories in a hierarchical structure.';
COMMENT ON COLUMN public.categories.parent_id IS 'The parent category for creating a hierarchy. If NULL, this is a top-level category.';

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policy for all users to read categories
CREATE POLICY "Allow all users to read categories"
ON public.categories
FOR SELECT
TO authenticated, anon
USING (true);