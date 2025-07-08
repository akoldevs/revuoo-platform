-- ========= FIX FOR CRITICAL ERRORS =========

-- 1. Enable RLS on the 'users' table and add policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own user record
CREATE POLICY "Users can view their own user data."
ON public.users FOR SELECT
USING ( auth.uid() = id );


-- 2. Enable RLS on the 'review_ai_analysis' table
-- We already created the read-only policy for this table, so we just need to enable RLS.
ALTER TABLE public.review_ai_analysis ENABLE ROW LEVEL SECURITY;


-- ========= FIX FOR FUNCTION WARNINGS =========
-- We will redefine our functions to be more secure.

-- 1. Fix for calculate_revuoo_score
CREATE OR REPLACE FUNCTION public.calculate_revuoo_score(p_business_id BIGINT)
RETURNS NUMERIC
LANGUAGE plpgsql
-- Add SECURITY DEFINER to run the function with the permissions of the user who created it (the admin)
-- Add SET search_path to prevent search path attacks
SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_score NUMERIC;
BEGIN
  SELECT
    AVG(
      (quality * 0.30) +
      (professionalism * 0.20) +
      (punctuality * 0.15) +
      (communication * 0.15) +
      (value * 0.20)
    ) * 2
  INTO v_score
  FROM public.reviews
  WHERE
    business_id = p_business_id AND status = 'approved';

  RETURN COALESCE(v_score, NULL);
END;
$$;

-- 2. Fix for update_business_revuoo_score
CREATE OR REPLACE FUNCTION public.update_business_revuoo_score()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_business_id BIGINT;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    v_business_id := OLD.business_id;
  ELSE
    v_business_id := NEW.business_id;
  END IF;

  IF v_business_id IS NOT NULL THEN
    UPDATE public.businesses
    SET revuoo_score = (SELECT public.calculate_revuoo_score(v_business_id))
    WHERE id = v_business_id;
  END IF;

  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;


-- 3. Fix for trigger_ai_moderator
create or replace function public.trigger_ai_moderator()
returns trigger
language plpgsql
SECURITY DEFINER SET search_path = public, pg_temp
as $$
begin
  perform net.http_post(
    url:='https://mhumpgmhvamsizrrsopq.supabase.co/functions/v1/ai-moderator',
    body:=jsonb_build_object('record', new)
  );
  return new;
end;
$$;