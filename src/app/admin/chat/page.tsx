// src/app/admin/chat/page.tsx
"use client";
import { ChatClient } from "@/components/admin/ChatClient";

// This page now simply renders the client component.
export default function TeamChatPage() {
  return (
    <div className="w-full h-[calc(100vh-100px)]">
      <ChatClient />
    </div>
  );
}
