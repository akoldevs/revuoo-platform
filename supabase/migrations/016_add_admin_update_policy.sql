-- This policy allows users with the 'admin' role to update any review.
-- This is necessary for the Approve/Reject buttons in the admin dashboard to work.

CREATE POLICY "Admins can update any review."
ON public.reviews
FOR UPDATE
USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );