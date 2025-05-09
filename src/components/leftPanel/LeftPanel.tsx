"use client";

import { UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import LeftPanelFallback from "../LeftPanelFallback";
import { ThemeSwitch } from "../themeSwitch/ThemeSwitch";
import UserListDialog from "../userListDialog/UserListDialog";
import Conversation from "./components/conversation/Conversation";

const LeftPanel = () => {
  const pathname = usePathname().replace("/v/", "");
  const conversations = useQuery(api.conversations.getMyConversations);
  const currentUser = useQuery(api.users.getMe);

  if (!conversations) {
    return <LeftPanelFallback />;
  }
  if (!currentUser) return null;

  return (
    <div className="h-full w-1/4 border-r dark:border-black">
      <div className="p-3 flex justify-between items-center">
        <UserButton />

        <div className="flex items-center gap-3">
          <UserListDialog />
          <ThemeSwitch />
        </div>
      </div>
      <div className="p-3 flex flex-col gap-1 h-[calc(100%-4rem)] scroll-smooth overflow-auto">
        {conversations?.map((conversation) => (
          <Conversation
            key={conversation._id}
            conversation={conversation}
            currentUser={currentUser}
            pathname={pathname}
          />
        ))}
        {conversations?.length === 0 && (
          <>
            <p className="text-center text-gray-500 text-sm mt-3">
              No conversations yet
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;
