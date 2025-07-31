-- 052_create_saved_businesses_table.sql

CREATE TABLE public.saved_businesses (
    user_id UUID NOT NULL,
    business_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT saved_businesses_pkey PRIMARY KEY (user_id, business_id),
    CONSTRAINT saved_businesses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT saved_businesses_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE
);

-- Add comments for clarity
COMMENT ON TABLE public.saved_businesses IS 'Stores which users have saved which businesses.';

-- Enable Row Level Security
ALTER TABLE public.saved_businesses ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see their own saved items
CREATE POLICY "Users can view their own saved businesses"
ON public.saved_businesses
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create policy for users to save a business
CREATE POLICY "Users can save a business"
ON public.saved_businesses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policy for users to unsave a business
CREATE POLICY "Users can unsave their own saved businesses"
ON public.saved_businesses
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);