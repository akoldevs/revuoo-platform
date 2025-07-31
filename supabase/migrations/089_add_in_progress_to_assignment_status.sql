-- This migration adds a new value to our custom 'assignment_status' enum type.
-- This is necessary to allow assignments to be marked as "in progress" after being claimed.

ALTER TYPE public.assignment_status ADD VALUE 'in_progress';
