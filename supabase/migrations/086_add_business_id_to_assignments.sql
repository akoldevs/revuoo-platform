-- migration: 086_add_business_id_to_assignments.sql

-- Add the business_id column to the assignments table
ALTER TABLE public.assignments
ADD COLUMN IF NOT EXISTS business_id BIGINT;

-- Add a foreign key constraint to link it to the businesses table
-- This ensures data integrity.
ALTER TABLE public.assignments
ADD CONSTRAINT assignments_business_id_fkey
FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.assignments.business_id IS 'The business this assignment is for.';
