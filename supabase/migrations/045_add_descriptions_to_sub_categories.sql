-- 045_add_descriptions_to_sub_categories.sql

UPDATE public.categories
SET description = 'Find top-rated, professional cleaning services for your home or office, from regular housekeeping to deep cleaning.'
WHERE slug = 'cleaning-services';

UPDATE public.categories
SET description = 'Discover reliable local and long-distance movers to make your relocation smooth and stress-free.'
WHERE slug = 'moving-services';

UPDATE public.categories
SET description = 'Connect with trusted Customer Relationship Management software to manage your sales, marketing, and customer support.'
WHERE slug = 'crm-software';