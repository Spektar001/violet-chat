"use client";

import GroupMembersDialog from "@/components/rightPanel/groupMembersDialog/GroupMembersDialog";
import MessageContainer from "@/components/rightPanel/messageContainer/MessageContainer";
import MessageInput from "@/components/rightPanel/messageInput/MessageInput";
import RightPanelFallback from "@/components/RightPanelFallback";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "convex/react";
import {
  ArrowLeft,
  EllipsisVertical,
  Eraser,
  SlidersHorizontal,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
  params: Promise<{ conversationId: Id<"conversations"> }>;
};

const ConversationPage = ({ params }: Props) => {
  const { conversationId } = use(params);
  const conversation = useQuery(api.conversation.getConversationById, {
    id: conversationId,
  });

  if (!conversation) {
    return <RightPanelFallback />;
  }

  const conversationName =
    conversation?.participantName || conversation?.groupName;
  const conversationImage =
    conversation?.otherUser?.image || conversation?.groupImage;

  return (
    <div className="w-3/4 h-full flex flex-col">
      <div className="py-3 px-5 flex justify-between items-center border-b">
        <div className="flex items-center gap-3">
          <Link href={"/v"}>
            <ArrowLeft className="mr-3 text-gray-400 hover:text-primary transition-colors duration-300" />
          </Link>
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

export default ConversationPage;
