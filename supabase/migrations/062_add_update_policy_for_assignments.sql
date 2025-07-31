-- 062_add_update_policy_for_assignments.sql

CREATE POLICY "Contributors can claim open assignments"
ON public.assignments 
FOR UPDATE TO authenticated
USING ( status = 'open' )
WITH CHECK ( contributor_id = auth.uid() );