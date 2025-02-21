"use client";

import { UserButton } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "../store/chat-store";
import { ThemeSwitch } from "../themeSwitch/ThemeSwitch";
import UserListDialog from "../userListDialog/UserListDialog";
import Conversation from "./components/conversation/Conversation";

const LeftPanel = () => {
  const { isAuthenticated } = useConvexAuth();
  const conversations = useQuery(api.conversations.getMyConversations);

  const { selectedConversation, setSelectedConversation } =
    useConversationStore();

  useEffect(() => {
    const conversationIds = conversations?.map(
      (conversation) => conversation._id
    );
    if (
      selectedConversation &&
      conversationIds &&
      !conversationIds.includes(selectedConversation._id)
    ) {
      setSelectedConversation(null);
    }
  }, [conversations, selectedConversation, setSelectedConversation]);

  return (
    <div className="h-full w-1/4 border-r">
      <div className="p-3 flex justify-between items-center border-b">
        <UserButton />
        <div className="flex items-center gap-3">
          {isAuthenticated && <UserListDialog />}
          <ThemeSwitch />
        </div>
      </div>
      <div className="p-3 flex flex-col gap-1 h-[calc(100%-4rem)] scroll-smooth overflow-auto">
        {conversations?.map((conversation) => (
          <Conversation key={conversation._id} conversation={conversation} />
        ))}
        {conversations?.length === 0 && (
          <>
            <p className="text-center text-gray-500 text-sm mt-3">
              No conversations yet
            </p>
            <p className="text-center text-gray-500 text-sm mt-3 ">
              We understand {"you're"} an introvert, but {"you've"} got to start
              somewhere 😊
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;
