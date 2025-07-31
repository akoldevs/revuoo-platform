// src/app/dashboard/contributor/inbox/page.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useRef, useCallback } from "react"; // ✅ Import useCallback
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendMessage } from "@/app/actions/contributorActions";
import { formatDistanceToNow } from "date-fns";
import { SendHorizonal, UserCircle } from "lucide-react";
import { toast } from "sonner";

// Define TypeScript types for our data
type Conversation = {
  conversation_id: string;
  topic: string;
  last_message_content: string;
  last_message_at: string;
  unread_count: number;
};

type Message = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  sender_username: string;
  sender_avatar_url: string;
};

export default function InboxPage() {
  const supabase = createClient();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, [supabase]);

  useEffect(() => {
    const fetchConversations = async () => {
      const { data } = await supabase.rpc("get_my_conversations");
      setConversations(data || []);
    };
    fetchConversations();
  }, [supabase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ FIX: Wrap handleSelectConversation in useCallback to stabilize it
  const handleSelectConversation = useCallback(
    async (conversation: Conversation) => {
      setSelectedConversation(conversation);
      const { data } = await supabase.rpc("get_messages_for_conversation", {
        p_conversation_id: conversation.conversation_id,
      });
      setMessages(data || []);

      setConversations((prev) =>
        prev.map((c) =>
          c.conversation_id === conversation.conversation_id
            ? { ...c, unread_count: 0 }
            : c
        )
      );
    },
    [supabase]
  ); // Dependency is stable

  // ✅ FIX: The realtime useEffect now has its dependency and the unused payload is removed
  useEffect(() => {
    if (!selectedConversation) return;

    const channel = supabase
      .channel(`messages:${selectedConversation.conversation_id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation.conversation_id}`,
        },
        () => {
          // The payload variable is removed
          // Refetch messages for the currently selected conversation
          handleSelectConversation(selectedConversation);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation, supabase, handleSelectConversation]); // Dependency added

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const tempMessage = newMessage;
    setNewMessage("");

    const { error } = await sendMessage(
      selectedConversation.conversation_id,
      tempMessage
    );

    if (error) {
      toast.error("Failed to send message", { description: error });
      setNewMessage(tempMessage);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex border rounded-lg bg-card">
      {/* Left Column: Conversation List */}
      <div className="w-1/3 border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Inbox</h2>
        </div>
        <ScrollArea className="h-[calc(100%-4.5rem)]">
          {conversations.map((convo) => (
            <div
              key={convo.conversation_id}
              className={`p-4 border-b cursor-pointer hover:bg-muted ${selectedConversation?.conversation_id === convo.conversation_id ? "bg-muted" : ""}`}
              onClick={() => handleSelectConversation(convo)}
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold truncate">
                  {convo.topic || "Conversation"}
                </p>
                {convo.unread_count > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {convo.unread_count}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {convo.last_message_content || "No messages yet."}
              </p>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Right Column: Chat Window */}
      <div className="w-2/3 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b flex items-center gap-4">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>
                  <UserCircle />
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">
                {selectedConversation.topic}
              </h3>
            </div>
            <ScrollArea className="flex-grow p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender_id !== userId && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.sender_avatar_url} />
                        <AvatarFallback>
                          {msg.sender_username?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-md p-3 rounded-lg ${msg.sender_id === userId ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1 text-right">
                        {formatDistanceToNow(new Date(msg.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
              >
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="resize-none"
                  rows={1}
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                  <SendHorizonal className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              Select a conversation to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
