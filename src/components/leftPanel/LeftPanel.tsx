"use client";

import { UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import LeftPanelFallback from "../LeftPanelFallback";
import { ThemeSwitch } from "../themeSwitch/ThemeSwitch";
import UserListDialog from "../userListDialog/UserListDialog";
import Conversation from "./components/conversation/Conversation";

const LeftPanel = () => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const pathname = usePathname().replace("/v/", "");
  const conversations = useQuery(api.conversations.getMyConversations);
  const currentUser = useQuery(api.users.getMe);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!currentUser) return null;

  const shouldHidePanel = windowWidth < 899 && pathname !== "/v";

  if (shouldHidePanel) return null;

  if (!conversations && shouldHidePanel) {
    return <LeftPanelFallback />;
  }

  return (
    <div className={`h-full w-1/4 border-r dark:border-black left-panel`}>
      <div className="p-3 flex justify-between items-center">
        <UserButton />

        <div className="flex items-center gap-3">
          <UserListDialog />
          <ThemeSwitch />
        </div>
      </div>
      <div className="py-3 flex flex-col h-[calc(100%-4rem)] scroll-smooth overflow-auto">
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
