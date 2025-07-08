-- 042_add_description_to_categories.sql

ALTER TABLE public.categories
ADD COLUMN description TEXT;

COMMENT ON COLUMN public.categories.description IS 'A short description of the category.';