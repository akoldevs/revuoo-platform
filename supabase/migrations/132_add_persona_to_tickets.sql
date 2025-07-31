-- This migration adds the 'persona' context to support tickets.

-- Step 1: Create a custom type for the user personas.
CREATE TYPE public.user_persona AS ENUM (
    'user',
    'contributor',
    'business'
);

-- Step 2: Add the new 'persona' column to the support_tickets table.
ALTER TABLE public.support_tickets
ADD COLUMN persona public.user_persona NOT NULL DEFAULT 'user';

-- Step 3: Upgrade our ticket creation function to accept the new persona.
DROP FUNCTION IF EXISTS public.create_ticket_with_reply(uuid,text,public.ticket_status,public.ticket_priority,text,uuid);
CREATE OR REPLACE FUNCTION public.create_ticket_with_reply(
    p_profile_id uuid,
    p_subject text,
    p_status public.ticket_status,
    p_priority public.ticket_priority,
    p_reply_content text,
    p_author_id uuid,
    p_persona public.user_persona -- ✅ NEW: Accept the persona
)
RETURNS bigint
LANGUAGE plpgsql
AS $$
DECLARE
    new_ticket_id bigint;
BEGIN
    -- Insert the new ticket with its persona
    INSERT INTO public.support_tickets (profile_id, subject, status, priority, assigned_to_profile_id, persona)
    VALUES (p_profile_id, p_subject, p_status, p_priority, p_author_id, p_persona)
    RETURNING id INTO new_ticket_id;

    -- Insert the first reply for that new ticket
    INSERT INTO public.ticket_replies (ticket_id, profile_id, content)
    VALUES (new_ticket_id, p_author_id, p_reply_content);

    RETURN new_ticket_id;
END;
$$;