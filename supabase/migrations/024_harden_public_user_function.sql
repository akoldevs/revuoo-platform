-- ========= FINAL SECURITY HARDENING FIX =========
-- This adds the SET search_path parameter to the last remaining function
-- to resolve the final warning in the Security Advisor.

CREATE OR REPLACE FUNCTION public.handle_new_user_public()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 -- Add SET search_path to prevent search path attacks
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$function$