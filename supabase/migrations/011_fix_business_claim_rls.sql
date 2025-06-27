-- First, drop the old, incorrect policy
DROP POLICY IF EXISTS "Owners can update their own business profile." ON public.businesses;

-- Now, create the new, correct policy
CREATE POLICY "Owners can update their own business profile." ON public.businesses
  FOR UPDATE USING (
    -- A user can update a business IF they are already the owner
    (auth.uid() = owner_id)
    -- OR if the business has no owner yet (this allows the first claim)
    OR (owner_id IS NULL)
  );