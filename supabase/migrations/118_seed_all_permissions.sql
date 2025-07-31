-- This migration seeds the 'permissions' table with a comprehensive set of permissions
-- for the entire Revuoo Admin OS and ensures the Administrator role gets all of them.

-- Step 1: Insert all the new, granular permissions.
-- We use a clear "resource.action" or "page.view" naming convention.
INSERT INTO public.permissions (name, description)
VALUES
    -- Navigation Permissions (controls visibility of sidebar links)
    ('nav.view_moderation_queue', 'Can see "Moderation Queue" in the sidebar'),
    ('nav.view_user_management', 'Can see "User Management" in the sidebar'),
    ('nav.view_business_management', 'Can see "Business Management" in the sidebar'),
    ('nav.view_contributor_signals', 'Can see "Contributor Signals" in the sidebar'),
    ('nav.view_platform_analytics', 'Can see "Platform Analytics" in the sidebar'),
    ('nav.view_revenue_billing', 'Can see "Revenue & Billing" in the sidebar'),
    ('nav.view_content_management', 'Can see "Content Mgmt" in the sidebar'),
    ('nav.view_system_settings', 'Can see "System Settings" in the sidebar'),

    -- System Settings Permissions (controls access to tabs within settings)
    ('settings.manage_categories', 'Can manage business categories'),
    ('settings.manage_plans', 'Can manage SaaS subscription plans'),
    ('settings.manage_discounts', 'Can manage discount codes'),
    ('settings.manage_roles', 'Can manage roles and permissions (RBAC)'),

    -- User Management Permissions
    ('users.view', 'Can view the list of users'),
    ('users.edit', 'Can edit user details'),
    ('users.suspend', 'Can suspend or ban a user'),

    -- Business Management Permissions
    ('businesses.view', 'Can view the list of businesses'),
    ('businesses.edit', 'Can edit business profiles'),
    ('businesses.manage_subscriptions', 'Can change a business''s subscription plan'),

    -- Content Management Permissions
    ('content.guides.manage', 'Can manage "Guides & Insights" posts'),
    ('content.faqs.manage', 'Can manage FAQ articles'),
    ('content.pages.manage', 'Can manage static website pages')

ON CONFLICT (name) DO NOTHING; -- This prevents errors if you run the script twice.


-- Step 2: IMPORTANT - Grant all permissions to the Administrator role.
-- This ensures the 'Administrator' role is always a "Superadmin".
-- We first delete existing permissions to avoid duplicates, then insert all of them.

-- First, get the ID of the Administrator role
DO $$
DECLARE
    admin_role_id uuid;
BEGIN
    SELECT id INTO admin_role_id FROM public.roles WHERE name = 'Administrator';

    -- If the role exists, proceed.
    IF admin_role_id IS NOT NULL THEN
        -- Delete all current permissions for the admin role to ensure a clean slate.
        DELETE FROM public.role_permissions WHERE role_id = admin_role_id;

        -- Insert a record for EVERY permission that exists, linking it to the admin role.
        INSERT INTO public.role_permissions (role_id, permission_id)
        SELECT admin_role_id, p.id FROM public.permissions p;
    END IF;
END $$;