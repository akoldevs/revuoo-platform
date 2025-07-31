-- migration: 081_create_chat_functions.sql

-- Function 1: Gets all conversations for the current user, along with metadata.
CREATE OR REPLACE FUNCTION public.get_my_conversations()
RETURNS TABLE (
    conversation_id UUID,
    topic TEXT,
    last_message_content TEXT,
    last_message_at TIMESTAMPTZ,
    unread_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH user_conversations AS (
        SELECT
            c.id as conv_id,
            c.topic,
            p.last_read_at
        FROM
            public.conversations c
        JOIN
            public.conversation_participants p ON c.id = p.conversation_id
        WHERE
            p.participant_id = auth.uid()
    ),
    last_messages AS (
        SELECT
            m.conversation_id,
            m.content,
            m.created_at,
            -- Use ROW_NUMBER to find the most recent message for each conversation
            ROW_NUMBER() OVER(PARTITION BY m.conversation_id ORDER BY m.created_at DESC) as rn
        FROM
            public.messages m
        WHERE m.conversation_id IN (SELECT conv_id FROM user_conversations)
    ),
    unread_counts AS (
        SELECT
            m.conversation_id,
            COUNT(*) as unread
        FROM
            public.messages m
        JOIN
            user_conversations uc ON m.conversation_id = uc.conv_id
        -- Count messages created after the user last read the conversation
        WHERE m.created_at > COALESCE(uc.last_read_at, '1970-01-01') AND m.sender_id <> auth.uid()
        GROUP BY
            m.conversation_id
    )
    SELECT
        uc.conv_id AS conversation_id,
        uc.topic,
        lm.content AS last_message_content,
        lm.created_at AS last_message_at,
        COALESCE(ucnt.unread, 0) AS unread_count
    FROM
        user_conversations uc
    LEFT JOIN
        last_messages lm ON uc.conv_id = lm.conversation_id AND lm.rn = 1
    LEFT JOIN
        unread_counts ucnt ON uc.conv_id = ucnt.conversation_id
    ORDER BY
        lm.created_at DESC NULLS LAST;
END;
$$;


-- Function 2: Gets all messages for a specific conversation and marks them as read.
CREATE OR REPLACE FUNCTION public.get_messages_for_conversation(p_conversation_id UUID)
RETURNS TABLE (
    id UUID,
    content TEXT,
    created_at TIMESTAMPTZ,
    sender_id UUID,
    sender_username TEXT,
    sender_avatar_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- First, verify the user is a participant before doing anything.
    IF NOT EXISTS (
        SELECT 1 FROM public.conversation_participants
        WHERE conversation_id = p_conversation_id AND participant_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'User is not a participant of this conversation';
    END IF;

    -- Update the last_read_at timestamp for the current user.
    UPDATE public.conversation_participants
    SET last_read_at = NOW()
    WHERE conversation_id = p_conversation_id AND participant_id = auth.uid();

    -- Then, return all messages for the conversation.
    RETURN QUERY
    SELECT
        m.id,
        m.content,
        m.created_at,
        m.sender_id,
        p.username AS sender_username,
        p.avatar_url AS sender_avatar_url
    FROM
        public.messages m
    JOIN
        public.profiles p ON m.sender_id = p.id
    WHERE
        m.conversation_id = p_conversation_id
    ORDER BY
        m.created_at ASC;
END;
$$;


-- Grant execution rights for both functions
GRANT EXECUTE ON FUNCTION public.get_my_conversations() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_messages_for_conversation(UUID) TO authenticated;
