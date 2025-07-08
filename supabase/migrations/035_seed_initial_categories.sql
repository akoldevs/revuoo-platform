-- 035_seed_initial_categories.sql

-- Seeding categories with a hierarchical structure
-- We use Common Table Expressions (CTEs) to get the parent ID and use it for child categories.

WITH parent_category AS (
    INSERT INTO public.categories (name, slug, icon_svg)
    VALUES ('Home Services', 'home-services', 'Home')
    RETURNING id
)
INSERT INTO public.categories (name, slug, icon_svg, parent_id)
VALUES
    ('Cleaning Services', 'cleaning-services', 'Sparkles', (SELECT id FROM parent_category)),
    ('Moving Services', 'moving-services', 'Truck', (SELECT id FROM parent_category)),
    ('Renovation & Repair', 'renovation-repair', 'Wrench', (SELECT id FROM parent_category)),
    ('Landscaping & Outdoor', 'landscaping-outdoor', 'Trees', (SELECT id FROM parent_category)),
    ('Appliance Repair', 'appliance-repair', 'Nut', (SELECT id FROM parent_category));

-- You can repeat the pattern for other top-level categories
WITH parent_category AS (
    INSERT INTO public.categories (name, slug, icon_svg)
    VALUES ('Software & SaaS', 'software-saas', 'CloudCog')
    RETURNING id
)
INSERT INTO public.categories (name, slug, icon_svg, parent_id)
VALUES
    ('CRM Software', 'crm-software', 'Users', (SELECT id FROM parent_category)),
    ('Project Management Software', 'project-management', 'ClipboardCheck', (SELECT id FROM parent_category)),
    ('Marketing Automation Software', 'marketing-automation', 'Megaphone', (SELECT id FROM parent_category)),
    ('Financial & Accounting Software', 'financial-accounting', 'Calculator', (SELECT id FROM parent_category));