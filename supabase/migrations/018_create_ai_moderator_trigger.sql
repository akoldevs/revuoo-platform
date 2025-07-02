-- This trigger calls our Edge Function whenever a new review is inserted.

-- 1. Create the trigger function
create or replace function public.trigger_ai_moderator()
returns trigger
language plpgsql
as $$
begin
  -- Make an HTTP POST request to our Edge Function
  perform net.http_post(
    -- The URL of our deployed Edge Function
    url:='https://mhumpgmhvamsizrrsopq.supabase.co/functions/v1/ai-moderator',
    -- The body of the request contains the new review data
    body:=jsonb_build_object('record', new)
  );
  return new;
end;
$$;

-- 2. Create the trigger that calls the function after a new review is inserted
create trigger on_new_review_for_moderation
  after insert on public.reviews
  for each row execute procedure public.trigger_ai_moderator();