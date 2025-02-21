"use client";

import {
  EllipsisVertical,
  Eraser,
  SlidersHorizontal,
  Trash,
} from "lucide-react";
import { useConversationStore } from "../store/chat-store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ChatPlaceHolder from "./components/chatPlaceHolder/ChatPlaceHolder";
import GroupMembersDialog from "./components/groupMembersDialog/GroupMembersDialog";
import MessageContainer from "./components/messageContainer/MessageContainer";
import MessageInput from "./components/messageInput/MessageInput";

const RightPanel = () => {
  const { selectedConversation } = useConversationStore();

  if (!selectedConversation) return <ChatPlaceHolder />;

  const conversationName =
    selectedConversation.name || selectedConversation.groupName;
  const conversationImage =
    selectedConversation.image || selectedConversation.groupImage;

  return (
    <div className="w-3/4 h-full flex flex-col">
      <div className="py-3 px-5 flex justify-between items-center border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={conversationImage || "/placeholder.png"}
              className="object-cover"
            />
            <AvatarFallback>
              <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p>{conversationName}</p>
            {selectedConversation.isGroup && (
              <GroupMembersDialog selectedConversation={selectedConversation} />
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <EllipsisVertical className="text-gray-400 hover:text-primary duration-300 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <SlidersHorizontal />
              Manage group
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Eraser />
              Сlear history
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash />
              Delete chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <MessageContainer />
      <MessageInput />
    </div>
  );
};

export default RightPanel;
