-- 043_add_descriptions_to_main_categories.sql

UPDATE public.categories
SET description = 'Find trusted professionals for everything from cleaning and moving to renovations and repairs.'
WHERE slug = 'home-services';

UPDATE public.categories
SET description = 'Discover top-rated software solutions, from CRM and project management to marketing and financial tools.'
WHERE slug = 'software-saas';

UPDATE public.categories
SET description = 'Explore expert services for your vehicle, including repair, maintenance, customization, and sales.'
WHERE slug = 'automotive-services';

UPDATE public.categories
SET description = 'Invest in your wellbeing with top-rated services for beauty, fitness, and mental health.'
WHERE slug = 'personal-care-wellness';