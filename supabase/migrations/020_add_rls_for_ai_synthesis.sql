-- First, enable Row Level Security on the new table
ALTER TABLE public.business_ai_synthesis ENABLE ROW LEVEL SECURITY;

-- Then, create a policy that allows anyone to read the data from it.
-- This is safe because the data is a generated summary and not sensitive.
CREATE POLICY "Public can read AI synthesis data."
ON public.business_ai_synthesis
FOR SELECT
USING (true);