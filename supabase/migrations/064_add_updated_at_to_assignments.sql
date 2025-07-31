-- 064_add_updated_at_to_assignments.sql

-- Add the updated_at column to the assignments table
ALTER TABLE public.assignments
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();

-- Create the trigger that automatically calls the function on update
CREATE TRIGGER on_assignment_update
BEFORE UPDATE ON public.assignments
FOR EACH ROW
EXECUTE PROCEDURE public.handle_updated_at();