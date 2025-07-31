-- 051_populate_new_category_id_column.sql

UPDATE public.reviews r
SET category_id = c.id
FROM public.categories c
WHERE r.category = c.name;