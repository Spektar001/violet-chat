"use client";

import { IConversation } from "@/components/store/chat-store";
import { useQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { api } from "../../../../../convex/_generated/api";
import ChatBubble from "../chatBubble/ChatBubble";

type MessageContainerProps = {
  selectedConversation: IConversation;
};

const MessageContainer = ({ selectedConversation }: MessageContainerProps) => {
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const messages = useQuery(api.messages.getMessages, {
    conversationId: selectedConversation!._id,
  });
  const currentUser = useQuery(api.users.getMe);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="py-3 px-5 flex-1 w-full flex flex-col gap-3 overflow-y-scroll no-scrollbar bg-chat-tile-light dark:bg-chat-tile-dark">
      <div className="flex flex-col max-w-full h-full">
        {messages?.map((message, idx) => (
          <div key={message._id} ref={lastMessageRef}>
            <ChatBubble
              message={message}
              currentUser={currentUser}
              previousMessage={idx > 0 ? messages[idx - 1] : undefined}
              selectedConversation={selectedConversation}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageContainer;
