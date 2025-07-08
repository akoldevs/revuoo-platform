-- 037_seed_more_parent_categories.sql

-- Insert "Personal Care & Wellness" and its children
WITH parent_category AS (
    INSERT INTO public.categories (name, slug, icon_svg)
    VALUES ('Personal Care & Wellness', 'personal-care-wellness', 'HeartPulse')
    RETURNING id
)
INSERT INTO public.categories (name, slug, icon_svg, parent_id)
VALUES
    ('Beauty Services', 'beauty-services', 'Sparkles', (SELECT id FROM parent_category)),
    ('Fitness & Health', 'fitness-health', 'HeartPulse', (SELECT id FROM parent_category)),
    ('Wellness & Therapy', 'wellness-therapy', 'Users', (SELECT id FROM parent_category)),
    ('Child & Senior Care', 'child-senior-care', 'Users', (SELECT id FROM parent_category));


-- Insert "Automotive Services" and its children
WITH parent_category AS (
    INSERT INTO public.categories (name, slug, icon_svg)
    VALUES ('Automotive Services', 'automotive-services', 'Car')
    RETURNING id
)
INSERT INTO public.categories (name, slug, icon_svg, parent_id)
VALUES
    ('Auto Repair & Maintenance', 'auto-repair-maintenance', 'Wrench', (SELECT id FROM parent_category)),
    ('Vehicle Customization & Specialty', 'vehicle-customization', 'Sparkles', (SELECT id FROM parent_category)),
    ('Car Sales & Leasing', 'car-sales-leasing', 'Car', (SELECT id FROM parent_category));