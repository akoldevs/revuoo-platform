-- ========= FINAL FIX FOR FUNCTION WARNINGS =========
-- We will redefine the last few functions to be more secure.

-- 1. Fix for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
-- Add SECURITY DEFINER and SET search_path
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 2. Fix for handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create a row in public.users
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  
  -- Create a row in public.profiles
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  
  RETURN NEW;
END;
$$;