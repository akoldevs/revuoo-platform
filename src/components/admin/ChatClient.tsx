// src/components/admin/ChatClient.tsx
"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Users, Hash } from "lucide-react";
import { AddChannelModal } from "./AddChannelModal";
import { getMessagesForChannel } from "@/app/admin/actions";
import { useDebouncedCallback } from "use-debounce";
import { ChannelMembersManager } from "./ChannelMembersManager";

// Type Definitions (assuming they are still correct)
type Profile = { id: string; full_name: string | null };
type Message = {
  id: number;
  content: string;
  created_at: string;
  profiles: Profile | null;
};
type Channel = { id: number; name: string; member_count: number };
type Presence = { user_id: string; name: string };
type TypingIndicator = { profile_id: string; full_name: string | null };

export function ChatClient() {
  // ✅ All state is now managed here, starting empty
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [onlinePresences, setOnlinePresences] = useState<Presence[]>([]);
  const [typing, setTyping] = useState<TypingIndicator[]>([]);
  const [messageCache, setMessageCache] = useState<{
    [key: number]: Message[];
  }>({});

  const supabase = createClient();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // ✅ This new useEffect fetches all initial data on the client-side
  useEffect(() => {
    const fetchInitialData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: initialChannels } = await supabase.rpc(
          "get_channels_for_user"
        );
        if (initialChannels && initialChannels.length > 0) {
          const generalChannel =
            initialChannels.find((c) => c.name === "general") ||
            initialChannels[0];
          setChannels(initialChannels);
          setActiveChannel(generalChannel);
          const { data: initialMessages } = await getMessagesForChannel(
            generalChannel.id
          );
          if (initialMessages) {
            setMessages(initialMessages);
            setMessageCache({ [generalChannel.id]: initialMessages });
          }
        }
      }
      setIsLoading(false);
    };
    fetchInitialData();
  }, [supabase]);

  const scrollToBottom = () => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [messages]);

  const debouncedChannelRefetch = useDebouncedCallback(async () => {
    const { data: updatedChannels } = await supabase.rpc(
      "get_channels_for_user"
    );
    if (updatedChannels) setChannels(updatedChannels);
  }, 300);

  useEffect(() => {
    const mainSub = supabase.channel("main-team-chat-updates");
    mainSub
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "channels" },
        () => debouncedChannelRefetch()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "channel_members" },
        () => debouncedChannelRefetch()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(mainSub);
    };
  }, [supabase, debouncedChannelRefetch]);

  // All other useEffects and handlers remain largely the same, just ensure checks for `activeChannel`
  // ... (the rest of your component logic will go here)

  // Handlers
  const handleChannelClick = (channel: Channel) => {
    /* ... existing logic ... */
  };
  const handleSendMessage = async (e: React.FormEvent) => {
    /* ... existing logic ... */
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    /* ... existing logic ... */
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ✅ The full component JSX now lives here
  return (
    <div className="flex h-full border rounded-lg bg-card">
      <div className="w-1/4 border-r bg-muted/50 p-4 flex flex-col">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-card-foreground">Channels</h2>
            <AddChannelModal />
          </div>
          <ul className="space-y-1">
            {channels.map((channel) => (
              <li key={channel.id}>
                <button
                  onClick={() => handleChannelClick(channel)}
                  className={`w-full text-left p-2 rounded-md font-medium text-sm transition-colors flex items-center justify-between ${activeChannel?.id === channel.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
                >
                  <span className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    {channel.name}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${activeChannel?.id === channel.id ? "bg-primary-foreground/20" : "bg-muted-foreground/20"}`}
                  >
                    {channel.member_count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto pt-4 border-t">
          <h2 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Users className="h-4 w-4" /> Online Members
          </h2>
          <ul className="space-y-3">
            {onlinePresences.map((p) => (
              <li key={p.user_id} className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-muted-foreground">{p.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-3/4 flex flex-col h-full">
        {activeChannel ? (
          <>
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg text-card-foreground">
                # {activeChannel.name}
              </h3>
              <ChannelMembersManager
                channelId={activeChannel.id}
                channelName={activeChannel.name}
                memberCount={activeChannel.member_count}
              />
            </div>
            <div
              ref={messagesContainerRef}
              className="flex-1 p-4 overflow-y-auto"
            >
              {isPending ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {message.profiles?.full_name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <p className="font-semibold text-card-foreground">
                            {message.profiles?.full_name || "Anonymous"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(message.created_at), "MMM d, p")}
                          </p>
                        </div>
                        <p className="whitespace-pre-wrap text-card-foreground">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="h-6 px-4 text-xs text-muted-foreground italic">
              {typing.length > 0 &&
                `${typing.map((p) => p.full_name).join(", ")} ${typing.length > 1 ? "are" : "is"} typing...`}
            </div>
            <div className="border-t p-4 bg-background">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder={`Message #${activeChannel.name}`}
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a channel to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}
