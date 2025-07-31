-- migration: 080_create_chat_system_schema.sql

-- Table 1: Represents a single conversation thread about a specific review.
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Each expert review can have only one conversation thread.
    expert_review_id UUID NOT NULL UNIQUE REFERENCES public.expert_reviews(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Optional: To show the topic in the inbox list without extra joins.
    topic TEXT
);
COMMENT ON TABLE public.conversations IS 'A chat thread related to a specific expert review submission.';


-- Table 2: Stores the individual messages within each conversation.
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.messages IS 'Individual messages within a conversation.';
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);


-- Table 3: Links users to conversations and tracks read status.
CREATE TABLE IF NOT EXISTS public.conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    -- Used to determine if there are unread messages.
    last_read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- A user can only be a participant in a conversation once.
    CONSTRAINT unique_conversation_participant UNIQUE (conversation_id, participant_id)
);
COMMENT ON TABLE public.conversation_participants IS 'Links users to conversations and tracks read status.';


-- Enable Row-Level Security on all new tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;


-- RLS Policies
-- A user can interact with a conversation if they are a participant.
CREATE POLICY "Allow access to participants" ON public.conversations
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.conversation_participants cp
        WHERE cp.conversation_id = id AND cp.participant_id = auth.uid()
    )
    OR public.check_user_role('admin') -- Admins can access all conversations
);

-- A user can interact with messages if they are a participant in the conversation.
CREATE POLICY "Allow access to messages for participants" ON public.messages
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.conversation_participants cp
        WHERE cp.conversation_id = messages.conversation_id AND cp.participant_id = auth.uid()
    )
    OR public.check_user_role('admin')
);

-- Users can see their own participation record. Admins can manage all participants.
CREATE POLICY "Allow access to own participation record" ON public.conversation_participants
FOR ALL USING (
    participant_id = auth.uid()
    OR public.check_user_role('admin')
);
