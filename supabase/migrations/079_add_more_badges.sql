-- migration: 079_add_more_badges.sql

-- Insert new category-specific badges
-- The ON CONFLICT clause prevents errors if you run this migration more than once.
INSERT INTO public.badges (name, description, icon_svg, criteria_type, criteria_value)
VALUES
    ('Home Services Pro', 'Awarded for publishing 5 approved reviews in the Home Services category.', '<svg>...</svg>', 'CATEGORY_COUNT', '{"category_slug": "home-services", "count": 5}'),
    ('Automotive Expert', 'Awarded for publishing 5 approved reviews in the Automotive Services category.', '<svg>...</svg>', 'CATEGORY_COUNT', '{"category_slug": "automotive-services", "count": 5}'),
    ('Wellness Advocate', 'Awarded for publishing 5 approved reviews in the Personal Care & Wellness category.', '<svg>...</svg>', 'CATEGORY_COUNT', '{"category_slug": "personal-care-wellness", "count": 5}')
ON CONFLICT (name) DO NOTHING;