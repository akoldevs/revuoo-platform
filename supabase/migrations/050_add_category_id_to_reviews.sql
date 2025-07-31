-- 050_add_category_id_to_reviews.sql

ALTER TABLE public.reviews
ADD COLUMN category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;