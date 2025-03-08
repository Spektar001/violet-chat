"use client";

import { useQuery } from "convex/react";
import {
  EllipsisVertical,
  Eraser,
  SlidersHorizontal,
  Trash,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import LoadingLogo from "../LoadingLogo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import GroupMembersDialog from "./components/groupMembersDialog/GroupMembersDialog";
import MessageContainer from "./components/messageContainer/MessageContainer";
import MessageInput from "./components/messageInput/MessageInput";

type RightPanelProps = {
  conversationId: Id<"conversations">;
};

const RightPanel = ({ conversationId }: RightPanelProps) => {
  const conversation = useQuery(api.conversation.getConversationById, {
    id: conversationId,
  });

  if (!conversation) {
    return <LoadingLogo />;
  }

  const conversationName =
    conversation?.participantName || conversation?.groupName;
  const conversationImage =
    conversation?.otherUser?.image || conversation?.groupImage;

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
            {conversation?.isGroup && (
              <GroupMembersDialog selectedConversation={conversation} />
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
      <MessageContainer selectedConversation={conversation} />
      <MessageInput selectedConversation={conversation} />
    </div>
  );
};

export default RightPanel;
