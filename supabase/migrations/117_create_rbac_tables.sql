-- This migration creates the foundational tables for a robust,
-- database-driven Role-Based Access Control (RBAC) system.

-- Step 1: Create the 'roles' table.
-- This stores the names and descriptions of user roles.
CREATE TABLE public.roles (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT roles_pkey PRIMARY KEY (id),
    CONSTRAINT roles_name_key UNIQUE (name)
);

-- Step 2: Create the 'permissions' table.
-- This is a master list of all possible actions in the system.
-- The name is structured as "resource.action" for clarity.
CREATE TABLE public.permissions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT permissions_pkey PRIMARY KEY (id),
    CONSTRAINT permissions_name_key UNIQUE (name)
);

-- Step 3: Create the 'role_permissions' join table.
-- This table links roles to their assigned permissions, forming the core of the RBAC logic.
CREATE TABLE public.role_permissions (
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL,

    CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id),
    CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE,
    CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE
);

-- Step 4: Enable Row Level Security on the new tables.
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies to ensure only Admins can manage RBAC.
-- Admins can manage roles.
CREATE POLICY "Admins can manage roles" ON public.roles
    FOR ALL USING ('admin' = ANY(get_user_roles())) WITH CHECK ('admin' = ANY(get_user_roles()));

-- Admins can manage permissions.
CREATE POLICY "Admins can manage permissions" ON public.permissions
    FOR ALL USING ('admin' = ANY(get_user_roles())) WITH CHECK ('admin' = ANY(get_user_roles()));

-- Admins can manage the link between roles and permissions.
CREATE POLICY "Admins can manage role_permissions" ON public.role_permissions
    FOR ALL USING ('admin' = ANY(get_user_roles())) WITH CHECK ('admin' = ANY(get_user_roles()));


-- Step 6: Seed the tables with some initial data.
-- We will create a default "Administrator" role and a few essential permissions.
-- This provides a starting point for the new system.

-- Insert the Administrator role
INSERT INTO public.roles (name, description)
VALUES ('Administrator', 'Has full access to all system features.');

-- Insert some initial permissions
INSERT INTO public.permissions (name, description)
VALUES
    ('system.view_settings', 'Can view all tabs in the System Settings page'),
    ('system.manage_roles', 'Can create, edit, and assign permissions to roles'),
    ('billing.view', 'Can view the Revenue & Billing dashboard'),
    ('users.manage', 'Can view, edit, and suspend users'),
    ('reviews.moderate', 'Can approve or reject user and expert reviews');

-- Step 7: Assign all the new permissions to the Administrator role.
-- This ensures the first admin user can manage the new system.
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT
    (SELECT id FROM public.roles WHERE name = 'Administrator'),
    p.id
FROM
    public.permissions p;