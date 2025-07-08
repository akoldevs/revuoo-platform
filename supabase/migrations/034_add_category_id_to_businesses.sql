-- 034_add_category_id_to_businesses.sql

ALTER TABLE public.businesses
ADD COLUMN category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.businesses.category_id IS 'Foreign key to the category this business belongs to.';